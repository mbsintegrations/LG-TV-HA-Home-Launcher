# TODO / roadmap

The next update focuses on stability, usability and broader TV testing. These are planned tasks, not completed validation or a commitment to a release date. The latest published features are listed in the [changelog](CHANGELOG.md).

## Next release — 0.5

Implementation and preparation are tracked in [PR #12](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/pull/12). A checked item here means prepared or verified as described, not already released.

- [x] **Helper launch confirmation:** verify current controller/worker identities, allow one bounded retry when no controller reports, reject stale status, and show a startup failure. Automatic starts preserve the foreground app. A new boot clears a pending startup from the old boot; regression coverage includes intentional pauses.
- [x] **Standby/startup reliability:** bounded recovery is implemented. The OLED65B9PLA owner confirmed reliable standby startup and YouTube → Home on 31 October using the 29 October test build. See the exact [validation scope](docs/VALIDATION.md#05-stability-candidate--31-october-2026).
- [x] **Latency startup delay:** initial/resumed footer checks wait 10 seconds; hiding Home cancels that timer. Automated timing/visibility checks pass. Physical observation of the exact delay remains below.
- [x] **Compatibility records:** added a [per-feature test report](.github/ISSUE_TEMPLATE/compatibility_report.md) and [TV test procedure](docs/TV-TESTING.md); the validation record distinguishes base app, helper, network tools and visual performance.
- [x] **Community fixes and requests:** reviewed open PRs, recent commits, issues and PR discussion on 31 October. PR #9 is the only open PR; there were no open issues or review comments. Continue triage as reports arrive.

### Remaining physical checks for this update

- [ ] **Background and Glass performance:** follow the [comparison procedure](docs/TV-TESTING.md#backgrounds-and-glass) on real TVs, including older models, app switching, standby and longer use. Adjust defaults only if observations justify it.
- [ ] **Network tools on older TVs:** obtain separate Speed Test/cancellation/saved-result and TCP latency results for OLED65CX6LA and OLED55B7V-Z using the [network checklist](docs/TV-TESTING.md#network-tools). Earlier base/helper reports do not establish network support; network tools arrived in 0.4.0.
- [ ] **Final stability candidate:** test the additional pending-startup reboot correction on TV, the exact 10-second latency delay, cold boot and long Home/LG Home escape. Keep the accepted 29 October build distinct from later candidate changes.

All next-release items remain tracked here. Missing physical results are not inferred from build checks or another TV model, and will be carried forward explicitly if the stability release ships before those reports arrive.

### Dependency follow-up

- [ ] Review a patched official desktop CLI dependency tree and the legacy helper WebSocket dependency. The [31 October audit](docs/SECURITY.md#dependency-audit-snapshot-31-october-2026) remains unresolved; compatible lockfile repair made no changes. Do not force a CLI downgrade or replace the old-TV helper runtime without separate verification.

## Already released

- [x] **0.2.0:** app logos and presets, Live TV/Guide tiles, four layout themes and configurable colours.
- [x] **0.3.0:** uploaded backgrounds and rotation, card styling, the optional theme customizer and animated house energy flow.
- [x] **0.4.0:** embedded Cloudflare Speed Test and optional router/internet TCP latency.

## Outside the current scope

Permanent camera feeds in launcher tiles are not planned. Use the separate [LG Camera Overlay](https://github.com/mbsintegrations/LG-Camera-Overlay) project for camera viewing.

## Suggest an improvement or report a result

Open a [GitHub issue](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/new/choose). Include the launcher version, TV model, firmware and reported webOS/SDK, plus what worked or how to reproduce the problem. Do not attach HA tokens, pairing keys or private configured IPKs. See [Contributing](CONTRIBUTING.md).

As tasks are completed, link the relevant issue or pull request, tick the item and record released changes in the changelog.
