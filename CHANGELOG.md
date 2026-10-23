# Changelog

## 0.1.0 — Community preview — 23 October 2026

First public preview of the configurable LG Home Launcher. The GitHub release is marked **pre-release**; the TV package version is `0.1.0`.

- Local MBS Integrations setup wizard with sample TV preview, HA entity discovery, private package builds and profile import/export.
- Six TV palettes plus custom colours, room/clock/weather labels, five default app tiles and a maximum of eight.
- Configurable temperatures, up to six controls, four generic status rows and optional energy flow/readings with editable titles.
- Direct TV-to-HA connection; no always-on PC or relay required for the launcher.
- LG Home escape tile and optional HA startup blueprint.
- Optional Home-button helper provided as source, local build/probe tools and per-TV adaptation/recovery documentation. No universal helper IPK.
- Detailed Developer Mode and webOS Dev Manager guides, compatibility notes, security guidance and contribution templates.

Local JavaScript tests, ES5 checks, sample packaging, ARM helper cross-compilation and native filter tests passed. The configurable community build has not been installed on a TV; predecessor results are documented separately. Physical helper compatibility, cold boot, the HA startup blueprint in an isolated HA instance and macOS/Linux end-to-end setup remain to be verified. Hosted CI results are available on GitHub and must be checked for the exact commit.
