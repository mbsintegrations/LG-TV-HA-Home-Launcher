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

Versions 0.1, 0.2 and 0.3 embed the profile and token into each locally configured package. Rebuilding reapplies settings; it does not rely on `localStorage` surviving updates. The same app ID replaces that app on the selected TV. Do not use a package intended for another household/room.

## Updating to 0.5

This stability update preserves profile schema 1, app tiles, controls, palettes and layouts. Optional latency readings now wait 10 seconds after Home opens or returns to the foreground. Existing network choices remain unchanged.

For the base launcher without a helper, import your saved profile, reconnect HA and rebuild normally. For a helper-enabled TV, update **both packages**: launcher 0.5 (including its helper service) and Home Helper 0.2.0 (including its controller). Installing only the base wizard package does not preserve a helper installation.

1. Save your current working pair, exported profile and per-TV helper options privately.
2. Use the new source and the [configured helper build](HOME-BUTTON-HELPER.md#6-build-your-private-launcher--helper-pair) with those same options, profile and private connection file. Revalidate the probed identity if the helper was removed or Developer Mode expired.
3. Pause with `node helper/remote.cjs YOUR_TV pause` and confirm release before replacing packages. If release is not confirmed, use the recovery steps in the helper guide.
4. Install both new IPKs on that same TV, preserving their app IDs. Open Home and select **Resume Home button** once if it was paused for the update.
5. **Starting Home button…** means the request is pending. Wait for **Home button active**, then check short Home, YouTube return and long Home/LG Home escape. Test standby and check latency appears after its delay.

The helper retries a missing controller only once; a failed start remains paused with an error until you choose Resume. The HA startup automation is still needed to open Home after power-on. Automatic helper recovery attaches the button handler without switching the foreground app.

To roll back, pause and confirm release, then reinstall your saved launcher/helper pair together. Do not mix a new controller with an old service or use a public sample over your configured installation.

## Moving from 0.2.0 to 0.3.0

Import your saved profile into the new configurator. Schema version 1 is unchanged. Profiles without customizer settings receive no background images, solid cards and the existing layout/palette and entity mappings. The energy view stays as saved until you choose **Home cards → Energy & power → Power layout → Energy flow · animated house**.

Add backgrounds in Your space, or open the optional Theme customizer for card finishes and arrangement. Export the profile again before closing setup; uploaded images are included in it, so treat personal photos as private even though exports contain no HA token. Reconnect HA and build/install your own private IPK. Keep the previous version's profile and IPK for rollback: older releases do not understand the new customizer fields.

The native helper remains 0.1.0. Follow the helper-enabled build procedure and preserve its options, service identity and credentials; do not replace an existing helper-enabled installation with the plain sample IPK. Pause and verify input release before updating its service-bearing package, then resume and check Home.

## Moving from 0.1.1 to 0.2.0

The profile schema remains version 1. Import your exported profile: missing layout defaults to Classic, missing app appearance defaults to Text Only, and the optional Sun entity defaults empty. Your app IDs, control targets and selected entities are retained.

Choose one of the new layouts and a Color Palette in Your space. Select app logos or extra presets in Apps & inputs if wanted, then export the revised profile. Rebuild a private IPK with your HA connection and install it over the same `com.mbs.communityhome` app. Do not install the public sample over your configured app expecting it to retain the token.

If you already use the manual helper, keep your per-TV options and follow its configured build procedure; the base wizard intentionally does not package a helper-enabled profile. The native helper remains 0.1.0 and does not need a new binary just for themes or logos. Pause and verify input release before replacing the service-bearing package, then explicitly resume and check Home. Do not uninstall/recreate the helper simply to change appearance.

Adding an app tile does not add it to the helper’s watched-app exit list. Short Home interception is separate. To return automatically when leaving an additional streaming app, update the reviewed `watchedApps` configuration using the [helper guide](HOME-BUTTON-HELPER.md); keep Home, HDMI, Live TV and Guide out of that list.

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

## Updating to 0.4.0

Import your exported profile in the new configurator. Existing profiles retain their apps, controls and appearance; network features default to off. Enable Speed Test and/or latency under Network, export again, then rebuild and install over the same app ID. If you use the Home-button helper, follow the existing helper-aware build/update steps to retain its service. Do not install the public sample IPK over a configured installation.
