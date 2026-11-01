# TODO / roadmap

The next update focuses on stability, usability and broader TV testing. These are planned tasks, not completed validation or a commitment to a release date. The latest published features are listed in the [changelog](CHANGELOG.md).

## Next release — 0.6

- [ ] **Home return after extended viewing — [current issue #13](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/13):** a normal short Home press failed after approximately two hours of YouTube. The captured helper was still paused from an earlier LG Home escape; this does not establish a two-hour timeout or explain every earlier incident. [Draft correction #14](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/pull/14) is installed for Living Room testing. Automated and native release checks pass; extended playback, physical escape/return, standby and the separate LG Home tile remain to verify. Keep this open until owner acceptance; no new release yet.
- [ ] **Background and Glass performance:** follow the [comparison procedure](docs/TV-TESTING.md#backgrounds-and-glass) on real TVs, including older models, app switching, standby and longer use. Adjust defaults only if observations justify it.
- [ ] **Network tools on older TVs:** obtain separate Speed Test/cancellation/saved-result and TCP latency results for OLED65CX6LA and OLED55B7V-Z using the [network checklist](docs/TV-TESTING.md#network-tools). Earlier base/helper reports do not establish network support.
- [ ] **Broader startup coverage:** record cold boot separately from remote standby and gather longer-use results across more models. The B9's accepted 0.5 standby/YouTube result is in [Validation](docs/VALIDATION.md#05-stability-update--31-october-2026).
- [ ] **Compatibility and community reports:** continue collecting exact release/model/firmware/SDK and per-feature results with the [report template](.github/ISSUE_TEMPLATE/compatibility_report.md). Review new issues and link accepted changes here.
- [ ] **Dependency follow-up:** review a patched official desktop CLI tree and legacy helper WebSocket dependency. The [31 October audit](docs/SECURITY.md#dependency-audit-snapshot-31-october-2026) remains unresolved; compatible lockfile repair made no changes. Do not force a CLI downgrade or replace the old-TV helper runtime without separate verification.

These remaining checks are carried forward explicitly; a passing result on one model is not substituted for another model's test.

## Completed in 0.5

Implemented through [PR #12](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/pull/12), with owner acceptance on OLED65B9PLA on 31 October 2026.

- [x] **Helper launch confirmation:** current-session readiness, one bounded missing-controller retry, clear failure state, stale-boot handling and foreground preservation.
- [x] **Standby/startup reliability:** bounded recovery; accepted Home return from YouTube and remote standby, plus long Home/LG Home escape and Resume.
- [x] **Latency startup delay:** initial/resumed checks wait ten seconds, cancelled when hidden; automated coverage and accepted on-TV readings.
- [x] **Compatibility records:** per-feature reporting template and repeatable performance/network testing instructions.
- [x] **Community review:** reviewed current PRs, commits, issues and discussion; no open community issues at the 31 October review.

## Earlier releases

- [x] **0.2:** app logos and presets, Live TV/Guide tiles, four layout themes and configurable colours.
- [x] **0.3:** uploaded backgrounds and rotation, card styling, optional theme customizer and animated house energy flow.
- [x] **0.4:** embedded Cloudflare Speed Test and optional router/internet TCP latency.

## Outside the current scope

Permanent camera feeds in launcher tiles are not planned. Use the separate [LG Camera Overlay](https://github.com/mbsintegrations/LG-Camera-Overlay) project for camera viewing.

## Suggest an improvement or report a result

Open a [GitHub issue](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/new/choose). Include the launcher version, TV model, firmware and reported webOS/SDK, plus what worked or how to reproduce the problem. Do not attach HA tokens, pairing keys or private configured IPKs. See [Contributing](CONTRIBUTING.md).

As tasks are completed, link the relevant issue or pull request, tick the item and record released changes in the changelog.
