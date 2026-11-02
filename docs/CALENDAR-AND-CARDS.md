# Calendar, card placement and live preview

## Choose your cards

Open **Home cards → Visible cards & order**. Tick the cards you want and use **Move up** to change their order. You can show Temperature, Calendar and Energy together, any two, or just one. Hidden cards keep their entity mappings and titles. A temperature card needs at least one temperature sensor; Energy also needs its existing enabled setting.

Calendar uses the Appliances & status slot. Switch **Show calendar instead of appliances & status** off to restore the appliance/status card; its settings are retained. Calendar and appliance status cannot occupy two separate slots simultaneously in this version.

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

## Screenshots

![Calendar alongside temperature and energy cards, Panorama in plum with sample data](images/screenshots/calendar-panorama.png)

![Card selection and calendar setup in the local configurator](images/screenshots/configurator-calendar.png)
