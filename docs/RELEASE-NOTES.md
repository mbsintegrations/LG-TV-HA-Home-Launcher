# LG Home Launcher v0.1.0 — Community Preview

[![Validation](https://github.com/mbsintegrations/LG-Home-Launcher/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mbsintegrations/LG-Home-Launcher/actions/workflows/ci.yml)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://paypal.me/mwahl1973)

Create your own LG webOS home screen with streaming apps, HDMI inputs and Home Assistant cards. Configure it in the local MBS Integrations wizard, then install a private package on your TV. No always-on PC or relay is needed for normal launcher use.

## Start here

Read [Start here](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/docs/START-HERE.md), [Developer Mode](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/docs/DEVELOPER-MODE.md) and [webOS Dev Manager](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/docs/WEBOS-DEV-MANAGER.md).

- **LG-Home-Launcher-0.1.0-preview-source.zip** — complete public source, configurator, guides, blueprint and manual helper tools. Extract it and run the setup steps.
- **com.mbs.communityhome_0.1.0_SAMPLE_all.ipk** — credential-free packaging sample. On a TV it says Setup required; use the configurator to build your own live package.
- **SHA256SUMS.txt** — checksums for those two files.

A configured private IPK contains your HA token. Never upload or share it. The optional Home-button helper is provided as source/manual tools only; no universal helper binary is released.

## Included

Six palettes and custom colours; five default app tiles, up to eight; editable card titles; temperatures, lights and selected controls; four generic status entries; optional energy flow or readings; profile import/export; original LG Home access. The docs include installation, updates, Developer Mode maintenance, recovery, HA tokens and manual helper adaptation.

## Preview limitations

This configurable community build has **not been installed or physically tested on a TV**. Local JavaScript tests, ES5 checks, packaging, native filter tests and ARM helper cross-compilation passed. The predecessor TV observations are separate evidence. Hosted CI shows checks for the published commit; it does not prove TV behavior. The HA startup blueprint and complete macOS/Linux setup paths still need acceptance testing. Review [validation](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/docs/VALIDATION.md) and [security](https://github.com/mbsintegrations/LG-Home-Launcher/blob/main/docs/SECURITY.md), especially the experimental helper.

Known dependency advisories remain in the desktop CLI tree and optional legacy helper; they are recorded in the security guide. This is not a security-audited production release.

Independent GPL-3.0 project by [MBS Integrations](https://mbsintegrations.ie), with preserved upstream helper notices. Not affiliated with LG or Home Assistant.
