# LG TV – HA Home Launcher 0.6

One combined update for calendars, configurable card placement, live setup previews and Home-button recovery.

## New

- **Calendar card:** merge up to four Home Assistant calendars; show 3–5 upcoming or ongoing events with date, time, all-day labels and a colour/label per calendar. Choose today, 3, 7 or 14 days. Works with calendars already integrated into HA; no separate Google login. Read-only, off by default, refreshes every five minutes while Home is visible.
- **Card selection and order:** show one, two or three cards and arrange Temperature, Calendar and Energy. Appliances & status remains an alternative to Calendar in the middle card slot. Hidden card settings are retained. Existing profiles retain their layout until edited.
- **Live HA preview:** optional read-only display in the local configurator, refreshing every 30 seconds. The token stays in the setup server; only selected display data reaches the iframe. Sample mode remains the default.

## Fixed

- A two-second Home hold opens LG Home without permanently disabling short Home. A short press returns to the launcher; an eight-second hold releases interception as an emergency escape. Physical key-state checking prevents delayed releases from becoming false holds.
- Startup blueprint ignores brief false-off reports during playback: the default requires 60 seconds reported off before the existing on-state settling delay. Quick standby cycles below that threshold may require a Home press. Longer connection outages can still resemble power-off.
- Sidebar status columns keep long names and values inside their own column. Read-only lock status entities are now selectable.
- HA address and plain-HTTP choice survive step changes, builds and page reloads within the same setup server session. Tokens are not returned to the page. Server restart still forgets the connection.
- Configurator edition now displays 0.6.

## Updating

Import your saved profile, connect HA and rebuild your private package. For helper installations rebuild and install **both** packages: launcher **0.6.0** and helper/service **0.3.0**, with your existing TV-specific options. Pause and verify input release before installation. Keep your old pair for rollback.

**Existing startup automations need a separate update.** Re-import the startup blueprint and check each automation's minimum-off value. Hand-written automations do not inherit blueprint changes: add the equivalent guard or disable automatic startup until updated. Replacing a TV IPK does not change HA automations.

The LG Home tile deliberately pauses the helper; reopen Home and select Resume after using that tile. This differs from the new two-second remote hold. [Helper and recovery guide](HOME-BUTTON-HELPER.md) · [Calendar and live preview](CALENDAR-AND-CARDS.md) · [Update instructions](UPDATES-AND-RECOVERY.md#updating-to-06).

## Validation

The B9 owner accepted two-second LG Home → short Home and return after extended YouTube viewing on 1 November, describing return as practically instant. The startup duration guard rejects the brief false-off intervals observed on 2 November; long-playback acceptance of that separate mitigation is pending.

Calendar/live-preview behaviour, profile compatibility and layouts have automated/browser coverage. They are not yet physically accepted on a TV. Repeated standby, physical eight-second emergency release/arrows/volume, background/Glass performance and older-TV network testing remain on the roadmap. TV installations are not changed by this release.
