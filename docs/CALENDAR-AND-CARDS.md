# Calendar, card placement and live preview

## Choose your cards

Open **Home cards → Visible cards & order**. Tick the cards you want and use **Move up** to change their order. You can show Temperature, Calendar and Energy together, any two, or just one. Hidden cards keep their entity mappings and titles. A temperature card needs at least one temperature sensor; Energy also needs its existing enabled setting.

Calendar uses the Appliances & status slot. Switch **Show calendar instead of appliances & status** off to restore the appliance/status card; its settings are retained. Calendar and appliance status cannot occupy two separate slots simultaneously in this version. The optional [HDMI input preview](#live-hdmi-input-preview-optional) likewise takes the Temperatures slot.

For row-based themes, order is left to right and selected cards share the available width. Sidebar has three fixed positions: lower left, lower right and upper right beside the controls. With two cards they share the bottom row; one fills that row. Your imported profile keeps its existing geometry until you edit card visibility or order. The theme customizer's card styling and order still apply.

## Connect a calendar

1. Set up your calendar in Home Assistant first: Google Calendar, local calendar, CalDAV or another supported integration. Confirm events appear in HA's calendar dashboard.
2. Connect the configurator to HA, then open **Home cards** and enable the calendar card.
3. Select one to four `calendar.*` entities. Give each a short label and colour.
4. Choose a title, **3, 4 or 5 events**, and **Today / next 3 / 7 / 14 days**. Today means the current calendar day in the launcher's configured time zone, not the next 24 hours.
5. Review and rebuild your private TV package as usual. No separate Google login is needed in the launcher.

Events merge into one ordered list. Ongoing events are retained until their end; all-day end dates are exclusive. Times use the profile's time zone and 12/24-hour preference. Long titles are shortened visually to fit. Three events is the roomiest option; five is denser. Descriptions, locations and attendee lists are not displayed.

The TV uses Home Assistant's read-only [`calendar.get_events`](https://www.home-assistant.io/integrations/calendar/#action-calendarget_events) action over its existing authenticated WebSocket, with a response. Use an HA version/integration supporting this action and a launcher account allowed to read those calendars. It does not create, edit or delete events. Refresh is every five minutes while Home is visible, and on reconnection; polling stops while hidden. Calendar failures show unavailable rather than pretending there are no events. The other home cards continue working.

## Optional live preview

Above the configurator preview, select **Live HA data · read-only** after connecting HA. It reads the selected entity values every 30 seconds; calendar events use HA's [calendar REST endpoint](https://developers.home-assistant.io/docs/api/rest/). Sample data remains the default. The standalone full-screen preview remains a sample display.

The setup server keeps the token in memory and returns only selected display values and event titles/times/labels to the embedded preview. Device-control and app buttons remain demonstrations: the preview cannot send household commands or install anything on a TV. Requests stop when the configurator tab is hidden. Disconnect or close the setup server to forget credentials. Avoid sharing screenshots containing private calendar titles.

The HA address and explicit plain-HTTP choice survive changing steps, building and reloading the page while the same setup process is running. Tokens are never refilled into the browser. Restarting the server clears the connection; reconnect using your token. Exported profiles contain neither the token nor connection address.

## Live HDMI input preview (optional)

The Temperatures slot can instead show one of the TV's HDMI inputs live, for example a set-top box or a streamer. In **Home cards → HDMI input preview**, choose **HDMI 1–4** and an optional title (up to 28 characters). Choose **Off** to restore the temperature card; its sensor settings are kept, and while the preview is on the launcher does not subscribe to those sensors. The Temperatures card must be ticked in **Visible cards & order**. This is a per-profile setting (`hdmiPreview: {input: "hdmi:1", label: ""}`) and works in every layout that can show the Temperatures card.

Select the card with the remote (OK) to open that input full screen (`com.webos.app.hdmiN`, the same launch as an HDMI app tile).

How it works: the launcher places one muted `<video><source type="service/webos-external" src="ext://hdmi:N"></video>` in the card. This is the webOS "Input/TV embedding" method described in the [webOS Brew web development notes](https://www.webosbrew.org/pages/web-development). The TV's own input pipeline renders the signal; the launcher does not decode, copy or re-encode frames. The profile's Content Security Policy gains `media-src ... ext:` only when a preview is configured.

Behaviour to know about:

- Only one video exists at a time. It is released completely (paused, source removed, element removed) when Home is hidden, before any dialog opens or an input is launched, and on page hide. It restarts when Home is visible again.
- If the TV refuses the source, or the input has no signal, the card shows a placeholder instead of a broken video.
- The configurator and the standalone preview always show a static placeholder: `ext://` sources only exist on the TV. A browser's own remote inspector may also show the video area black while the TV screen shows the input.
- Audio is muted; sound plays only in the full-screen input.
- Support depends on the TV's webOS version and input hardware. Test on your model and report the result.

## Screenshots

![Calendar alongside temperature and energy cards, Panorama in plum with sample data](images/screenshots/calendar-panorama.png)

![Card selection and calendar setup in the local configurator](images/screenshots/configurator-calendar.png)
