# LG TV – HA Home Launcher v0.3.0

Make the launcher yours with personal backgrounds, an optional theme customizer and an animated house energy view. No root required, no ads in the launcher, and no always-on setup computer.

![Home Launcher 0.3: backgrounds, customizer and energy flow](https://raw.githubusercontent.com/mbsintegrations/LG-TV-HA-Home-Launcher/v0.3.0/docs/images/launcher-update-0.3.jpg)

## Backgrounds

- Upload **1–5 JPG, PNG or static WebP images** directly in Your space, below Layout theme. You do not need to use the customizer.
- Recommended **1920 × 1080 / 16:9**. Inputs are limited to **4 MB and 16 megapixels** each; the browser crops, strips metadata and compresses each to **450 KB or less**.
- Keep one image static or rotate several every 30 seconds, 1, 2 or 5 minutes. Rotation pauses when Home is hidden.
- Separate **image opacity** and **darken background** controls. Three lightweight generated samples are included.
- Images stay in local setup, exported profiles and your built package. Personal photos remain private unless you share those files.

## Optional theme customizer

- **Solid, Translucent, Outlined and Glass** card finishes, adjustable opacity, four corner shapes, colour accents and independent card colours.
- Glass uses one small blurred wallpaper shared across surfaces, so it does not require modern webOS backdrop-filter support.
- Drag app tiles and controls into order, or use **Earlier / Later**. LG Home remains last.
- Choose **Custom arrangement** to reorder the clock/weather, app, control and status-card rows. Status-card ordering is also available outside Sidebar. Placement snaps into fixed rows; arbitrary overlapping/resizing is not included.
- Existing layout themes and colour palettes remain independent. The customizer is entirely optional.

## Animated energy flow

- Choose **Energy flow · animated house** in **Home cards → Energy & power → Power layout**. The classic diagram and simple readings remain available.
- Generic, editable labels; no SigenStor branding or vendor-specific integration requirement.
- Solar, home, battery, grid and up to two charger readings surround the house. Unconfigured devices and entities absent from the connected HA snapshot are hidden, including their corresponding artwork.
- Idle devices remain visible. Unavailable readings and disconnects stop active flow; animations pause when the launcher is hidden.
- W/kW conversion and sign inversion use your existing mappings. The lines show each sensor's direction, not an estimated allocation of solar between consumers.

## Fixes and guides

- Glass cards preserve Sidebar's fixed card positions.
- Corner settings apply to app/control/status/weather surfaces and inner energy boxes.
- Clearer preview-save errors and recovery after a configurator restart, without replaying discovery or build requests.
- New main image, customization/energy screenshots and refreshed setup walkthrough.
- Expanded upload, styling, energy, upgrade and recovery documentation. LG 43UN73906LE is listed as user-verified for all features; firmware/SDK/webOS versions were not reported.

## Updating

1. Keep your working private IPK and exported profile.
2. Extract **LG-TV-HA-Home-Launcher-0.3.0-source.zip**, run `npm ci --ignore-scripts`, then `npm start`. Use `npm.cmd` on PowerShell if needed.
3. Import your profile. Schema remains version 1; missing customizer settings use no photos and solid cards, preserving your layout, palette, apps and entities. Choose the house energy view if wanted.
4. Export the updated profile, reconnect HA, build privately and install your own IPK with webOS Dev Manager. The public sample has no token and does not preserve your configured app's credentials.
5. **Existing helper users:** follow the manual helper-enabled build/update procedure and preserve your per-TV options. Pause/release before replacing a service-bearing package, then resume and check Home. The native helper remains **0.1.0**.

Older releases do not understand the new customizer fields; use your earlier saved profile and IPK for rollback.

## Validation and performance

The house energy view is installed on both reference TVs, with exact installed-file verification and active helpers. The Living Room appearance was accepted by the owner. Backgrounds, rotation, customizer and Glass have automated/browser coverage; physical TV performance testing for those options remains outstanding. One static background is the lightest option for older TVs.

[Validation details](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/VALIDATION.md) · [Customizer guide](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/CUSTOMIZER.md) · [Upgrade guide](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/UPDATES-AND-RECOVERY.md)

## Downloads

- **LG-TV-HA-Home-Launcher-0.3.0-source.zip** — configurator, TV source, documentation, screenshots and manual helper tools. Start here.
- **com.mbs.communityhome_0.3.0_SAMPLE_all.ipk** — credential-free sample; shows Setup required on a TV. Build privately for live HA.
- **LG-TV-HA-Home-Launcher-update-0.3.jpg** — new community update image.
- **LG-TV-HA-Home-Launcher-designs.png** and **LG-TV-HA-Home-Launcher-themes.jpg** — palette and layout overviews.
- **SHA256SUMS.txt** — checksums for all five files above.

Configured TV packages contain your HA token and must stay private. The optional helper remains a manual, model-dependent installation; no universal helper IPK is provided.

[Start here](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/START-HERE.md) · [webOS Dev Manager](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/WEBOS-DEV-MANAGER.md) · [Developer Mode and renewal](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/v0.3.0/docs/DEVELOPER-MODE.md)

Independent GPL-3.0 project by [MBS Integrations](https://mbsintegrations.ie). Not affiliated with LG or Home Assistant.

[![GitHub stars](https://img.shields.io/github/stars/mbsintegrations/LG-TV-HA-Home-Launcher?style=flat&logo=github)](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher) [![PayPal](https://img.shields.io/badge/PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://paypal.me/mwahl1973)
