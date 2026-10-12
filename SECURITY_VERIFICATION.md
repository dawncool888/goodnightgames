# Security Verification

This note documents the safety patch on `codex/reward-callback-safety`. It does not claim that HarmonyOS native advertising is integrated or that any revenue has been earned.

## H5 / development Mock

- Production builds reject a missing or old Bridge and never create a simulated user.
- Mock is enabled only when Vite sets `import.meta.env.DEV === true`, `PROD === false`, and `VITE_ENABLE_MOCKS=true`.
- Mock results carry `source: "mock"` and use a separate local-storage namespace. They must not be reported as ad revenue.

## Native callback contract

Each of `extra_plays`, `extra_wishes`, and `coin_reward` requires Bridge protocol v2 and a `reward_earned` receipt matching the request ID, placement, ad unit ID, fixed reward, `verified: true`, and a unique transaction ID. Missing, malformed, failed, unverified, mismatched, timed-out, duplicate, or persistence-failed callbacks return failure and award nothing. A result is consumed once by the UI.

## Verification commands

- Simulated tests: `npm run test:security` (18 tests cover all three placements, malformed callbacks, replay, timeout, Mock isolation, login, and a production bundle check).
- H5 build: `npm run build`. The checked main commit currently lacks the component files imported by `App.tsx`, so a full build remains blocked until those sources are restored.
- Real HarmonyOS device: provide a native v2 Bridge, run each placement on a device, verify a provider-issued reward-earned callback and unique transaction, then confirm failure/timeout/replay cases award nothing. This device check is still pending.
