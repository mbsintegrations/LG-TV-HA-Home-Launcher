# LG Home Launcher

[![Validation](https://github.com/mbsintegrations/LG-Home-Launcher/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/mbsintegrations/LG-Home-Launcher/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/mbsintegrations/LG-Home-Launcher?include_prereleases&cacheSeconds=300)](https://github.com/mbsintegrations/LG-Home-Launcher/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mbsintegrations/LG-Home-Launcher?style=flat&logo=github)](https://github.com/mbsintegrations/LG-Home-Launcher)

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://paypal.me/mwahl1973)
[![MBS Integrations](https://img.shields.io/badge/MBS_Integrations-mbsintegrations.ie-73dbe2)](https://mbsintegrations.ie)

**Community preview.** See [compatibility and validation](docs/VALIDATION.md).

A configurable home screen for LG TVs: streaming apps, HDMI sources, weather, room temperatures, lights, energy flow and configurable appliance/device status. Designed for the remote, with a compact 1920×1080 layout that scales to the screen.

The launcher talks directly to your Home Assistant. The setup computer can be shut down afterwards. No cloud account with this project, Mac service, Docker relay, or custom HA integration is required.

**[Start here](docs/START-HERE.md)** · [Configuration](docs/CONFIGURATION.md) · [Manual Home-button helper](docs/HOME-BUTTON-HELPER.md) · [Troubleshooting](docs/TROUBLESHOOTING.md) · [All documentation](docs/INDEX.md)

![LG Home Launcher browser preview with fictional readings, Dusk palette, streaming apps and home cards](docs/images/launcher-preview.png)

*Browser design preview with sample data.*

## Install in order

1. [Download the release source](https://github.com/mbsintegrations/LG-Home-Launcher/releases), verify its checksum and [start the local configurator](docs/START-HERE.md).
2. Choose a layout, connect HA and build your own private IPK. The public sample IPK has no HA token.
3. [Enable TV Developer Mode](docs/DEVELOPER-MODE.md), then [pair and install with webOS Dev Manager](docs/WEBOS-DEV-MANAGER.md).
4. Check the base app on your TV before adding [startup automation](docs/HOME-ASSISTANT.md#start-home-when-the-tv-turns-on) or the [optional manual Home-button helper](docs/HOME-BUTTON-HELPER.md).

The computer is only needed for setup and updates. The installed TV app connects directly to your existing HA instance. The helper is an advanced, model-dependent option; the base app can be used without it.

## What you get

- A local browser wizard for Windows, macOS and Linux, with a working sample preview.
- Read-only HA entity discovery and selection; no YAML editing for the launcher.
- Up to 8 app/input tiles, 6 controls, 12 temperatures (first 3 on the main card), 4 generic appliance/status rows and an optional energy card.
- Export/import of credential-free layout profiles. One profile per TV.
- A private configured IPK built on your own computer. No source edits required.
- An optional HA startup automation blueprint.
- Optional Home-button helper source, build scripts and extensive manual adaptation/recovery instructions. It is never automatically installed or enabled by the wizard.

![MBS Integrations local launcher configurator with weather-location guidance](docs/images/configurator-preview.png)

*The MBS configurator has its own branding. TV palettes are selected independently.*

## Quick local preview

Install Node.js 22 or newer. Extract this project outside shared/cloud-synced folders, then run from its folder:

```sh
npm ci --ignore-scripts
npm start
```

On Windows PowerShell use `npm.cmd` in place of `npm`. Open **http://127.0.0.1:8780/**. No TV or HA connection is needed to explore the design. Preview buttons never send device commands. Stop the wizard with Ctrl+C.

## Important boundaries

This is a sideloaded webOS app, not an LG Content Store release. Developer Mode is required. The base app does not replace LG's Home button; use the separately documented helper if your model supports it. The helper is a native program plus JavaScript controller/service, not a universal shell script.

For version 0.1, configuration changes are made in the wizard and applied by rebuilding/reinstalling the package. There is no on-TV settings editor or QR pairing flow. Import your saved profile to update it. This deliberately avoids relying on `localStorage` surviving packaged-app updates.

**Your private configured IPK contains your HA access token. Do not share it.** Public sample packages contain no credential and show “Setup required” on a TV. The browser preview uses fictional sample readings even after HA discovery.

The community app IDs are `com.mbs.communityhome` and `com.mbs.communityhomehelper`.

## Compatibility and evidence

The original launcher is installed on an LG OLED65B9PLA (SDK 4.10.0) and 65NANO766QA (SDK 7.6.0). Testing of the configurable community edition on the Living Room TV is being prepared. See [compatibility and validation](docs/VALIDATION.md) for the current coverage.

Own code is GPL-3.0-only. The adapted helper retains its MIT notices. See [NOTICE](NOTICE) and [licensing](docs/LICENSING.md). Independent project; not affiliated with LG or Home Assistant.
