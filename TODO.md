# TODO / roadmap

The next update focuses on stability, usability and broader TV testing. These are planned tasks, not completed validation or a commitment to a release date. The latest published features are listed in the [changelog](CHANGELOG.md).

## Next release

- [ ] Physical TV acceptance of calendar and live preview-derived layouts; multiple calendars, timezone/DST and stale/disconnected states.
- [ ] Sustained playback acceptance after the startup false-off guard; investigate underlying off/on reports. Longer outages can still pass the guard.
- [ ] Repeated standby/app-exit, physical eight-second emergency release/arrows/volume and LG Home tile recovery across models.
- [ ] Background/Glass performance comparison on real TVs, including older models.
- [ ] Separate Speed Test/cancellation/saved-result and TCP latency results on OLED65CX6LA and OLED55B7V-Z.
- [ ] Cold-boot and longer-use compatibility reports across models.
- [ ] Dependency follow-up: patched official desktop CLI and legacy helper WebSocket dependency; do not force an incompatible upgrade. See [security audit](docs/SECURITY.md).

## Completed in 0.6

- [x] Accepted Home-return correction from [#14](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/pull/14), tracked in [#13](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/13), with updated hold/recovery documentation.
- [x] Startup blueprint minimum-off guard and migration instructions for existing automations.
- [x] [#17](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/17): C6 compatibility record, Sidebar status spacing, connection settings retention and optional live preview.
- [x] [#18](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/18): calendar card with merged sources, labels/colours, today/3/7/14-day horizon and 3–5 events.
- [x] One/two/three-card selection and positioning, with existing settings preserved.

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
