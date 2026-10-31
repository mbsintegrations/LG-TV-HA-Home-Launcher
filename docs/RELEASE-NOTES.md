# LG TV – HA Home Launcher 0.5

Release candidate — not yet published.

This stability update improves Home-button startup and recovery after standby, and gives the launcher ten seconds to settle before optional latency checks begin. Your layout, colours, apps, controls and saved profile remain unchanged.

## Fixed

- Verify that the helper controller and worker actually started. An accepted LG launch request alone no longer counts as active.
- Retry once if no controller reports within ten seconds. If startup still fails, show an error and leave the helper paused for manual Resume.
- Ignore stale reports and unfinished startup deadlines from a previous TV boot.
- Recover after a long suspension only after remote release and old-process exit are confirmed. Repeated failures stay paused; intentional pauses, long Home and LG Home escape keep their behavior.
- Keep the current app visible during automatic helper startup/recovery.

## Improved

- Optional TCP latency checks start ten seconds after opening or returning to Home. Hiding Home cancels the pending start; polling remains paused during Speed Test.
- Helper package/controller and service are now version 0.2.0, paired with launcher 0.5.
- Added a per-feature compatibility report and repeatable TV checks for backgrounds, Glass, Speed Test and TCP latency. Updated the roadmap and upgrade/recovery instructions.

## Updating

Without a helper, import your saved profile into the new configurator, reconnect HA and rebuild your private launcher package.

With the optional helper, rebuild and install **both private packages** from the same source using your existing per-TV options. Pause and confirm input release first, install the pair, open Home and select Resume once if needed. Wait for **Home button active** before testing. Keep the previous working pair for rollback. The public sample has no HA token and must not replace your configured installation.

See [Updates and recovery](UPDATES-AND-RECOVERY.md#updating-to-05) and the [helper guide](HOME-BUTTON-HELPER.md).

## Tested scope

The OLED65B9PLA owner confirmed reliable standby startup and YouTube → Home with the 29 October test build. The additional pending-startup reboot correction has automated regression coverage and still needs a physical candidate check. Exact latency-delay observation, cold boot and long Home escape on the final candidate remain tracked.

Background/Glass performance on real TVs and separate network-tool reports for OLED65CX6LA and OLED55B7V-Z are still outstanding. Existing base/helper compatibility reports remain valid for their stated scope. See [Validation](VALIDATION.md), [TV testing](TV-TESTING.md) and the [TODO](../TODO.md).
