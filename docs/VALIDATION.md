# Validation and compatibility

## TV installations

The configurable community launcher was installed on an OLED65B9PLA and a 65NANO766QA on 23 October 2026, with separate room profiles and the Dusk (plum) palette. Both installations include the Home-button helper.

Automated tests use sample profiles, fictional entity IDs and synthetic credentials.

## Automated coverage

Run `npm test` and `npm run check`. Coverage includes:

- Profile validation, unsupported versions/fields, recovery tile retention, duplicates and limits.
- Six built-in palettes, validated custom colours and old-webOS-compatible generated CSS.
- Temperature/status/power mappings, unavailable values and units/sign conversion.
- State-dependent explicit actions; disconnect handling; no command replay; no false physical-success claim.
- Helper pause/release, stale native sessions, process liveness and watched-app policy.
- Loopback wizard Host/Origin/session checks, synthetic HA discovery, token omission from preview/export, no control endpoint, inaccessible private folders and missing-entity build rejection.
- ES5 parsing for TV and old-Node helper scripts, documentation links, and a targeted secret/private-deployment-reference scan.

Native filter tests cover Home press/repeat/hold, other keys, pointer/wheel and overflow release. Both reference TVs also passed the native input compatibility probe and remote-release checks for pipe closure and missed heartbeats.

## Package checks

The sample IPK is built with LG's official packager and contains a validated profile, generated theme, an empty connection object and the community app ID. Package checks cover credential handling, helper file ownership and permissions. Installed app files on both reference TVs matched their configured build files.

## Reference TVs

| Model | Firmware | Reported SDK | Scope |
|---|---|---|---|
| OLED65B9PLA | 05.50.00 | 4.10.0 | Community launcher installed; plum layout, live HA connection and physical Home-button return from YouTube confirmed |
| 65NANO766QA | 04.60.91 | 7.6.0 | Community launcher installed; native input probe, remote-release checks and active HA-connected helper verified |

SDK version is not firmware version or a separately verified marketing webOS version. Chromium 53/ES5 and Node 0.12 compatibility are source constraints retained from the B9. No universal minimum-version claim is made.
