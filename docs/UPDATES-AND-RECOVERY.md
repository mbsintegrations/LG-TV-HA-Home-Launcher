# Updates, backups and removal

## Back up before changes

Keep your exported layout profile, exact working IPKs and their checksums in a private local folder. Use a separate profile/token per TV. A profile is credential-free but still contains household names and entity IDs. Private IPKs and staged connection files are credentials.

The wizard does not retain edits after its process restarts unless you exported them. Export before closing. If you built already, a profile also exists next to the IPK under `private/builds/<id>/`.

## Update the base app

1. Keep the old working IPK and profile.
2. Extract the new source into another private folder and install its locked build dependencies.
3. Start the new wizard and import your saved profile. Read migration/release notes before accepting a future schema version.
4. Connect with your dedicated HA token, review discovered IDs and preview the layout.
5. Build a new private package and install on one TV first, at a convenient time.
6. Verify actual remote/app/HA behavior before updating other TVs.

Version 0.1 embeds the profile and token into each locally configured package. Rebuilding reapplies settings; it does not rely on `localStorage` surviving updates. The same app ID replaces that app on the selected TV. Do not use a package intended for another household/room.

## Update a helper installation

Pause and confirm input release before replacing helper/service packages. Preserve the probed native UID relationship. Removal/recreation can change ownership identity, requiring another probe and rebuild. Repeat heartbeat/pipe-close and physical acceptance checks. An app-version bump is not sufficient evidence that old ownership still applies.

Never install a probe over a running helper. Do not run the predecessor/private helper alongside the community one.

## Return to LG Home

Without helper: choose the LG Home tile or press Home normally.

With helper: hold Home about two seconds or choose LG Home to pause interception. If needed, run `node helper/remote.cjs YOUR_TV pause`. Confirm normal remote behavior before removal.

Disable the startup automation if you no longer want the launcher to open on power-on. Removing the helper alone does not disable an HA automation.

## Remove

Uninstall `com.mbs.communityhomehelper` first if installed, then `com.mbs.communityhome` if desired. Use Dev Manager or official `ares-install --remove` with the explicit device. Revoke that TV's HA token. Remove private build/download folders with your normal file manager once their backups are no longer needed; do not delete unrelated project or pairing folders.

## Developer Mode expires

LG may uninstall sideloaded apps when Developer Mode is disabled/expired. Re-enable it using LG's instructions, re-pair if necessary, and reinstall your saved base package. Re-probe identity before restoring a helper. Do not assume old native UID, keys or session state survive.
