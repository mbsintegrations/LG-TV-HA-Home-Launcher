# Enable LG TV Developer Mode

Developer Mode allows you to install this app on your own TV. It does not root the TV or replace LG's firmware. You need an LG Developer account, the TV on your local network, and a computer that can reach it.

## On the TV

1. Create or sign into your account on the [LG Developer website](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app).
2. Open LG Apps on the TV, search for **Developer Mode**, and install LG's app.
3. Launch it and sign in with your LG Developer account.
4. Enable **Dev Mode Status** and allow the TV to restart.
5. Reopen Developer Mode. Enable **Key Server** and keep its displayed IP address and case-sensitive passphrase private.
6. Leave the TV on for pairing and installation. Continue with [webOS Dev Manager](WEBOS-DEV-MANAGER.md).

Expected result: Developer Mode is enabled and the TV displays its session information. If the app is unavailable, check LG's guidance for your model/region; do not substitute an Android APK.

## Keep the session alive

Check **Remain Session** regularly. While the TV is network-connected, use **EXTEND** before it expires. LG says expiry followed by a restart can disable Developer Mode and remove development-installed apps. An expired session cannot simply be extended. Follow [LG's current instructions](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app) to restore access.

This launcher supplies no automatic session-renewal service. Keep your profile and working private IPK backed up. Closing the PC after installation is fine; session maintenance remains your responsibility.

## Connection and account checklist

The three credentials have different jobs:

| Credential | Enter it where? | Purpose |
|---|---|---|
| LG Developer account | LG Developer website and TV Developer Mode app | Enable development installation |
| TV passphrase | Dev Manager's Dev Mode authentication, or the CLI key prompt | Pair that computer with that TV |
| Home Assistant long-lived token | Local Home Launcher configurator | Allow the installed launcher to read/control HA |

Do not enter your HA token into Dev Manager or your LG password into the launcher. Neither belongs in a support screenshot.

Use the actual TV address from your network/TV screen. If pairing stops working after an address change, check the saved device address. A DHCP reservation can make this easier. Never forward the TV's developer port to the Internet.

If this TV already runs Camera Overlay or another sideloaded app, keep its existing Developer Mode session. Do not toggle Developer Mode off as a troubleshooting shortcut: that can remove other development apps too. The launcher requires neither a TV factory reset nor a system-wide cache clear.

## If apps disappear

Restore Developer Mode and pairing, then reinstall your saved **base launcher** package first. Check the layout and HA connection before restoring a helper. Re-run the helper's identity probe: previous numeric user IDs may no longer apply. See [recovery](UPDATES-AND-RECOVERY.md).
