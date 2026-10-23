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

Choose manual renewal or set up the Home Assistant automation below. The TV launcher itself does not renew Developer Mode. Keep your profile and working private IPK backed up. Your setup PC can be shut down after installation.

## Automatic renewal with Home Assistant

Your existing HA can renew the LG session daily, without another server, TV root or a permanently running setup PC. This is a separate, optional HA configuration; installing Home Launcher or Home Helper does not enable it automatically. HA needs outbound HTTPS access to LG's developer service. This renewal uses LG's online service even though normal launcher-to-HA communication is local.

If you already run **LG Camera Overlay** with `renewDeveloperMode: true` for this TV, use its existing renewal instead of creating a duplicate. Developer Mode is shared by the sideloaded apps on that TV. The Overlay relay checks daily, renews below seven days remaining and verifies the time increased; see its [maintenance guide](https://github.com/mbsintegrations/LG-Camera-Overlay/blob/main/docs/TROUBLESHOOTING.md).

### 1. Get this TV's renewal URL

1. Turn on the TV, confirm Developer Mode is still active, and connect to it in **webOS Dev Manager**.
2. Select **Info → Renew automatically → Manual Setup**. Wording may vary by version; look for **Automatic Developer Mode Renewal**.
3. Copy the personal renewal URL shown there. It starts with `https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=`.
4. Make a second copy and change **only** `ResetDevModeSession.dev` to `CheckDevModeSession.dev`. Keep the same token and the exact case of `sessionToken`.

The session token is separate from your HA access token and LG password. Do not paste the URL into GitHub, chat, a public uptime checker or support screenshots. The [upstream Dev Manager renewal dialog](https://github.com/webosbrew/dev-manager-desktop/blob/main/src/app/info/renew-script/renew-script.component.html) supplies this method. It depends on LG's session endpoint; account or service changes can require a new URL.

### 2. Save both URLs privately in HA

Back up the HA files you will edit. Open the `secrets.yaml` beside your HA `configuration.yaml`, using your normal configuration editor. Add these two entries, replacing the placeholders locally with the complete URLs:

```yaml
lg_home_devmode_renew_url: "https://developer.lge.com/secure/ResetDevModeSession.dev?sessionToken=REPLACE_WITH_YOUR_TV_SESSION_TOKEN"
lg_home_devmode_check_url: "https://developer.lge.com/secure/CheckDevModeSession.dev?sessionToken=REPLACE_WITH_YOUR_TV_SESSION_TOKEN"
```

Use only the HTTPS LG hostname above. `secrets.yaml` separates credentials from shared configuration; it does not encrypt them. Protect your configuration backups too. REST errors or debug logs can include request URLs: redact them before sharing. Do not put these URLs in a launcher profile or an automation's action data.

### 3. Add the supplied HA package

Download or copy [lg_developer_mode.yaml](examples/lg_developer_mode.yaml) from this repository. This guide and example were added after v0.1.1; use the current GitHub file if your release ZIP does not contain it.

1. Save the file as `packages/lg_developer_mode.yaml` inside your HA configuration directory. Download the **Raw** file, not a GitHub HTML page. Keep it as a package; do not paste the entire file into the automation UI.
2. If you do not already use packages, merge this into `configuration.yaml`:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

If `homeassistant:` already exists, add just the indented `packages:` line beneath it. **Do not create duplicate keys or replace existing configuration.** If packages are already configured with a different include style, keep that arrangement and follow [HA's package instructions](https://www.home-assistant.io/docs/configuration/packages/) to include this file.

3. Run HA's **Check configuration** (usually Developer Tools → YAML; newer layouts may put tools under Settings). Correct errors before continuing, then restart HA during a suitable maintenance window to load the package.
4. Find **LG Home - Developer Mode renewal** under Automations and make sure it is enabled.

The package requests renewal daily at **12:00 in HA's configured time zone**, and after HA starts. It waits one minute, requests renewal, then checks the server-side remaining time. A successful verification requires both HTTP responses and LG results to succeed, plus a recognised `hours:minutes:seconds` value with at least **168 hours (seven days)** remaining. A reset response alone, including `GNL`, is not accepted as proof of remaining time.

If the check fails or returns an unfamiliar format, it creates one persistent notification in HA. A later verified run clears that notification. It does not wake the TV, launch apps or operate household devices. The requests use the saved token against LG's server and do not require an SSH connection to the TV on each run. Keep the TV normally network-connected; the TV must still synchronise its Developer Mode state with LG.

### 4. Test and monitor it

1. Run the automation manually once. Allow about 90 seconds, then inspect its trace.
2. Confirm `verified` is `true` and `remaining_hours` is a plausible value of at least 168. No failure notification should remain. Inspect traces privately; do not publish raw requests/responses or logs containing tokens.
3. If verification fails, check HA's internet access, the two secret URLs and the token. Confirm **Remain Session** on the TV and use **EXTEND** before expiry. A changed LG response format needs review; do not change the example to treat every HTTP 200 response as success.
4. Check that the next scheduled run succeeds. Persistent notifications appear in HA, **not automatically on your phone**. You can add your own mobile notification action to the failure branch if desired.

The TV's displayed countdown may lag the server-side result; a stale display alone does not establish renewal failure. Check both the LG response and TV session state. Do not toggle Developer Mode off to refresh a timer. If HA/internet is down, the automation is disabled, or its configuration cannot load, it cannot protect or notify you; check the session manually after an outage. This is session maintenance, not permanent installation.

### More than one TV

Use each TV's own renewal/check URL pair. For each extra copy of the package, replace **every** `lg_home_devmode` prefix and `lg_home_developer_mode` identifier with a unique prefix, including the secret keys, REST command names/references, automation ID and notification ID. Give the automation a room-specific alias and optionally stagger its time. Never use one TV's session token for another.

### Remove or recover

To stop this renewal, disable its automation, remove its package and its two secrets, check configuration and restart HA at a suitable time. Continue manual renewal or another existing renewal method. Do not disable Developer Mode itself as part of removing this package.

If Developer Mode has already been disabled, renewal is not a substitute for recovery: restore Developer Mode, pair again, retrieve the new renewal URL, update both secrets, and reinstall the app/helper as described below. Re-run the automation test afterwards.

References: [HA REST commands and response variables](https://www.home-assistant.io/integrations/rest_command/), [HA secrets](https://www.home-assistant.io/docs/configuration/secrets/), [LG session extension](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app#extending-developer-mode-time). The supplied package is a configuration example; verify its first run in your HA instance before relying on the schedule.

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
