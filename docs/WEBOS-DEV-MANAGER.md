# Install with webOS Dev Manager

[webOS Dev Manager](https://github.com/webosbrew/dev-manager-desktop) is a community desktop application for managing LG TVs. It is separate from LG's **Developer Mode** app, which runs on the TV. The instructions below use the Developer Mode route; root is not required.

## 1. Download the right desktop application

Use the upstream [release downloads](https://github.com/webosbrew/dev-manager-desktop/releases/latest), not an installer attached to an unrelated forum post. Select the release asset for your operating system and CPU:

| Computer | Upstream download family |
|---|---|
| Windows 10 or newer, typical 64-bit PC | x64 `.msi` |
| Mac, Intel or Apple Silicon | universal `.dmg` |
| Debian/Ubuntu Linux | `.deb` matching amd64 or arm64 |
| Other supported Linux distributions | `.AppImage` matching your CPU |

Install/open it using your operating system's normal application procedure. Follow upstream requirements if the package names change. You do not need LG's full SDK or an IDE for this graphical installation route. The launcher configurator still needs Node.js for building your private package. [Upstream download and feature reference](https://github.com/webosbrew/dev-manager-desktop#download).

## 2. Pair your television

Complete [TV Developer Mode setup](DEVELOPER-MODE.md) first. Keep **Key Server** enabled during initial pairing.

1. Open Dev Manager and start its add-device/setup wizard. Select the **Developer Mode** connection route, not a rooted-TV route.
2. Follow the Developer Mode checklist and continue to **Setup Device**.
3. Complete the connection fields below, then finish/save the device. Enter the current TV passphrase when requested.
4. Select the saved TV and check that its information or installed-app list loads.

| Field | Enter |
|---|---|
| Device Name | A unique local name, for example `lounge-tv` |
| Address | Your TV's IP address or resolvable hostname, without `http://`, path or port |
| Port | `9922` |
| Username | `prisoner` |
| Authentication | **Dev Mode** |
| Authentication information | The passphrase currently displayed in the TV Developer Mode app |
| Description | Optional room/model description |

The field names and wizard steps were checked against the upstream [device editor](https://github.com/webosbrew/dev-manager-desktop/blob/main/src/app/add-device/device-editor/device-editor.component.html) and [setup wizard](https://github.com/webosbrew/dev-manager-desktop/blob/main/src/app/add-device/wizard/wizard.component.html). UI layout can vary by desktop release. Choose the corresponding controls rather than relying on a fixed screen coordinate.

An LG account password is not an SSH password. Do not choose password authentication and paste the LG password. The passphrase is used to obtain the TV's pairing key. Keep Dev Manager's saved pairing data private.

If you already paired this TV for Camera Overlay, select that verified device instead of creating a duplicate. Check its current IP and model before installing.

## 3. Choose the correct launcher package

For a working HA dashboard, first follow [Start here](START-HERE.md) and use **Build private TV package** in the configurator. Download the generated `.ipk` to a private folder on this computer.

The public release's `com.mbs.communityhome_0.1.0_SAMPLE_all.ipk` has **no token**. On a television it says **Setup required**. It is a packaging sample, not a ready-configured live dashboard. The interactive sample readings are in the PC browser preview.

Your configured IPK embeds the HA token. Do not send it to anyone or upload it to GitHub. Export your credential-free profile separately so you can rebuild later.

## 4. Install and launch

1. In Dev Manager, select the intended TV in its device selector.
2. Open the apps view. Select **Installed**, then **Install**, and choose your configured `.ipk`. This is a local-file installation, not an app from the **Available** catalogue. These controls are shown in the upstream [apps view](https://github.com/webosbrew/dev-manager-desktop/blob/main/src/app/apps/apps.component.html).
3. Wait for installation to finish. Find **Home Launcher Preview**, ID `com.mbs.communityhome`, in the installed apps.
4. Launch it using the app's launch action, or open its tile from LG Home on the television.
5. Look at the TV: the approved layout should appear and a configured package should show **Home connected**. Confirm readings against HA.

An install-success message only confirms package acceptance. It does not prove visible layout, app/HDMI launching or physical controls. Complete the [acceptance checks](INSTALL.md#acceptance-before-enabling-automationhelper) before adding the optional startup automation or helper.

If the file chooser cannot see the IPK, extract it from any ZIP first and check its actual filename/extension. Do not rename a source ZIP to `.ipk`.

## 5. Update, inspect or remove

Before leaving the setup, follow [Developer Mode maintenance](DEVELOPER-MODE.md#automatic-renewal-with-home-assistant). Dev Manager's **Info → Renew automatically → Manual Setup** provides the private URL for the supplied HA renewal example; simply installing the launcher does not enable renewal.

To change your layout, import the saved profile into the configurator, rebuild, and install the new private IPK using the same TV and app ID. Keep the previous working package until you have verified the replacement. An update to this app does not require removing unrelated TV apps.

Use the installed-app information to obtain app IDs for launcher tiles. An app's friendly title is not always its ID. For a reliable alternative, use the [official CLI inventory](INSTALL.md#find-app-ids).

To remove the base launcher, select `com.mbs.communityhome` in the installed list and use its remove/uninstall action. If the Home helper is installed, pause it and confirm input release, then remove `com.mbs.communityhomehelper` first. Disable any launcher startup automation and revoke its dedicated HA token if retiring the installation. See [updates and recovery](UPDATES-AND-RECOVERY.md).

## Pairing and installation problems

| Problem | What to check |
|---|---|
| TV not found / timeout | TV is on; correct IP; computer can reach its network; Developer Mode is enabled; port is 9922. Guest Wi-Fi/client isolation can block local devices. |
| Failed to obtain key | Reopen Developer Mode, enable Key Server, and use its current case-sensitive passphrase. |
| Authentication rejected | Check Dev Mode authentication and `prisoner`; re-pair after a TV reset/session loss if needed. |
| Unexpected changed host identity | Verify the physical TV/IP and whether it was reset. Do not blindly accept an unknown replacement device. |
| Installed but Setup required | You installed the sample IPK. Build your own configured package. |
| Installed but no HA connection | PC discovery and TV networking are separate; check TV DNS, certificate trust and HA reachability. |
| App disappears later | Check Developer Mode session expiry; restore the base app before restoring a helper. |

For the advanced helper, establish an **official CLI device profile** too. Dev Manager pairing does not guarantee that every CLI version sees the same saved device/key. Verify `npx ares-setup-device --list` and pair explicitly if necessary; then follow the complete [manual helper guide](HOME-BUTTON-HELPER.md).
