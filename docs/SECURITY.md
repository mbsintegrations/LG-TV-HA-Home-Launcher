# Security and private files

## Trust boundaries

The wizard runs on loopback only, requires a random setup-session header for its API and checks the Host and Origin headers. It has no household control or TV install endpoint. HA discovery uses an authenticated read of `/api/states`; redirects are refused. Entity names, not arbitrary HA attributes, are returned to the editor. The browser design preview receives an empty connection object and sample readings, never the token.

The wizard's credential input is a local form, not an MBS-hosted website. Do not expose it through a reverse proxy, tunnel, LAN bind or port forwarding. Another untrusted local process with access to the setup page could obtain its session token; this is not a multi-user hardened service. Stop it when finished.

## Credential lifecycle

- A connected token is held in the Node setup process memory; the password field is cleared after successful discovery.
- Disconnect or stopping the wizard forgets that in-memory connection. It does not revoke HA access or erase packages already built.
- A live build writes a private `connection.json` into staging and includes it in the IPK. The optional helper also has its own private HA configuration.
- Treat `private/`, generated IPKs, extracted packages and backups as credentials. Never upload them to issues, Git, Wiki or public releases.
- Revoke the dedicated token in HA when a TV/package is lost or no longer used. Rebuild remaining authorized installations with a replacement token if necessary.

No encryption-at-rest claim is made. A person who can read the installed app/package can extract the token. A non-admin HA account reduces privileges but does not limit that token to only the visible controls. The app cannot turn a normal HA token into an entity-scoped token.

## Network transport

HTTPS/WSS is preferred; normal certificate validation remains enabled. Plain HTTP/WS requires an explicit setup opt-in and should only be used on a trusted isolated local network. Do not bypass TLS errors. Check DNS, certificate chain, clock and old-TV trust stores instead.

Custom palettes are validated as hex colours and compiled to local CSS. No custom JavaScript, remote CSS, HTML card templates or external image URLs are accepted. Labels are rendered as text. The public app uses no analytics or tracking endpoints. The credit link in the wizard is opened only when clicked.

## Controls

Only configured control types can generate commands. Commands are explicit on/off/open/close/run, use fresh state, and are not replayed on reconnect. Gate/cover/script actions ask for confirmation. Confirmation on a TV is convenience, not a safety interlock; the underlying HA scripts/device must implement the necessary safeguards.

Avoid broad scripts, infrastructure power, alarms or security bypasses in a shared TV interface. Read-only status does not grant additional control. Synthetic tests do not actuate household devices.

## Tooling and legacy helper

The official webOS packager has older transitive dependencies. It runs locally during builds, not on the TV or as an exposed server. Keep the lockfile; review dependency changes rather than running `npm audit fix --force`.

The optional helper pins `ws` 1.1.5 for old Node compatibility. It is legacy software, not a modern audited networking stack. It makes an outbound authenticated HA connection, does not expose a listener, disables compression, and uses a payload limit. These constraints are not a claim that all historical vulnerabilities are eliminated. Review current advisories and isolate the TV/HA network as appropriate before a wider release. Do not upgrade the TV's system Node to solve this dependency issue.

The native helper controls input handling. Preserve capability checks, exclusive locks, process identity, watchdogs and escape paths. Unsupported hardware should fail closed. Do not make input devices or credential files world-writable/readable to bypass a problem.

## Reporting

### Dependency audit snapshot: 23 October 2026

`npm audit` reported four findings in the official desktop CLI dependency tree: proxy-addr (critical), brace-expansion and js-yaml (high), and qs (moderate). A compatible update and non-force audit fix did not resolve them in the pinned CLI tree. The official CLI is a computer-side build/maintenance dependency, not code included in the base TV app. The local configurator uses Node's HTTP server rather than the CLI's Express server. This is a scope distinction, not a claim that the findings are fixed or harmless. Do not expose developer tooling as a public service or feed it untrusted packages.

The optional helper's pinned ws 1.1.5 has a high-severity [memory-exhaustion advisory](https://github.com/advisories/GHSA-96hv-2xvq-fx4p). Payload limits and disabled compression do not establish immunity to fragmentation attacks. The suggested modern major upgrade is not a verified replacement for the B9's Node 0.12 runtime. The helper remains experimental and is distributed as source/manual tools; assess this unresolved dependency before enabling it.

Audit results change over time. Re-run both `npm audit` and `npm audit --prefix helper/vendor` after installing their dependencies. Neither a passing unit-test workflow nor this preview release means a clean security audit.

Include model, firmware, app version, setup OS, sanitized error and reproduction steps. Remove tokens, pairing keys, passphrases, entity/location metadata and stream URLs from logs/screenshots. Use the repository issue templates for sanitized bug reports. For sensitive findings follow [Security reporting](../SECURITY.md).
