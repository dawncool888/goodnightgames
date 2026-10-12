import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const placements = {
  extra_plays: { unit: 'p7shgce3rk', type: 'plays', amount: 3 },
  extra_wishes: { unit: 'p7jgsr8cj8', type: 'wishes', amount: 1 },
  coin_reward: { unit: 'f8jmrtrxqv', type: 'coins', amount: 35 },
};
const prod = { DEV: false, PROD: true, VITE_ENABLE_MOCKS: 'true' };
const dev = { DEV: true, PROD: false, VITE_ENABLE_MOCKS: 'true' };
function storage() {
  const values = new Map();
  return {
    values, getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}
async function harness({ env = prod, bridge, store = storage(), code, hooks = false } = {}) {
  const timers = new Map();
  let nextTimer = 0;
  const context = vm.createContext({
    console, crypto: webcrypto, window: { harmonyBridge: bridge, localStorage: store },
    localStorage: store, __GOODNIGHT_ENABLE_MOCKS__: true,
    setTimeout: callback => { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
  });
  const modules = new Map();
  const reactState = [];
  let cursor = 0;
  const react = new vm.SyntheticModule(['useState', 'useRef'], function () {
    this.setExport('useState', initial => {
      const slot = cursor++;
      reactState[slot] ??= initial;
      return [reactState[slot], value => { reactState[slot] = value; }];
    });
    this.setExport('useRef', initial => ({ current: initial }));
  }, { context });
  async function load(file) {
    if (modules.has(file)) return modules.get(file);
    const source = await readFile(file, 'utf8');
    const javascript = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    const module = new vm.SourceTextModule(javascript, {
      context, identifier: file, initializeImportMeta: meta => { meta.env = Object.freeze(env); },
    });
    modules.set(file, module);
    return module;
  }
  const linker = async (specifier, parent) => {
    if (specifier === 'react') return react;
    return load(resolve(dirname(parent.identifier), `${specifier}.ts`));
  };
  let entry;
  if (code) entry = new vm.SourceTextModule(code, { context });
  else entry = await load(resolve(root, hooks ? 'hooks/useAuth.ts' : 'services/adService.ts'));
  await entry.link(linker);
  await entry.evaluate();
  const auth = await load(resolve(root, 'services/authService.ts'));
  if (auth.status === 'unlinked') await auth.link(linker);
  if (auth.status !== 'evaluated') await auth.evaluate();
  const mode = await load(resolve(root, 'services/runtimeMode.ts'));
  if (mode.status === 'unlinked') await mode.link(linker);
  if (mode.status !== 'evaluated') await mode.evaluate();
  return { ad: entry.namespace, auth: auth.namespace, mode: mode.namespace, context, store, reactState,
    expire: () => { for (const callback of [...timers.values()]) callback(); },
    pendingTimers: () => timers.size };
}
function receipt(placement, requestId, tx = 'native-tx-1') {
  const expected = placements[placement];
  return { success: true, rewarded: true, verified: true, source: 'native', event: 'reward_earned',
    requestId, placementId: placement, adUnitId: expected.unit, transactionId: tx,
    reward: { type: expected.type, amount: expected.amount } };
}
function bridgeReturning(transform = value => value) {
  return { adProtocolVersion: 2, showRewardedAd: async (placement, id) => transform(receipt(placement, id)) };
}

for (const placement of Object.keys(placements)) {
  test(`${placement}: missing and old bridges fail even with production Mock flag`, async () => {
    for (const bridge of [undefined, { showRewardedAd: async () => ({ success: true }) }]) {
      const h = await harness({ bridge });
      assert.equal(h.mode.isMockEnabled(), false);
      assert.equal(await h.ad.canShowAd(placement), false);
      const result = await h.ad.showRewardedAd(placement);
      assert.equal(result.success, false);
      assert.equal(h.ad.consumeAdReward(result), false);
    }
  });
  test(`${placement}: strict valid object/JSON receipt and single consumption`, async () => {
    for (const format of [value => value, JSON.stringify]) {
      const h = await harness({ bridge: bridgeReturning(format) });
      assert.equal(await h.ad.canShowAd(placement), true);
      const result = await h.ad.showRewardedAd(placement);
      assert.equal(result.success, true);
      assert.equal(result.source, 'native');
      assert.equal(result.reward.type, placements[placement].type);
      assert.equal(result.reward.amount, placements[placement].amount);
      assert.equal(h.ad.consumeAdReward({ ...result }), false);
      assert.equal(h.ad.consumeAdReward(result), true);
      assert.equal(h.ad.consumeAdReward(result), false);
      assert.equal(Object.isFrozen(result), true);
      assert.equal((await h.ad.showRewardedAd(placement)).error, 'DUPLICATE_REWARD');
      assert.equal(h.pendingTimers(), 0);
      const reload = await harness({ bridge: bridgeReturning(format), store: h.store });
      assert.equal((await reload.ad.showRewardedAd(placement)).error, 'DUPLICATE_REWARD');
    }
  });
  test(`${placement}: malformed, mismatched, closed, unverified or inflated receipt grants nothing`, async () => {
    const variants = [
      () => null, () => '{broken', () => [],
      value => ({ ...value, success: 'true' }), value => ({ ...value, success: false }),
      value => ({ ...value, rewarded: false }), value => ({ ...value, rewarded: 'true' }),
      value => ({ ...value, verified: undefined }), value => ({ ...value, verified: 'true' }),
      value => ({ ...value, source: 'mock' }), value => ({ ...value, event: 'closed' }),
      value => ({ ...value, requestId: 'stale-request' }), value => ({ ...value, placementId: 'wrong' }),
      value => ({ ...value, adUnitId: 'wrong-unit' }),
      value => ({ ...value, transactionId: '' }), value => ({ ...value, transactionId: ' ' }),
      value => ({ ...value, transactionId: 'mock:fake' }),
      value => ({ ...value, reward: undefined }),
      value => ({ ...value, reward: { type: 'wrong', amount: value.reward.amount } }),
      ...[0, -1, 1.5, NaN, Infinity, '35', 999999].map(amount => value => ({ ...value, reward: { ...value.reward, amount } })),
    ];
    for (const transform of variants) {
      const h = await harness({ bridge: bridgeReturning(transform) });
      const result = await h.ad.showRewardedAd(placement);
      assert.equal(result.success, false);
      assert.equal(h.ad.consumeAdReward(result), false);
      assert.equal(h.store.values.size, 0);
    }
  });
  test(`${placement}: only explicit dev Mock succeeds and uses test storage namespace`, async () => {
    for (const env of [dev, { ...dev, VITE_ENABLE_MOCKS: undefined }, { ...dev, VITE_ENABLE_MOCKS: 'false' }, {}]) {
      const h = await harness({ env });
      const enabled = env === dev;
      assert.equal(h.mode.isMockEnabled(), enabled);
      assert.equal(h.mode.runtimeStorageKey('wishCoins'), enabled ? 'goodnightgames.mock.wishCoins' : 'wishCoins');
      const result = await h.ad.showRewardedAd(placement);
      assert.equal(result.success, enabled);
      if (enabled) { assert.equal(result.source, 'mock'); assert.equal(h.ad.consumeAdReward(result), true); }
      assert.equal(h.store.values.size, 0); // No native transaction/revenue ledger from Mock.
    }
  });
}

test('cross-placement parallel calls reject; late result after timeout never grants; retry works', async () => {
  let resolveNative;
  let oldReceipt;
  const bridge = { adProtocolVersion: 2, showRewardedAd: (placement, id) => {
    oldReceipt = receipt(placement, id);
    return new Promise(resolve => { resolveNative = resolve; });
  } };
  const h = await harness({ bridge });
  const first = h.ad.showRewardedAd('coin_reward');
  await Promise.resolve();
  assert.equal(await h.ad.canShowAd('extra_plays'), false);
  assert.equal((await h.ad.showRewardedAd('extra_plays')).error, 'AD_IN_PROGRESS');
  h.expire();
  assert.equal((await first).error, 'AD_TIMEOUT');
  resolveNative(oldReceipt);
  await Promise.resolve();
  assert.equal(h.store.values.size, 0);
  bridge.showRewardedAd = async (placement, id) => receipt(placement, id, 'retry-tx');
  assert.equal((await h.ad.showRewardedAd('coin_reward')).success, true);
});

test('exceptions, invalid ledger and persistence failures grant nothing', async () => {
  for (const store of [
    { getItem() { throw new Error('storage denied'); } },
    { getItem() { return 'bad json'; } },
    { getItem() { return '{}'; } },
    { getItem() { return '[false]'; } },
    { getItem() { return null; }, setItem() { throw new Error('quota'); } },
  ]) {
    const h = await harness({ bridge: bridgeReturning(), store });
    assert.equal((await h.ad.showRewardedAd('coin_reward')).success, false);
  }
  const h = await harness({ bridge: { adProtocolVersion: 2, showRewardedAd() { throw new Error('no inventory'); } } });
  assert.equal((await h.ad.showRewardedAd('coin_reward')).error, 'AD_FAILED');
  assert.equal((await h.ad.showRewardedAd('invalid')).error, 'INVALID_PLACEMENT');
  assert.equal(await h.ad.canShowAd('__proto__'), false);
});

test('login missing, rejected, invalid JSON, invalid ID and mock profile are failures without fallback', async () => {
  const invalid = [null, false, {}, { id: 42 }, { id: ' ' }, { id: 'mock_user_123' },
    { id: 'real', isMock: true }, { id: 'real', source: 'mock' }, { id: 'real', name: {} }, '{bad'];
  assert.equal(await (await harness()).auth.handleLoginRequest(), null);
  for (const value of invalid) {
    const h = await harness({ bridge: { login: async () => value } });
    assert.equal(await h.auth.handleLoginRequest(), null);
  }
  const h = await harness({ bridge: { login() { throw new Error('cancel'); } } });
  assert.equal(await h.auth.handleLoginRequest(), null);
  const mock = await harness({ env: dev });
  assert.equal((await mock.auth.handleLoginRequest()).source, 'mock');
});

test('native login object/JSON succeeds, timeout/concurrent login cannot create a user', async () => {
  for (const value of [{ id: 'real-user', name: 'User' }, JSON.stringify({ id: 'real-user' })]) {
    const h = await harness({ bridge: { login: async () => value } });
    assert.equal((await h.auth.handleLoginRequest()).source, 'native');
  }
  let finish;
  const h = await harness({ bridge: { login: () => new Promise(resolve => { finish = resolve; }) } });
  const pending = h.auth.handleLoginRequest();
  await Promise.resolve();
  assert.equal(await h.auth.handleLoginRequest(), null);
  h.expire();
  assert.equal(await pending, null);
  finish({ id: 'late-user' });
  assert.equal(h.pendingTimers(), 0);
});

test('login hook starts as guest, rejects stale cached mock identity, and grants bonus once', async () => {
  const store = storage();
  store.setItem('user', JSON.stringify({ id: 'mock_user_123', isGuest: false }));
  let calls = 0;
  const bridge = { login: async () => { calls++; return { id: 'real-user', name: 'User' }; } };
  const h = await harness({ bridge, store, hooks: true });
  let bonuses = 0;
  const session = h.ad.useAuth(() => bonuses++);
  assert.equal(session.user.isGuest, true);
  await Promise.all([session.login(), session.login()]);
  assert.equal(calls, 1);
  assert.equal(bonuses, 1);
  await session.login();
  assert.equal(bonuses, 1);
  const reload = await harness({ bridge, store, hooks: true });
  await reload.ad.useAuth(() => bonuses++).login();
  assert.equal(bonuses, 1);
});

test('actual production bundle refuses Mock even with mode development and explicit Mock flag', async () => {
  const output = await build({ configFile: false, envFile: false, mode: 'development', logLevel: 'silent',
    define: { 'import.meta.env.VITE_ENABLE_MOCKS': JSON.stringify('true') },
    build: { write: false, minify: false,
      lib: { entry: resolve(root, 'services/adService.ts'), formats: ['es'], fileName: 'ads' } },
  });
  const bundle = Array.isArray(output) ? output[0] : output;
  const code = bundle.output.find(item => item.type === 'chunk' && item.isEntry).code;
  const h = await harness({ code, env: dev });
  assert.equal(await h.ad.canShowAd('coin_reward'), false);
  assert.equal((await h.ad.showRewardedAd('coin_reward')).error, 'BRIDGE_UNAVAILABLE');
});
