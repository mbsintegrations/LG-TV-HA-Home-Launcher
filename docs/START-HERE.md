# Start here

New to the wizard? See the [five-step configurator walkthrough](CONFIGURATOR-TOUR.md), [themes and colours](THEMES.md) and [screenshot gallery](SCREENSHOTS.md).

## What goes where

| Device | Purpose | Must stay on? |
|---|---|---|
| LG webOS TV | Runs Home Launcher and optionally Home Helper | While using it |
| Existing Home Assistant | Supplies readings and executes selected controls | Yes, for HA features |
| Windows/Mac/Linux computer | Runs setup, discovers entities and builds your package | Only during setup or updates |

Do not install a second HA instance. This app uses your existing one. The launcher does not need the Camera Overlay's video relay; they are separate apps.

## Download and verify

Open this project's [Releases](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/releases). Download **LG-TV-HA-Home-Launcher-0.3.0-source.zip** and **SHA256SUMS.txt** under Assets. The optional **com.mbs.communityhome_0.3.0_SAMPLE_all.ipk** contains no credentials and cannot supply live HA readings. Build your own package with the wizard for normal use.

Use the named source archive so its checksum matches; GitHub's automatically generated source ZIP has different bytes. In your download folder run the command for your computer and compare the result with the matching line in SHA256SUMS.txt:

Windows PowerShell:

```powershell
Get-FileHash .\LG-TV-HA-Home-Launcher-0.3.0-source.zip -Algorithm SHA256
```

macOS:

```sh
shasum -a 256 LG-TV-HA-Home-Launcher-0.3.0-source.zip
```

Linux:

```sh
sha256sum LG-TV-HA-Home-Launcher-0.3.0-source.zip
```

If the hash differs, stop and download again. Extract the ZIP with your file manager; do not run setup from inside the archive. Find the extracted **LG-TV-HA-Home-Launcher** folder containing package.json and config.example.json.

## 1. Prepare your computer

Download a supported Node.js LTS **22 or newer** from [nodejs.org](https://nodejs.org/en/download). Extract the project to a local folder you own, outside OneDrive/iCloud/Dropbox, public shares or a web server document root. Builds later contain credentials.

Open a terminal in the folder containing `package.json`.

Windows PowerShell:

```powershell
node --version
npm.cmd --version
npm.cmd ci --ignore-scripts
npm.cmd start
```

macOS / Linux Terminal:

```sh
node --version
npm --version
npm ci --ignore-scripts
npm start
```

You should see `Home Launcher setup: http://127.0.0.1:8780/`. Open that exact address on the same computer. Do not substitute a LAN address or forward the port. The wizard intentionally binds to loopback and rejects other Host headers.

If port 8780 is occupied, Windows: `$env:PORT='8782'` before `npm.cmd start`; Mac/Linux: `PORT=8782 npm start`. Use the address printed by the server.

The official packaging tool has legacy transitive dependencies. Deprecation messages are not a reason to run `npm audit fix --force`; that would change the tested toolchain. See [security](SECURITY.md).

## 2. Explore Your space

Choose a room label, weather display name, IANA time zone, locale, 12/24-hour clock and palette. The weather label does not request a forecast for that location: your selected HA weather entity supplies the actual readings.

The preview starts with sample entities and readings. Your PC time is used for the clock in the selected time zone. Buttons show preview messages; they cannot turn anything on or move a gate.

## 3. Connect Home Assistant

Follow [HA account/token setup](HOME-ASSISTANT.md). Enter the base address and token in step 2. Prefer HTTPS with a trusted certificate. For a trusted isolated LAN, plain HTTP requires an explicit checkbox because it exposes the token in transit.

Click **Connect & find entities**. A successful result reports the entity count. The token field is then cleared. The token remains in the setup process memory until you disconnect or stop it; a live build copies it into your private TV package.

If you only want to review the design, skip this step.

## 4. Choose apps and cards

Use **Apps & inputs** and **Home cards**. Replace the example entity IDs with your actual discovered entities. The searchable input suggestions show the HA friendly name next to the ID. You may type an ID, but a live wizard build checks it against discovery results.

Remove controls and cards you do not need. For details, including power sign and laundry time formats, read [configuration](CONFIGURATION.md).

The wizard does not discover installed TV apps: get their IDs using the documented [TV inventory procedure](INSTALL.md#find-app-ids). Suggested streaming IDs are not guaranteed for every region.

## 5. Review, save and build

Open the full-screen preview. Use arrow keys, Enter and Escape to test navigation. Check the layout from a sensible viewing distance.

Choose **Export profile**. Save this JSON; it contains labels and entity IDs but no token. Treat it as private household metadata even though it is credential-free.

Choose **Build private TV package** after connecting to HA. A sample build is available without HA, but cannot show live home readings on a TV. Build success displays the package name and SHA-256 checksum. Download the IPK.

The package and staging files are also saved under `private/builds/<build-id>/`. Protect this folder and downloaded private IPKs. On Unix, the build directory is created with owner-only permissions; on Windows, review the folder's Security permissions. No encryption-at-rest claim is made.

## 6. Install separately

Follow [TV Developer Mode](DEVELOPER-MODE.md), then the [webOS Dev Manager walkthrough](WEBOS-DEV-MANAGER.md), or use the [official CLI alternative](INSTALL.md). This wizard never installs, launches or replaces TV apps and never enables a startup automation. Once installed and working, stop setup with Ctrl+C. The TV connects directly to HA.

## 7. Keep Developer Mode active

Developer Mode has an expiry timer. Follow [session maintenance and automatic HA renewal](DEVELOPER-MODE.md#automatic-renewal-with-home-assistant) before leaving the installation unattended. The guide includes the private renewal URLs, a downloadable HA package, failure notifications and verification steps. If Camera Overlay already renews this TV, reuse that instead. Manual EXTEND in the TV's Developer Mode app remains an option.

## 8. Optional features

Add the [HA startup blueprint](HOME-ASSISTANT.md#start-home-when-the-tv-turns-on). If you want Home-button interception, read the complete [manual helper guide](HOME-BUTTON-HELPER.md) first. Do not install the helper until the base app is working and you can perform the physical remote tests.
