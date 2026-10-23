# Changelog

## 0.1.1 — First regular public release — 23 October 2026

- Configurable launcher installed on both reference TVs; live HA and physical Home-button return from YouTube confirmed.
- TV app named Home, with the small credit “by mbsintegrations.ie”.
- Resume Home button remains enabled until paused; the CLI trial is still bounded to two minutes.
- Renamed repository, updated installation guides and four-design promotional image.

## 0.1.0 — Community preview — 23 October 2026

First public preview of the configurable LG Home Launcher. The GitHub release is marked **pre-release**; the TV package version is `0.1.0`.

- Local MBS Integrations setup wizard with sample TV preview, HA entity discovery, private package builds and profile import/export.
- Six TV palettes plus custom colours, room/clock/weather labels, five default app tiles and a maximum of eight.
- Configurable temperatures, up to six controls, four generic status rows and optional energy flow/readings with editable titles.
- Direct TV-to-HA connection; no always-on PC or relay required for the launcher.
- LG Home escape tile and optional HA startup blueprint.
- Optional Home-button helper provided as source, local build/probe tools and per-TV adaptation/recovery documentation. No universal helper IPK.
- Detailed Developer Mode and webOS Dev Manager guides, compatibility notes, security guidance and contribution templates.

Preview validation covered JavaScript tests, ES5 compatibility, sample packaging, ARM helper cross-compilation and native filter tests. See [validation](docs/VALIDATION.md) for current TV results.
