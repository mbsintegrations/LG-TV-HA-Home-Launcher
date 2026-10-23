# Install the base launcher

This is a Developer Mode sideload, not an LG app-store installation. Keep your original LG Home available. The community IDs are deliberately different from the private predecessor; do not run two Home interception helpers at once.

For the full graphical walkthrough, use [TV Developer Mode](DEVELOPER-MODE.md) followed by [webOS Dev Manager](WEBOS-DEV-MANAGER.md). This page is the compact reference and official CLI alternative.

## Prepare the LG

1. Connect the TV and setup computer to a network on which they can reach each other.
2. Install **Developer Mode** from LG Apps and sign in with an LG Developer account.
3. Enable Dev Mode Status and allow the TV to restart.
4. Open Developer Mode again and enable Key Server.
5. Note the TV IP and displayed passphrase privately. Leave it on during pairing/install.

Follow [LG's current Developer Mode instructions](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app). Session expiry/Developer Mode removal can uninstall sideloaded apps. This project does not guarantee session renewal.

## Install using webOS Dev Manager

Use the community [webOS Dev Manager desktop tool](https://github.com/webosbrew/dev-manager-desktop/releases). Add your TV using the IP/passphrase, then select the downloaded IPK in its app installation screen. Check the model and IP before installing; do not select another household TV by accident.

The base app appears as **Home Launcher Preview**, ID `com.mbs.communityhome`. Launch it. A configured package should show **Home connected** and readings from your selected entities. A sample package instead says **Setup required**.

A successful installation response only proves the package was accepted. Confirm the screen, remote navigation, app launches and desired input physically.

## Optional official CLI route

The project installs the official webOS CLI locally. In Windows commands use `npx.cmd`; on macOS/Linux use `npx`.

```sh
npx ares-setup-device
npx ares-novacom --device YOUR_TV --getkey
npx ares-device --device YOUR_TV --system-info
npx ares-install --device YOUR_TV /path/to/your-private-package.ipk
npx ares-launch --device YOUR_TV com.mbs.communityhome
```

Replace `YOUR_TV` with the device name you created. Developer Mode uses port 9922 and user `prisoner`; use the TV's displayed passphrase to retrieve its key. Keep pairing keys private. A changed host-key warning requires investigation, not bypassing.

## Find app IDs

View the TV's installed apps in Dev Manager, or use:

```sh
npx ares-install --device YOUR_TV --list
```

Use the returned ID in the wizard. If a built-in app is not listed, inspect the LG integration's `app_id` while that app is open, or the inventory tools available in your Dev Manager version. Do not assume display titles are IDs. Common reference IDs are YouTube `youtube.leanback.v4`, Netflix `netflix`, Plex `cdp-30`, and Prime `amazon`.

HDMI tiles use `com.webos.app.hdmi1` through `com.webos.app.hdmi4`, with a label you choose. The app cannot prove which device is plugged into an input. Apple TV here means the external HDMI device, not Apple's native streaming app.

## Acceptance before enabling automation/helper

- Open and leave the app, then reopen it from LG Home.
- Use arrows/OK/Back and the pointer, if available. Confirm focus is visible.
- Open every configured app and HDMI input.
- Check temperature units and weather values against HA.
- Verify power units and direction against your energy dashboard.
- Deliberately test only the household controls you intend to use, with the area clear for a gate/garage. Never test infrastructure power as a connection check.
- Temporarily disconnect the TV's HA network route only if you can do so safely: unavailable controls should be disabled, and commands must not replay after reconnection. Code tests cover this behavior; a physical check remains useful.

For removal and rollback see [Updates and recovery](UPDATES-AND-RECOVERY.md).
