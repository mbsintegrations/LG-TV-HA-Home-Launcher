# App tiles, logos and Live TV

In **Apps & inputs**, choose an app from the dropdown, then choose one of the five appearances below. You can mix appearances in the same row. The default remains five text tiles, and you can add up to eight tiles including the final LG Home recovery tile. Existing exported profiles keep their text appearance when imported.

The dropdown includes YouTube, YouTube Kids, Netflix, Disney+, Prime Video, IPTV Smarters, Hulu, Max / HBO Max, Paramount+, Plex, Jellyfin, Apple TV (app), Live TV, TV Guide and HDMI 1–4. Choosing a preset fills in its name, suggested app ID and logo. It does not install or subscribe to the service. Install the app on the TV first.

## Choose the tile appearance

| Option | Appearance |
| --- | --- |
| Text Only | Your display name, without an image. |
| Logo | The service wordmark or full brand logo. |
| Logo and Text | Brand logo with your display name below. |
| App Logo | Compact service icon, without an extra outline or backing box. |
| App Logo and Text | Compact icon with your display name below. |

Each tile has its own setting. Some services use the same artwork for their icon and brand logo; those two modes differ in sizing. Live TV, Guide and HDMI use system symbols. The outer tile still highlights when selected with the remote. Light palettes use dark artwork for contrast.

Choose **Custom app** to enter an app name and its exact installed app ID. A custom app can use any bundled brand artwork or fall back to text; uploading custom logos is not included in this version. Choosing Custom clears the previous preset so it cannot accidentally retain another app's launch target.

**Apple TV (app)** opens the streaming app installed on the LG TV. For an Apple TV box connected by HDMI, choose the appropriate HDMI input and rename its display name instead. These are separate targets and can coexist.

## Check the app ID

IDs are editable because regions, app releases and TV generations differ. Use [Find app IDs](INSTALL.md#find-app-ids) if a tile does not open. A different logo does not change which app launches. Custom apps without a bundled logo show their name; a missing image also falls back to text. LG Home remains a clearly labelled text tile.

| App | Suggested ID |
| --- | --- |
| YouTube | `youtube.leanback.v4` |
| YouTube Kids | `youtube.leanback.kids.v4` |
| Netflix | `netflix` |
| Disney+ | `com.disney.disneyplus-prod` |
| Prime Video | `amazon` |
| IPTV Smarters | `com.iptvsmarters.app` (verified installed on the reference B9; variants may differ) |
| Hulu | `hulu` |
| Max / HBO Max | `com.wbd.stream` (some installations use `com.hbo.hbomax`) |
| Paramount+ | `com.cbs-all-access.webapp.prod` |
| Plex | `cdp-30` |
| Apple TV (app) | `com.apple.appletv` (some TVs use `com.apple.appletv.web`) |
| Jellyfin | `org.jellyfin.webos` |
| Live TV | `com.webos.app.livetv` |
| TV Guide | `com.webos.service.iepg` (model-dependent; see below) |

Streaming presets are based on the [RTI LG driver app list](https://driverstore.uat.rticontrol.com/driver/lg-ip) and [Jellyfin's webOS package](https://github.com/jellyfin/jellyfin-webos/blob/master/package.json). This is a starting list, not a guarantee that each app is available in every LG Content Store.

### YouTube Kids

The preset uses the legacy standalone app ID. Some TVs still report that app installed. Google [moved the Kids TV experience into YouTube](https://support.google.com/youtubekids/thread/260312849?hl=en&msgid=272161403), so a listed or installed icon does not guarantee the old app still works. If it redirects or is unavailable, use a child profile inside YouTube. The launcher cannot automatically select that child profile.

### Live TV and Guide

Live TV opens the TV's built-in tuner; it does not open a streaming subscription or an HDMI receiver. Connect your aerial/cable feed and tune channels in LG's settings. Guide information depends on your TV, broadcast service and region.

Guide IDs vary by firmware. The documented preset is `com.webos.service.iepg`; some versions use `com.webos.app.tvguide`. If neither opens, select **Open Guide using → Home Assistant · remote Guide button**, then choose **this TV's** `media_player` entity from the LG webOS integration. Connect/discover HA first to populate the entity suggestions, or enter the exact ID. Rebuild and reinstall. This sends only `webostv.button` with `GUIDE` to that selected TV. It needs a live HA connection and token permission to control the TV; the app ID field is ignored in this mode. No new HA script or helper is required.

On the B9 tested during development, Guide is an overlay and HA keeps reporting the underlying app, so copying `app_id` while Guide is open does not identify its launch target. Use the HA remote-button route on that model. If the action fails, check the [LG webOS integration](https://www.home-assistant.io/integrations/webostv/) and that you selected the same physical TV where the launcher is installed. The launcher does not resend failed or disconnected button requests automatically.

Live TV and direct-ID Guide launch through webOS without HA or the optional helper. The Guide remote-button mode uses your existing HA connection. The helper can still handle a short Home press. Leave Live TV and Guide out of its watched-app exit list: guide/tuner transitions should not be mistaken for leaving a streaming app. Keep long Home and the LG Home tile available for LG's settings and channel setup.

## Logo size and performance

Logos ship inside the app and preview; the TV makes no logo downloads or external image requests. The bundled set is small, with each image under 20 KB. Wordmarks and compact icons have separate sizing, with no extra inner frame. The display name remains the button's accessible name even in logo-only mode.

IPTV Smarters currently uses the vendor app artwork in both logo modes; it does not have a separate wordmark asset. The preset only opens an installed player and supplies no channels or subscription.

The [layout themes](THEMES.md) work with the optional [backgrounds and theme customizer](CUSTOMIZER.md) added in 0.3.0.

See [licensing and asset attribution](LICENSING.md) for the logo sources. To request another preset, provide the app name, exact installed ID, TV model/webOS version and country as described in [installation](INSTALL.md#find-app-ids).

## Speed Test

Choose Speed Test from the app list or enable it in Network. This is an internal launcher screen, so no app ID lookup or separate installation is needed. It occupies one of eight slots; remove an unused tile if the row is full. Tests run only after Start. [Network guide](NETWORK.md).
