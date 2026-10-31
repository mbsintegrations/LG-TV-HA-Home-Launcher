# TODO / roadmap

The next update focuses on stability, usability and broader TV testing. These are planned tasks, not completed validation or a commitment to a release date. The latest published features are listed in the [changelog](CHANGELOG.md).

## Next release

- [ ] **Helper launch confirmation:** verify actual controller/worker readiness after LG accepts a launch request. Test one bounded retry when no controller starts, stale status from a previous boot, clear failure feedback, and keeping the foreground app unchanged during automatic startup.
- [ ] **Standby/startup reliability:** test the new bounded Home-button helper recovery after a long suspension on the Living Room TV, including repeated standby/wake, YouTube → Home and the intentional LG Home escape. Keep native release safeguards intact; investigate startup foreground switching separately if it persists.
- [ ] **Latency startup delay:** include the implemented 10-second delay before footer latency checks start or resume. Verify the readings appear after the delay and polling stays stopped while Home is hidden. Both changes await TV acceptance and the next release.
- [ ] **Background and Glass performance:** test image rotation and Glass together on real TVs, particularly older models. Check remote responsiveness, app switching, suspend/resume and longer viewing sessions; tune defaults or document practical limits based on the results.
- [ ] **Network tools on older TVs:** test the current Speed Test and optional router/internet TCP latency on OLED65CX6LA and OLED55B7V-Z. Check completion, cancellation, saved results and polling while visible/hidden. The original community base-app report used version 0.2.0; network tools arrived in 0.4.0.
- [ ] **Compatibility records:** record the launcher version, TV model, firmware, reported webOS/SDK and the individual features tested for each new report. Keep base-app, helper, network-tool and visual-performance results separate in the [validation record](docs/VALIDATION.md).
- [ ] **Community fixes and requests:** review incoming [issues](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues), reproduce reported problems and link accepted fixes or additions here before assigning them to a release.

## Already released

- [x] **0.2.0:** app logos and presets, Live TV/Guide tiles, four layout themes and configurable colours.
- [x] **0.3.0:** uploaded backgrounds and rotation, card styling, the optional theme customizer and animated house energy flow.
- [x] **0.4.0:** embedded Cloudflare Speed Test and optional router/internet TCP latency.

## Outside the current scope

Permanent camera feeds in launcher tiles are not planned. Use the separate [LG Camera Overlay](https://github.com/mbsintegrations/LG-Camera-Overlay) project for camera viewing.

## Suggest an improvement or report a result

Open a [GitHub issue](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/issues/new/choose). Include the launcher version, TV model, firmware and reported webOS/SDK, plus what worked or how to reproduce the problem. Do not attach HA tokens, pairing keys or private configured IPKs. See [Contributing](CONTRIBUTING.md).

As tasks are completed, link the relevant issue or pull request, tick the item and record released changes in the changelog.
