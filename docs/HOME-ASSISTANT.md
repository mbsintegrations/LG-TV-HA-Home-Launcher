# Home Assistant setup

The TV uses HA's authenticated WebSocket API for states and selected actions. The setup wizard uses a read-only GET of `/api/states` for entity selection. Neither requires a custom integration or HACS component.

## Dedicated account and token

1. As an HA administrator, create a dedicated normal/non-admin account for the launcher. Consider local-only login if all relevant clients use local access; verify your network and reverse-proxy arrangement.
2. Sign in as that account in a separate/private browser session.
3. Open its user profile, Security, and create a long-lived access token named for this TV.
4. Copy it into the local setup wizard. HA normally displays it only once.
5. Use a separate token for each TV, so one can be revoked without affecting another.

HA documents long-lived tokens and their normal 10-year lifetime in its [authentication API](https://developers.home-assistant.io/docs/auth_api/). Choose/revoke credentials deliberately. The wizard does not create accounts or tokens for you.

Non-admin is not equivalent to permission for only these six buttons. The token carries the user's HA permissions. Do not give the account more access than necessary; the UI's selection list is not a security boundary. Anyone holding a private IPK can extract its token.

## Connectivity

The setup computer and TV must each reach HA, possibly across different VLANs. A successful PC discovery does not prove the TV route or certificate works. Use a hostname resolvable by the TV and a certificate it trusts; old TVs may not trust a certificate accepted by modern Node. Certificate validation is not disabled by this project.

Enter the base URL, such as `https://home.example.com` or a trusted local `http://homeassistant.local:8123`. The wizard normalises it to the WebSocket `/api/websocket` endpoint. URL credentials, query tokens, redirects and reverse-proxy subpaths are rejected. Use the direct HA origin or a dedicated hostname.

The app subscribes to `state_changed`, fetches the initial state snapshot and retains only configured entities. Event traffic may include other entities; they are discarded rather than displayed/stored. This implementation favours the documented API. A heavily active HA instance may benefit from a future tested filtered subscription implementation.

## Start Home when the TV turns on

This optional automation is separate from the Home-button helper. It does not wake the TV.

1. Add/reuse the official [LG webOS TV integration](https://www.home-assistant.io/integrations/webostv/), accepting the TV pairing prompt.
2. With the installed launcher visible, inspect the TV's media_player `source_list`. Ensure **Home Launcher Preview** is present; enable it in the integration's source options if needed.
3. In HA, open Settings, Automations & scenes, Blueprints, then Import Blueprint. Use the [blueprint file URL](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/blueprints/home-on-startup.yaml). Alternatively copy the supplied YAML into HA's `config/blueprints/automation/lg_home_launcher/` directory. This blueprint has not yet been runtime-validated in an isolated HA instance; review it before importing.
4. Reload automations/blueprints using your normal HA procedure, then create an automation from **LG Home Launcher on TV startup**.
5. Select the exact TV, launcher source label and settling delay. Keep a relevant overlay app exclusion if you use one.
6. Test standby then power-on with the physical remote. Verify the automation trace and the actual screen.

The supplied blueprint only reacts to `off -> on`, held for the configured interval. It checks that the source exists, skips an already-open launcher and the excluded app, then launches once. It does not retry or chase every source change. If your TV goes `unavailable -> on`, or reports `playing` instead of `on`, it will deliberately not fire. Inspect real history before adapting it; do not broaden triggers blindly or it can interrupt playback after a network reconnect.

Disable any old startup automation for the same purpose when deliberately migrating. Do not leave two launchers competing. No startup automation has been created or changed by this development work.

## Gate scripts

Use existing reviewed HA scripts for site-specific gate behavior, or a proper cover entity. Choose separate open/close operations and a reliable position sensor. A service success only means accepted, not that the gate reached its endpoint. Do not use an infrastructure plug or arbitrary device-wide action as a substitute.

## When HA is offline

App and HDMI launching remains local. HA readings become stale/unavailable and controls are disabled. Reconnection uses bounded backoff; no prior device command is replayed. Helper app-exit detection depends on its separate HA subscription, so Home-button interception and app-exit detection can have different availability.
