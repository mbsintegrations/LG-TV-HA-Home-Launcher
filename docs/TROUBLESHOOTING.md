# Troubleshooting

| Symptom | Check / next step |
|---|---|
| `node` / `npm` not found | Install Node 22+ and open a new terminal. On Windows use `npm.cmd`. |
| `npm ci` fails | Confirm you are beside package.json and package-lock.json. Check registry/DNS access. Do not delete the lockfile or force dependency upgrades. |
| Setup page does not open | Keep `npm start` running; use the printed 127.0.0.1 address on that computer. Port occupied: choose another PORT. |
| Use 127.0.0.1 / session expired | Avoid LAN hostnames, proxies or copied session tokens. Reload the local page. Export before restarting if possible. |
| Token rejected | Use the token, not your password. Check its user was not deleted/disabled and token was not revoked. |
| Cannot reach HA | Check URL, DNS, TLS certificate, redirects and firewall. Do not disable TLS validation. |
| Plain HTTP refused | Prefer HTTPS; otherwise explicitly opt in only for a trusted local network. |
| Discovery works, TV cannot connect | Test the TV's network/VLAN/DNS path. Modern PC trust does not prove old TV certificate compatibility. |
| Missing example entities | Replace or remove every example in cards/controls, including unused detail sensors. Then rebuild. |
| No app inventory in wizard | Expected: HA discovery finds HA entities. Get TV app IDs through Dev Manager/ares or the HA TV app_id. |
| Sample package says Setup required | Expected. Build a private configured package after connecting to HA. Sample data is browser-only. |
| Browser says Design preview | Expected even after HA discovery. It does not receive the token or send controls. |
| App tile fails to launch | Verify actual installed app ID, regional availability and installation. A tile does not install that app. |
| Apple TV shows wrong device | Check cable/input; the tile is an HDMI launcher. Change its ID to the correct HDMI number. |
| No solar / appliances | Hide unused nodes/cards. Use Power readings for other equipment, or rename Appliances & status and select generic read-only entities. |
| Energy unavailable | Verify W/kW input unit, not kWh. Auto requires a unit attribute. Check inversion independently for grid/battery. |
| Wrong flow direction | Compare the selected sensor's sign convention with the configuration guide. Do not assume all integrations match. |
| Custom colours hard to read | Increase contrast for text and muted text against both background and cards, or switch to a preset. |
| Wrong appliance remaining time | Choose timestamp vs minutes vs text; timestamps need an explicit zone/offset. Generic inactive state words may need adaptation. |
| Light state not confirmed | Check HA/device feedback. Do not repeatedly click; commands are not replayed. |
| Gate action unavailable | Check position state, cover state or both selected scripts. Opening/closing/unknown states intentionally disable another movement request. |
| Startup does not fire | Check actual off→on history, source_list, exclusions and automation trace. No action on unavailable→on is deliberate. |
| Helper build refuses UID/ABI | Complete the native identity probe. Do not copy someone else's IDs or remove guards. |
| Helper active but exits stay on LG | Ensure it is not paused; verify watchedApps and HA TV app_id updates. App exits vary by app. |
| LG Home tile fails with helper enabled | Hold Home for two seconds. Check helper service and release status; do not force launch while release is unconfirmed. |
| TV sluggish | Pause helper, close launcher, stop developer inspection, compare normal LG behavior. Record CPU/memory/input observations; do not infer cause from one load-average number. |
| App disappeared after restart | Check Developer Mode expiry/disablement. Restore base first; re-probe helper identity. |

## Useful evidence

For setup: OS, Node version, exact step, sanitized error and profile structure with private labels/IDs removed. For TV: model, firmware, SDK, app version, selected app ID, physical result and whether helper was active/paused. For helper: sanitized `status`, `probe` and bounded `logs` outputs from the manual tools.

Do not attach private IPKs, connection files, pairing keys, full config directories or screenshots containing tokens. A successful API/build/status response is not proof of visible output or physical actuation.
