# Architecture and development

```text
Setup computer (only during setup)
  loopback wizard -> HA REST state discovery (read-only)
  profile + private credential -> official packager -> private IPK

TV at runtime
  local HTML/CSS/ES5 app -> HA WebSocket state/actions
  local app tiles -> webOS application launcher
  optional native helper + service -> Home interception / HA app-exit observation
```

## Source layout

| Directory | Purpose |
|---|---|
| app/ | TV UI, schema/action adapter and direct HA connection |
| wizard/ | Modern browser editor and loopback Node server |
| scripts/ | Build, theme generation, checks and local release packaging |
| helper/ | Optional native/service/controller source, per-device options and manual tools |
| blueprints/ | HA startup automation candidate |
| docs/ | User, compatibility, recovery and developer documentation |
| tests/ | Synthetic unit/integration tests |
| private/ | Ignored, potentially credential-bearing local output; never released |

`profile.js` is shared between Node and TV, so use ES5 there. The wizard/build run on Node 22+ and a modern desktop browser. TV code uses flexbox, no framework, no CSS variables, no eight-digit hex colours and no remote assets. Themes compile to an ordinary CSS file so older webOS and a strict script policy can use them.

Layouts are compiled by `scripts/layout.cjs` from the `app/layout-*.css` sources and combined with the selected palette by `scripts/theme.cjs`. Weather artwork lives in `app/weather.js`. Keep new TV code ES5-compatible and avoid unsupported CSS features. `layout` is optional for old profiles; `weatherSun` is an optional read-only subscription.

## Run and verify

```sh
npm ci --ignore-scripts
npm test
npm run check
npm run build -- config.example.json --demo
npm start
```

Use `npm.cmd` on Windows. Tests use localhost servers and synthetic HA responses; they need loopback socket access. The optional helper requires Zig/Python and its own pinned `npm ci --prefix helper/vendor --ignore-scripts`. See its manual guide.

`WEBOS_PACKAGER` can point to an existing official `ares-package.js` for development. Otherwise the local locked dependency is used. `ZIG` and `PYTHON` choose helper build tools. No local absolute path is required in the public source.

## Configuration design

Profiles validate on editing/import and again at build. Credentials are a separate object and are not accepted as profile fields. First-three temperature order and all card/node labels are data, not source replacements. The historical `laundry` profile key now holds up to four generic read-only status items; the UI calls it Appliances & status. Renaming that key can be a versioned schema migration later.

The public version intentionally uses locally configured packages rather than promising database persistence not yet tested on the target TVs. It has no mobile pairing server, QR token URL or on-TV credential entry. A future generic package with durable on-device configuration needs explicit update/reinstall and private-storage tests.

The documented HA event API sends state_changed events; unselected entities are discarded. Only selected states are retained. A filtered subscription optimisation must preserve initialization ordering, attribute removals and reconnect behavior, and be checked against supported HA versions before replacing this path.

## Contributions

Keep controls explicit and state-aware. Never add command retries after ambiguous timeouts, arbitrary HTML/JS configuration or silent TLS bypasses. Keep physical acceptance separate from mocks. Preserve the LG Home escape path. Include source, documentation, tests and exact compatibility evidence for helper modifications.

Credits remain visible in the TV footer and wizard: [MBS Integrations](https://mbsintegrations.ie).
