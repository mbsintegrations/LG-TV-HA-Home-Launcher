# Validation and compatibility

## Candidate scope

This is a separate community implementation using a new app ID. **No package from it has been installed on the owner's Living Room or Master Bedroom TV.** Both working private installations and HA automations are outside this change.

Validation runs use fictional entity IDs, sample values and synthetic tokens. The setup wizard has no actuation or TV installation API. Live discovery against the owner's HA is not part of this candidate review.

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
| OLED65B9PLA | 05.50.00 | 4.10.0 | Private predecessor browser/UI and selected physical helper behaviors |
| 65NANO766QA | 04.60.91 | 7.6.0 | Private predecessor UI/HA controls, native capability/release checks; physical helper/restart acceptance incomplete |

SDK version is not firmware version or a separately verified marketing webOS version. Chromium 53/ES5 and Node 0.12 compatibility are source constraints retained from the B9. No universal minimum-version claim is made.

## Before calling the community release TV-validated

After owner approval, test the community build on an explicitly chosen test TV, without replacing the working private installations unexpectedly:

- Fresh install, configured update, app reopening, suspend/resume and Developer Mode recovery.
- Real HA connection and older-TV TLS trust; data updates while visible, disconnect/reconnect, controls unavailable when stale.
- Five and eight tiles; short/long labels; generic status items; no solar/no status cards; six presets and a custom palette at TV distance.
- Every app/HDMI tile and physical remote/pointer/volume behavior.
- Light confirmation and selected gate/cover controls only with appropriate physical preparation.
- Optional helper probe, ownership, native release tests, short/hold Home, LG Home tile, each watched app exit, standby and cold boot.
- Performance comparison with the app/helper absent, paused and active. Bedroom sluggishness remains unresolved.
- Startup blueprint imported into an isolated HA test instance, then physical acceptance on the chosen TV.

Windows is the currently exercised setup host. macOS/Linux routes are documented and CI-ready, but must not be labelled physically tested until those runs occur. CI definitions are not evidence that hosted CI ran.
