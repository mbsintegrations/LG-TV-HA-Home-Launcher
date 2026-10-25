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

## Expected platform compatibility

| webOS platform | Original TV release years | Current launcher expectation |
|---|---|---|
| **4.x and newer** | **2018 onward** | **Expected to work**, based on our Chromium 53 / ES5 target and the verified models below. This is not verification of every model or later platform release. |
| **3.x** | 2016–2017 | **Could work, but has not been tested.** Its older Chromium 38 engine may require compatibility changes. |
| **1.x–2.x** | 2014–2015 | Not currently supported or tested. A legacy adaptation would likely be needed for their older WebKit engines. |

LG introduced webOS 4.x with its 2018 TV generation. LG lists Chromium 53 for webOS 4.x, Chromium 38 for 3.x, and WebKit for 1.x–2.x in its [official web-engine specifications](https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine). Year ranges describe platform introductions, not a model-independent guarantee.

These expectations concern the **base launcher**. Developer Mode installation, app IDs, HA certificate compatibility and the optional native Home-button helper must be checked for the actual TV. A newer webOS version alone does not prove helper compatibility. Background rotation and Glass styling have browser coverage; physical TV performance acceptance for those options is still outstanding.

## Reference TVs

| Model | Platform generation | Firmware | Reported SDK | Scope |
|---|---|---|---|---|
| **OLED65B9PLA** — 2019, Living Room | webOS 4.x | 05.50.00 | **4.10.0** | Tested on our TV: 0.2.0 Panorama/Slate; live HA, app launching, Live TV, HA Guide and physical Home return from YouTube. Animated house energy update installed and appearance accepted. |
| **65NANO766QA** — 2022, Master Bedroom | webOS 22 | 04.60.91 | **7.6.0** | Tested on our TV: 0.2.0 Weather/Dusk; live HA, Home return from YouTube, bedroom controls and appliance card. Animated house energy update installed and file hashes verified. |
| **43UN73906LE** — 2020 | webOS 5.0 according to LG | Not reported | Not reported | User-verified: all features working, including the Home-button helper (reported 24 October 2026). This report predates the 0.3.0 background/customizer release. |

LG's model specifications identify [65NANO766QA as webOS 22](https://www.lg.com/es/tv-y-barras-de-sonido/nanocell/65nano766qa/) and [43UN73906LE as webOS 5.0](https://www.lg.com/de/tvs-und-soundbars/lcd-tvs/43un73906le/). These model specifications do not establish the exact software installed on an individual TV. The installed version of the reported 43UN73906LE has not been supplied.

SDK version, firmware version and the marketed webOS generation are recorded separately. Chromium 53/ES5 and Node 0.12 compatibility are source constraints retained from the B9. **webOS 4.x onward is an expected compatibility baseline, not a universally tested minimum.**
