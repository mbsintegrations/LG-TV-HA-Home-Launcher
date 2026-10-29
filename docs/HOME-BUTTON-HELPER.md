# Home-button helper: manual installation and adaptation

**Advanced, experimental, per-TV procedure. Read all of this before installing.** The wizard only builds the base launcher. This guide supplies the helper source and local scripts so an owner can inspect and adapt it. There is no claim of universal LG compatibility or approval by LG.

The helper consists of native ARM executables, an ES5 JavaScript controller and a webOS service. It is not possible to promise the same behavior on every TV by distributing a single shell script. No root is required on the reference TVs, but device access, app identity, firmware and the userspace ABI must match the assumptions below.

## 1. What it changes

- A short Home press asks webOS to launch `com.mbs.communityhome`.
- Holding Home for about two seconds releases interception and opens LG's original Home/app bar.
- The LG Home tile pauses interception before opening LG Home.
- A watched media-app transition to LG Home, observed through HA's TV entity, can return to the custom launcher. It does not redirect every foreground change.
- Controller/worker heartbeats, process identity checks, exclusive locks and release-on-failure limit the effect of a crashed process.

The underlying LG UI still exists. The helper does not replace system files, flash firmware, change the TV's Node runtime, or root the TV. Closing the launcher does **not** stop the helper. To stop it use Pause or the long Home press.

## 2. Verified models and compatibility

The base launcher is expected to work on webOS 4.x onward. The base launcher and helper are also community-confirmed on OLED55B7V-Z with reported webOS/SDK 3.9.0. **Compatibility remains specific to the model and firmware:** input devices, permissions and ABI must be checked for each TV. See [platform expectations and validation](VALIDATION.md#expected-platform-compatibility).

| Reference | Recorded helper evidence |
|---|---|
| OLED65B9PLA, firmware 05.50.00, SDK 4.10.0 | Owner confirmed short Home, long Home, LG Home tile and YouTube Back return in testing; the configurable community installation also has confirmed Home return from YouTube. |
| 65NANO766QA, firmware 04.60.91, SDK 7.6.0 | Native identity/capabilities and heartbeat/pipe-close release checks passed. The owner confirmed Home return from YouTube with the configurable community installation. |
| 43UN73906LE, installed firmware/SDK not reported | User reported all features working, including the Home-button helper, on 24 October 2026. |
| OLED65CX6LA, firmware 04.64.00, reported webOS/SDK 5.6.2, SoC o20 | Community-confirmed base app, live HA data and Home-button helper on 26 October 2026. |
| OLED55B7V-Z, firmware 06.10.65, reported webOS/SDK 3.9.0, SoC m16p | Community-confirmed base app, live HA data and Home-button helper on 26 October 2026. |
| Other TVs/firmware | Helper compatibility has not been verified; inspect and test individually. |

Both reference helpers reported active after the animated energy-view update. These results do not establish every app-exit path or cold-boot behavior; see the [validation record](VALIDATION.md).
The bedroom owner reported system sluggishness that persisted after closing the launcher. Its cause is unresolved. Do not describe that observation as proof the helper is harmless, or claim hardware inferiority without measurements. Never copy the private deployment's numeric user IDs to another TV.

## 3. Required tools and recovery preparation

- Working base launcher, paired TV and official webOS CLI from the project dependencies.
- Node.js 22+ on the setup computer; the TV keeps its own Node runtime.
- Zig **0.14.1**, from [ziglang.org](https://ziglang.org/download/), for native cross compilation.
- Python 3 for local IPK archive ownership rewriting.
- Physical remote and immediate access to the TV, with time to perform tests.
- A saved working base IPK/profile and a way to uninstall the helper through Dev Manager.

Do not have the old/private helper or another Home interception program running at the same time. A separate community app ID prevents package replacement, but cannot prevent two programs competing for the same input device. Pause/uninstall the other helper only as part of an explicitly planned migration.

Build scripts run on the computer. Commands in `remote.cjs` run on the named TV **only when explicitly invoked**. There is no automatic installation or selection of a default TV. Replace `YOUR_TV` with your own paired device name in every command.

## 4. Record TV identity and input devices

From the project folder:

```sh
npx ares-device --device YOUR_TV --system-info
node helper/remote.cjs YOUR_TV identity
```

On Windows use `npx.cmd`. Record model, firmware, SDK, developer UID/GID, Node version and the input device names. The command reads `id`, `uname`, Node version and `/proc/bus/input/devices`; it does not grab or inject input.

**Kernel architecture is not enough.** A 64-bit kernel can host the 32-bit native-app ABI used here. The supplied `struct ev` is the 16-byte 32-bit Linux input_event representation. Only `arm-linux-musleabi` is allowed by the build script. Do not change this target to aarch64 without changing the event representation and validating native tests on that ABI.

The reference source and destination names are `LGE M-RCU - Builtin [0]` and `LGE M-RCU - Builtin [1]`. Event numbers differ among TVs; the native code searches by exact name. If these devices are missing or duplicated, stop and investigate. Do not choose another device merely because its event number looks similar.

Copy `helper/options.example.json` into `private/helper-options.json`. Set:

| Field | How to choose it |
|---|---|
| developerUid | Numeric UID from the developer SSH session's `id` |
| sharedGid | A verified common GID allowing developer, native helper and service state exchange; verify native identity in the next step |
| nativeUid | Leave null until the native identity probe runs |
| sourceName / destinationName | Exact verified device names; source and destination must differ |
| homeKey | Reference Linux key code 773; changes require evidence and filter tests |
| target | Keep `arm-linux-musleabi` for the supplied implementation |
| tvEntity | Exact HA media_player entity for this television |
| watchedApps | App IDs whose exit to LG Home should return to your launcher |

Do not include HDMI, LG Home, the custom launcher or camera-overlay IDs in watchedApps. Do not loosen input permissions or use world-writable state directories to get past a failure.

## 5. Build and run the identity probe

Point environment variables to your installed tools. Examples:

Windows PowerShell:

```powershell
$env:ZIG='C:\Tools\zig-0.14.1\zig.exe'
$env:PYTHON='C:\Path\To\Python\python.exe'
node helper/build.cjs --probe private/helper-options.json
```

macOS/Linux:

```sh
export ZIG=/absolute/path/to/zig
export PYTHON=python3
node helper/build.cjs --probe private/helper-options.json
```

The output identifies a folder under `private/helper-builds/` and a probe IPK. The probe has the **same helper app ID** as the eventual native helper; installing it replaces any existing community helper package. Never use it over an active helper. It does not contain an HA token and does not grab or write input events. It writes only a diagnostic identity file into its own state directory.

Install that exact probe IPK using Dev Manager or `ares-install`, then launch:

```sh
npx ares-launch --device YOUR_TV com.mbs.communityhomehelper
node helper/remote.cjs YOUR_TV probe
```

Expected fields: a non-root `uid`, the expected shared `gid`, `compatible:true`, `inputGrabbed:false`, `eventsWritten:0`. Record the reported native UID into `private/helper-options.json`. If compatible is false or the shared group does not match, stop. A shared group should be verified, not created by altering system users.

The probe compares input event capabilities and XY limits. It cannot prove every physical remote behavior, resume behavior, performance impact or firmware quirk. A successful probe is permission to proceed to a bounded test, not permanent enablement.

## 6. Build your private launcher + helper pair

Export your intended layout as `private/profile.json`. Create `private/connection.json` in a local editor:

```json
{
  "url":"https://YOUR_HA_HOST",
  "token":"PASTE_YOUR_OWN_PRIVATE_TOKEN_HERE",
  "allowHttp":false
}
```

Never paste the real token into a shell command or documentation. If you already used the wizard, its private build contains the connection data in the staging directory; handle it with the same care. The manual connection format accepts the base HTTPS URL or its WebSocket endpoint.

Install the pinned helper runtime dependency and build:

```sh
npm ci --prefix helper/vendor --ignore-scripts
node helper/build.cjs private/helper-options.json private/profile.json private/connection.json
```

Use `npm.cmd` on Windows. The build runs native filter tests, compiles the 32-bit static programs, generates options, adds a certificate bundle and rewrites **only** the expected package state/credential ownership. It creates two private IPKs: the launcher with its service, and the native helper. Both contain HA credentials. Neither is a public release asset.

Install the generated launcher first and helper second. Do not uninstall/recreate the helper between probing and final installation; that may allocate another native UID. If an identity changes, repeat the identity verification and rebuild.

The helper's legacy `ws` dependency is pinned for old TV Node compatibility. See [security](SECURITY.md); do not silently upgrade it or the TV runtime. Modernising this dependency while retaining B9 compatibility is a separate engineering task.

## 7. Verify release behavior before normal use

The service starts paused by default. Query it:

```sh
node helper/remote.cjs YOUR_TV status
```

Confirm it is not active. If a previous session is active, pause and wait for release:

```sh
node helper/remote.cjs YOUR_TV pause
node helper/remote.cjs YOUR_TV status
```

With the owner present and no important operation in progress, run the native safety diagnostics:

```sh
node helper/remote.cjs YOUR_TV safety
node helper/remote.cjs YOUR_TV logs
```

**This safety test is an active input test.** It briefly grabs the remote and checks two failure paths, so it is not a read-only probe. Run it only after pause has confirmed release. Log entries must show READY then exit 24 for a closed controller pipe and exit 20 for a missed heartbeat, followed by `relay-self-test-complete` with pass true. Allow a few seconds before reading the log. Missing/failed results mean stop; never remove the watchdog to force success.

## 8. Two-minute trial and physical acceptance

```sh
node helper/remote.cjs YOUR_TV trial
node helper/remote.cjs YOUR_TV status
```

The trial automatically ends after at most 120 seconds. During it:

1. Short Home should open the custom launcher.
2. Test arrows, OK, Back, volume, pointer, wheel and any remote-specific keys you use.
3. Open each watched media app and exit it. App-exit detection requires the correct HA entity and fresh `app_id` updates.
4. Hold Home for about two seconds. Confirm the LG Home/app bar appears and input remains responsive.
5. Resume a fresh bounded trial, then select the LG Home tile and confirm the same escape path.
6. Let a trial expire and confirm normal LG remote behavior returns.

The launcher's **Resume Home button** enables the installed helper without a trial timeout. Use the command above for a bounded first test. Holding Home or choosing the LG Home tile pauses interception; select Resume Home button when you want automatic return again.

If you cannot perform these tests now, leave the helper paused. A service status saying active does not prove physical acceptance.

## 9. Enable persistently only after acceptance

```sh
node helper/remote.cjs YOUR_TV enable
node helper/remote.cjs YOUR_TV status
```

This starts without the trial timeout. Opening the launcher asks its service to ensure an already-enabled, unpaused helper is running. This is not a firmware boot service. Pair it with a validated HA startup automation if desired. Perform standby/wake and a genuine cold-boot test; neither the predecessor history nor a successful enable response proves persistence on your TV.

If the helper was deliberately paused, keep that choice: do not work around it with a repeated “resume every few seconds” automation.

### Standby recovery (next release)

LG accepting a launch request does not prove that the native helper started. The updated service verifies both controller and worker identities before reporting active. During startup the launcher shows **Starting Home button…**. If no controller has reported after 10 seconds, it retries once with the same session. If readiness is still unconfirmed after 25 seconds, it pauses and asks for manual Resume. A controller that has already reported never triggers this launch retry. Automatic starts and retries attach the Home-button handler without switching away from the current app.

The helper service has a finite 35-second idle timeout so its startup verification can finish even if Home is hidden. It is not a permanent polling service. This follows LG's [JavaScript service lifecycle guidance](https://webostv.developer.lge.com/develop/guides/js-service-faq). The independent native helper continues handling Home after the service idles out.

The updated launcher/helper pair records why the native worker stopped. After a long controller scheduling gap of at least 10 seconds, an enabled helper may recover from a heartbeat timeout or the controller's suspension cleanup when Home next becomes visible. Such a gap can result from standby or a prolonged system stall; it is not proof of standby by itself.

Recovery waits for the native release report, at least three seconds, and confirmation that both the previous controller and worker have exited. It clears the old suspension block only for that new session. The native ownership lock, two-second heartbeat fail-safe, held-key checks and remote release remain unchanged. Recovery is limited to one automatic attempt per five minutes. A second failure within that window remains paused until **Resume Home button** is selected; it does not retry when the window expires.

Holding Home, choosing the LG Home tile, explicit Pause, trial expiry, signals, ordinary crashes and short heartbeat stalls never trigger automatic recovery. Rebuild and install **both** private packages for this update. A helper already paused by an older version needs one explicit Resume after updating. This does not replace the HA startup automation: Home must open before its service can recover the helper. Validate standby/wake, app exits and the long Home escape on your TV before relying on it.

## 10. Model-specific modification map

| Need | Edit / inspect | Required verification |
|---|---|---|
| Different input names | options sourceName/destinationName | Native probe, matching capabilities and release tests |
| Different UID/GID | Verified options | Rebuild ownership; token mode 0600 under native UID |
| Different Home key | options homeKey; `native/filter.c` | Native tests plus real short/hold behavior |
| Different architecture | `native/filter.h`, build target/guard | Correct event size/alignment, cross-build, all native/physical tests |
| Different media apps | watchedApps | Each app exit tested; preserve HDMI/overlay behavior |
| Different HA TV entity | tvEntity | Check that its `app_id` follows the actual TV |
| Different launcher IDs | All app/service/native paths together | Package isolation, permission checks and complete regression; not a wizard setting |
| New Node/webOS behavior | controller, service and ha-watch | Syntax/runtime compatibility and watchdog/recovery tests |

Keep changes in a local fork with a clear diff. Do not disable capability comparisons, held-key checks, process identity guards, locks, long-press release or heartbeats to “make it work”. Report a model as unverified if those checks cannot be satisfied.

## 11. Recovery and removal

1. Hold Home for two seconds, or use the LG Home tile, and confirm normal LG controls.
2. If needed, use `node helper/remote.cjs YOUR_TV pause` from the paired computer.
3. Uninstall **only** `com.mbs.communityhomehelper` through Dev Manager or `npx ares-install --device YOUR_TV --remove com.mbs.communityhomehelper`.
4. Disable the optional startup automation. Keep the launcher for manual use, or reinstall your saved base package without the helper service.
5. If removing the launcher too, uninstall `com.mbs.communityhome` and revoke its HA token.

If the TV is unresponsive, use its normal manufacturer restart/recovery procedure and then remove the helper before further trials. Do not power-cycle shared infrastructure or alter other apps. Record the model, firmware, steps, and sanitised logs before reporting an issue.
