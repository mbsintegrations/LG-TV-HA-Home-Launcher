# Validation and compatibility

## TV installations

The configurable community launcher was installed on an OLED65B9PLA and a 65NANO766QA on 23 October 2026, with separate room profiles and the Dusk (plum) palette. Both installations include the Home-button helper.

Automated tests use sample profiles, fictional entity IDs and synthetic credentials.

### 0.2.0 functional test — 24 October 2026

The Living Room OLED65B9PLA was updated with eight tiles in the Dusk palette. The owner confirmed live HA, Live TV, TV Guide through HA and Home-button return from YouTube. Installed JavaScript/profile hashes matched the private build and the existing helper reported active. Both reference TVs were then updated to the completed 0.2.0 layout build: Panorama/Slate on OLED65B9PLA and Weather/Dusk on 65NANO766QA. The owner accepted the Panorama appearance on TV before the Slate change. Installed source/profile hashes matched each build and both Home helpers reported active after the updates.

The B9 recognises the legacy YouTube Kids app ID, but standalone Kids playback was not tested. Direct Guide IDs were unavailable on this B9; its Guide overlay uses the HA remote-button route. Other streaming presets are documented editable IDs and were not all physically tested.

### 0.3.0 backgrounds, customizer and energy flow — 25 October 2026

The animated house renderer was installed on both reference TVs on 24 October, preserving their existing Panorama/Slate and Weather/Dusk configurations. Installed file hashes matched each private package and both Home-button helpers reported active. The owner confirmed the Living Room house view looked good. This was an energy-only update; background rotation and Glass performance have browser coverage but have not had physical TV performance acceptance.

The optional customizer is covered by automated checks for image dimensions/size/format, profile migration, bounded rotation, visibility handling, blur correctness, row ordering and session recovery. Energy tests cover optional/missing sensors, units, sign inversion, idle/unavailable readings and disconnect behavior. Release screenshots use fictional sample data and generated backgrounds.

## Automated coverage

Run `npm test` and `npm run check`. Coverage includes:

- Profile validation, unsupported versions/fields, recovery tile retention, duplicates and limits.
- Old-profile text defaults, common app presets, local logo assets and fallback paths, and Guide-mode entity validation.
- Guide sends only the configured TV's GUIDE command, blocks disconnected/unavailable targets and repeated requests, and does not replay on reconnect.
- Independent layout/palette selection, Classic defaults for old profiles, six-control limits and optional read-only Sun subscriptions.
- Six built-in palettes, validated custom colours and old-webOS-compatible generated CSS.
- 35 actual browser screenshots: all five layouts in six preset palettes, plus a custom example per layout. Footer active/paused states were also checked in a browser fixture.
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
| OLED65B9PLA | 05.50.00 | 4.10.0 | 0.2.0 installed, Panorama/Slate; live HA, Live TV, HA Guide and physical Home return from YouTube confirmed during testing |
| 65NANO766QA | 04.60.91 | 7.6.0 | 0.2.0 installed, Weather/Dusk; live HA, Home return from YouTube, bedroom controls and appliance card confirmed on the preceding configured build |
| 43UN73906LE | Not reported | Not reported | User-verified: all features working, including the Home-button helper (reported 24 October 2026) |

The webOS version for 43UN73906LE has not been reported.

SDK version is not firmware version or a separately verified marketing webOS version. Chromium 53/ES5 and Node 0.12 compatibility are source constraints retained from the B9. No universal minimum-version claim is made.
