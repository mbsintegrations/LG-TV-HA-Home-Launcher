# Configure the launcher

## Profiles

`config.example.json` is the complete version-1 profile. The wizard validates all fields and rejects unknown fields, including credentials accidentally inserted into a profile. Profiles describe the display, not HA authorization. They contain household metadata such as labels and entity IDs.

The wizard stores the current editing profile in server memory. **Export before closing or restarting setup.** On restart the example profile is loaded. Import a saved profile to continue. The build also saves a profile alongside its package in `private/builds/`.

The only on-TV version-1 configuration is the packaged profile. To change it, edit/import in setup, rebuild and reinstall. The public source can be reused unchanged for each household.

## Layout and palette

In **Your space**, choose a **Layout theme** independently of **Color Palette**. Classic preserves the original layout; Dock puts apps along the bottom; Weather gives the weather a larger panel; Sidebar uses a vertical app rail and grouped controls; Panorama uses a wide weather scene. Every layout supports up to eight app tiles and six controls. Existing profiles without a layout continue to use Classic.

The optional **Day / night entity** under Home cards accepts a Sun integration entity. This lets cloudy and rainy weather also use a night appearance. Without it, clear-night and any day/night attribute supplied by the weather integration are used. Weather artwork is generated locally as lightweight SVG; no image service or external downloads are required.

See [themes and colours](THEMES.md), the [complete screenshot gallery](SCREENSHOTS.md) and the [configurator walkthrough](CONFIGURATOR-TOUR.md) for examples and step-by-step setup.

## Apps and inputs

Up to eight tiles including LG Home. Use Move up to reorder; repeatedly moving a later tile up can place it anywhere. Remove an unused tile. LG Home must remain last and cannot be deleted from the wizard. The schema enforces this for imported profiles too.

Choose a common app, Live TV, TV Guide or HDMI input from the dropdown, or enter a custom ID. App IDs must be unique. Choose Text Only, Logo, Logo and Text, App Logo, or App Logo and Text for each tile; appearances do not change the launch target. See [app tiles and logos](APP-TILES.md) for presets and compatibility, and [app IDs](INSTALL.md#find-app-ids) to find the exact ID on your TV.

## Network

Speed Test and latency are optional and disabled in new profiles. In **Network**, add the tile (one of eight slots) and enable router and/or internet readings independently. TCP is recommended; ICMP requires TV permission. Select 1.1.1.1 or 8.8.8.8 and a 15, 30 or 60 second interval. Router detection is automatic unless overridden. [Full network guide](NETWORK.md).

## Temperatures and weather

The first three temperature sensors appear on the main card. Up to twelve appear in All rooms. Remove all temperatures to hide that card. Labels may be up to 28 characters; short names work best at TV distance. Sensor units are displayed as reported by HA, without silently converting Celsius/Fahrenheit.

### Where the actual weather location is configured

**Your space → Weather display name is only text on the TV.** Typing a city there does not look it up, change coordinates or request weather for that city.

In **Home cards → Weather**, select the HA weather entity whose readings you want. Its Home Assistant weather integration determines the actual location. Some integrations use the home coordinates configured in HA; others have their own location settings. To show weather for somewhere else, configure a weather entity for that location in HA, then select it in the launcher. Check the readings in HA before giving the TV label that location's name.

For example, selecting your home's weather entity while typing “Paris” as the display name still shows your home's weather. The launcher cannot infer or override the location from that label.

An empty weather entity hides weather. The selected entity supplies condition, temperature, humidity and wind. This version does not geocode city names, fetch weather independently or provide an hourly forecast chart.

## Controls

Maximum six. Each control must target a different entity. Unknown/unavailable states are disabled on TV. Repeated actions are bounded; a command is never queued for replay on reconnect.

| Type | Configuration | Behavior |
|---|---|---|
| Light / switch | `light.*` or `switch.*` | Explicit turn_on/turn_off based on fresh state; waits for state feedback |
| Gate / garage cover | `cover.*` | Explicit open_cover/close_cover; asks before movement; moving/unknown states are disabled |
| Gate sensor + scripts | `binary_sensor.*`, two `script.*` IDs, openState `on` or `off` | Uses position sensor to choose a configured open or close script; asks before sending |
| Script | `script.*` | Asks before running; disabled while script is running |

The gate adapter does not implement UniFi-specific hold-open logic. Put any site-specific coordination (hold rules, locks, interlocks, timers) in your reviewed HA scripts and choose those scripts here. Physical position and hold-open state are different: choose a reliable feedback sensor and make scripts handle your actual system. Do not label a momentary unlock pulse as a reliable “close” action.

The setup wizard never executes a control to validate it. Review the target yourself. Do not configure infrastructure power, security bypasses, or a broad “all devices” script for casual TV access.

Cover/gate/script results say request sent; they do not prove physical completion. Non-light controls have a 30-second in-process cooldown. Light commands have an 8-second pending guard and up to five seconds of feedback checking. A full app restart clears those timers; always check the actual device before retrying a timed-out action.

## Energy flow

Use **instantaneous power**, not daily/total energy counters. Accepted input units are W and kW. Auto mode reads the sensor's unit; an unsupported or missing unit displays unavailable rather than an incorrect number. A manual W/kW override is available when you know the correct unit.

The display normalises to kW. Direction conventions after optional inversion:

| Node | Positive | Negative |
|---|---|---|
| Solar | Generating | Unexpected source convention; check mapping |
| Battery | Charging | Supplying |
| Grid | Importing | Exporting |
| Home / chargers | Consumption | Check whether the sensor is bidirectional |

Invert the battery/grid sensor if its integration uses the opposite sign. State-of-charge expects a percentage sensor. A node with an empty entity is hidden; turn off the energy card entirely if unused. The bus lines are a visual grouping; they are not a metered circuit topology or a computed electrical balance. There are no animated arrowheads.

This release shows up to two generic charger power readings. It does not infer charger plug/vehicle status or use vendor-specific enum mappings. The house view shows negative charger power as supplying and reverses its flow. It does not infer plug/vehicle connection status.

## Washer and dryer

Up to four read-only appliance or device status rows. Choose sensors or supported device entities such as a vacuum, fan or climate entity; rename each row and the card title. Status is humanised from the actual entity text (underscores replaced with spaces); numeric sensor values include their unit. Remaining time supports:

- `finish_time`: a timestamp with an explicit offset/time zone; the TV calculates remaining minutes.
- `minutes`: a numeric remaining-minute value.
- `text`: display the sensor's text directly.

Known inactive states hide remaining time. Other integrations may use different words; check what your sensors expose. This is a generic status adapter, not a dedicated LG ThinQ integration. Missing/unavailable status stays unavailable.

## Layout and limits

The main display uses the existing TV layout with flexbox and ES5 scripts for older LG engines. Forest, Slate, Ocean, Dusk, Sand and Monochrome are available, plus Custom with editable background, surface, accent, text and muted colours. The configurator uses MBS Integrations branding independently of the TV palette. Temperature, status and energy card titles are editable. Energy can use the classic diagram, animated house view or simple readings, with unused nodes omitted. See [backgrounds, card styling and arrangement](CUSTOMIZER.md) for optional customization. Cards disappear when disabled or empty, and remaining cards expand. This is not a free-form dashboard builder; limits keep navigation and text readable.

## Manual helper flag

`helper.enabled` defaults false. The base wizard refuses a helper-enabled build because correct service ownership needs a separate TV-specific build. Follow the [helper guide](HOME-BUTTON-HELPER.md). Its build enables the flag and adds the service. The flag alone cannot install a working native helper.
