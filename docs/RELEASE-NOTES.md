# LG TV – HA Home Launcher v0.2.0

Four new home-screen layouts, richer weather and more flexible app tiles for your LG webOS TV. The launcher connects directly to Home Assistant; no root or always-on setup computer is required.

![Dock, Weather, Sidebar and Panorama](https://raw.githubusercontent.com/mbsintegrations/LG-TV-HA-Home-Launcher/v0.2.0/docs/images/launcher-themes.jpg)

## New layouts and weather

- **Dock:** apps along the bottom, with home information above.
- **Weather:** a large weather panel beside apps and controls.
- **Sidebar:** a vertical app rail with grouped home controls and cards.
- **Panorama:** a wide weather scene above apps, controls and cards.
- **Classic** remains available and is the default when importing an older profile.
- Layout and **Color Palette** are separate choices. Use Forest, Slate, Ocean, Dusk/plum, Sand, Monochrome or custom colours with any layout.
- Local weather graphics change with the HA condition. An optional Sun entity supplies day/night information for cloudy and rainy conditions too.
- Every layout supports up to eight app/input tiles and six home controls. Card titles, generic status entries and optional energy remain configurable.

See [every layout and palette combination](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/SCREENSHOTS.md) and the [theme guide](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/THEMES.md).

## App tiles and TV features

- Five choices per tile: **Text Only**, **Logo**, **Logo and Text**, **App Logo**, **App Logo and Text**. Bundled artwork loads locally with text fallback; compact icons have no extra inner outline.
- Common-app dropdown: YouTube, YouTube Kids, Netflix, Disney+, Prime Video, IPTV Smarters, Hulu, Max/HBO Max, Paramount+, Plex, Jellyfin and Apple TV (app).
- **Custom app** lets you enter a name and installed app ID. IDs remain editable for model/region differences.
- **Apple TV app and HDMI-connected Apple TV are separate targets.** HDMI 1–4 presets remain available.
- **Live TV** opens the tuner. **TV Guide** can use an app ID or the selected LG TV's Guide button through Home Assistant, including the tested B9 overlay route.
- LG Home stays last as the route back to LG's interface. Existing profiles retain their text tiles until you choose another appearance.

[App IDs, logo choices and Guide setup](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/APP-TILES.md)

## Fixes and documentation

- Fixed the footer overlap between Home-helper status and remote hints, including the Resume button when paused.
- Put Layout theme on a full-width configurator row below Clock and Color Palette.
- Added 35 layout screenshots, a four-theme overview and screenshots of all five configurator steps.
- Expanded layout/palette, weather location/day-night, app preset, upgrade and recovery instructions.
- Included the Developer Mode renewal guide and HA package added since 0.1.1, alongside webOS Dev Manager and manual helper documentation.

## Updating from 0.1.1

1. Keep your working private IPK and exported profile.
2. Extract the new source ZIP into a separate folder, run **npm ci --ignore-scripts**, then **npm start**. On PowerShell use **npm.cmd** if needed.
3. Import your profile. Schema version 1 is unchanged: existing app IDs, entities and controls are preserved. Missing layout becomes Classic; missing appearance becomes Text Only.
4. Choose a theme/palette and any app changes, reconnect HA and export the revised profile.
5. Build your own private package and install it over Home using webOS Dev Manager. The public sample contains no token and does not retain your configuration.

For an existing manual helper installation, use the [helper-aware update procedure](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/UPDATES-AND-RECOVERY.md). Preserve your per-TV options and service ownership, pause/release before updating, then resume and check Home. **The native helper remains 0.1.0; themes and logos do not require a new native binary.** A new app tile does not automatically change its watched-app exit list.

## Downloads

- **LG-TV-HA-Home-Launcher-0.2.0-source.zip** — configurator, TV source, all guides/screenshots, HA templates and manual helper tools. Start here for installation.
- **com.mbs.communityhome_0.2.0_SAMPLE_all.ipk** — credential-free package sample; displays Setup required on a TV. Build privately for live HA.
- **LG-TV-HA-Home-Launcher-designs.png** — original palette overview.
- **LG-TV-HA-Home-Launcher-themes.jpg** — new four-theme overview.
- **SHA256SUMS.txt** — checksums for the four files above.

Your configured IPK contains your HA token and must stay private. The optional Home-button helper is supplied as source and manual per-TV build instructions, not a universal helper IPK.

## Compatibility

Both reference TVs now have 0.2.0 installed: OLED65B9PLA with Panorama/Slate and 65NANO766QA with Weather/Dusk. Installed files match the builds and both helpers report active. B9 testing confirmed Live TV, Guide through HA and Home return from YouTube, and the Panorama appearance was accepted on TV. See the [validation details](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/VALIDATION.md).

App availability and IDs vary by region and TV. YouTube Kids may require the Kids experience inside YouTube. IPTV Smarters uses its vendor app artwork and supplies no channels. Background uploads, slideshows and free-form card placement are not included.

[Start here](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/START-HERE.md) · [Configurator walkthrough](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/CONFIGURATOR-TOUR.md) · [Developer Mode](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/DEVELOPER-MODE.md) · [webOS Dev Manager](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/WEBOS-DEV-MANAGER.md) · [Security](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.2.0/docs/SECURITY.md)

Independent GPL-3.0 project by [MBS Integrations](https://mbsintegrations.ie), with preserved upstream notices. Not affiliated with LG or Home Assistant.

[![GitHub stars](https://img.shields.io/github/stars/mbsintegrations/LG-TV-HA-Home-Launcher?style=flat&logo=github)](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher) [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://paypal.me/mwahl1973)
