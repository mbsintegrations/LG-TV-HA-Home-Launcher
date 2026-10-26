# Changelog

## 0.4.0 — 26 October 2026

- Added an embedded, manually started Cloudflare speed test with cancellation and saved results.
- Added optional router/internet TCP latency and explicit ICMP mode where permitted.
- Added a Network setup step, opt-in defaults, bounded polling and old-TV browser compatibility.
- Updated network privacy, troubleshooting, configuration and upgrade documentation.

## 0.3.0 — Backgrounds, theme customizer and house energy flow — 25 October 2026

- Upload up to five optimized local backgrounds; optional rotation, image opacity and darkening. Full HD output, 450 KB maximum per image.
- Optional customizer with Solid, Translucent, Outlined and Glass finishes, corners, accents and per-card colours.
- Drag-and-drop app/control ordering and custom screen-row arrangement; LG Home remains last.
- Animated house energy view with generic editable labels, optional battery/chargers, unavailable-state handling and direction-aware flow.
- Fixed Glass card positioning in Sidebar and improved configurator preview-session recovery and error feedback.
- New main/community image, feature screenshots, refreshed configurator screenshots and expanded setup/update documentation.
- Profile schema remains version 1; old profiles retain their mappings. Native helper remains 0.1.0. The house renderer has been installed on both reference TVs and visually accepted on the Living Room TV; backgrounds/Glass have browser coverage pending physical performance testing.

## 0.2.0 — Four new themes, weather artwork and app tiles — 24 October 2026

### Added

- Dock, Weather, Sidebar and Panorama layouts, with Classic retained for existing profiles.
- Independent Color Palette and Layout theme selectors. All layouts support six preset palettes, custom colours, eight app/input tiles and six controls.
- Local condition-based weather graphics and an optional HA Sun entity for cloudy/rainy night appearance.
- Five per-tile appearances: Text Only, Logo, Logo and Text, App Logo, and App Logo and Text, with bundled local artwork and text fallback.
- Common app presets, including Apple TV (app), IPTV Smarters and Custom app name/ID entry; editable IDs and HDMI inputs.
- Live TV and TV Guide tiles. Guide supports an app ID or the selected TV’s Guide remote button through HA.
- A four-theme overview, every preset layout/colour combination, custom examples and a five-step configurator screenshot tour.
- Expanded theme, weather, app-ID, Guide, upgrade and Developer Mode renewal documentation.

### Improved and fixed

- Layout theme occupies a full-width configurator row beneath Clock and Color Palette.
- Home-helper status and Resume button share the footer layout instead of overlapping the remote hints.
- Logo modes distinguish wordmarks from compact app icons; light surfaces use contrasting artwork where provided, and compact icons have no extra inner outline.
- Hidden/empty cards adapt within each layout. Existing profiles retain Classic and text tiles until changed.

### Compatibility and upgrade

- Profile schema stays at version 1; existing app IDs, entities and actions are preserved on import.
- Both reference TVs are updated to 0.2.0: Panorama/Slate on OLED65B9PLA and Weather/Dusk on 65NANO766QA. Installed files match their builds and both helpers report active.
- B9 testing confirmed Live TV, Guide through HA and Home return from YouTube; the Panorama appearance was accepted on TV.
- The native helper stays at 0.1.0. Import your profile, choose settings and rebuild privately; helper-enabled installations follow the manual helper build/update instructions.
- Background uploads, slideshows and free-form card placement are not included.

## 0.1.1 — First regular public release — 23 October 2026

- Configurable launcher installed on both reference TVs; live HA and physical Home-button return from YouTube confirmed.
- TV app named Home, with the small credit “by mbsintegrations.ie”.
- Resume Home button remains enabled until paused; the CLI trial is still bounded to two minutes.
- Renamed repository, updated installation guides and four-design promotional image.

## 0.1.0 — Community preview — 23 October 2026

First public preview of the configurable LG Home Launcher. The GitHub release is marked **pre-release**; the TV package version is `0.1.0`.

- Local MBS Integrations setup wizard with sample TV preview, HA entity discovery, private package builds and profile import/export.
- Six TV palettes plus custom colours, room/clock/weather labels, five default app tiles and a maximum of eight.
- Configurable temperatures, up to six controls, four generic status rows and optional energy flow/readings with editable titles.
- Direct TV-to-HA connection; no always-on PC or relay required for the launcher.
- LG Home escape tile and optional HA startup blueprint.
- Optional Home-button helper provided as source, local build/probe tools and per-TV adaptation/recovery documentation. No universal helper IPK.
- Detailed Developer Mode and webOS Dev Manager guides, compatibility notes, security guidance and contribution templates.

Preview validation covered JavaScript tests, ES5 compatibility, sample packaging, ARM helper cross-compilation and native filter tests. See [validation](docs/VALIDATION.md) for current TV results.
