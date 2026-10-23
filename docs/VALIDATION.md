# Validation and compatibility

## TV installations

The original launcher is installed on two LG TVs: an OLED65B9PLA and a 65NANO766QA. The configurable community edition builds on that work; its Living Room test is being prepared.

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

Native filter tests separately cover Home press/repeat/hold, other keys, pointer/wheel and overflow release. A host-native test plus ARM cross-build proves compilation/filter logic, not actual LG input permissions or physical remote behavior.

## Package checks

The base sample IPK is built with LG's official packager. It must contain a validated profile, generated theme, an empty connection object and the community app ID. Synthetic private builds must retain their fake test credential only inside ignored private output. Helper probe/final package checks must inspect UID/GID/modes and verify the probe has no credentials. These are local artifact checks, not TV installation tests.

## Reference TVs

| Model | Firmware | Reported SDK | Scope |
|---|---|---|---|
| OLED65B9PLA | 05.50.00 | 4.10.0 | Original launcher installed; UI and selected Home-button helper functions tested |
| 65NANO766QA | 04.60.91 | 7.6.0 | Original launcher installed; UI, HA controls and native helper capability/release checks tested |

SDK version is not firmware version or a separately verified marketing webOS version. Chromium 53/ES5 and Node 0.12 compatibility are source constraints retained from the B9. No universal minimum-version claim is made.
