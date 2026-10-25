# Layout themes and colour palettes

The layout controls where things sit. The palette controls their colours. You can combine any layout with any built-in palette or your own custom colours.

![Dock, Weather, Sidebar and Panorama with sample readings](images/launcher-themes.jpg)

## Choose a layout

Open **Your space**, select **Color Palette** beside Clock, then choose **Layout theme** in the full-width row below. The preview updates as you edit. Open the full-screen preview to judge spacing at TV proportions.

| Layout | Arrangement | Useful when |
| --- | --- | --- |
| Dock | Clock/weather at the top, cards in the middle, controls and apps below | You want apps close to the bottom edge |
| Weather | Large weather panel at the left; apps and controls to the right; cards below | You want the weather to be prominent |
| Sidebar | Vertical app rail; controls and energy alongside; temperatures/status below | You prefer separate areas for apps and home information |
| Panorama | Wide weather scene; apps, controls and home cards in rows | You like a broad overview of the room and weather |
| Custom | Four screen rows in your chosen order; reorder apps, controls and status cards | You want your own arrangement |
| Classic | Original clock/weather, apps, controls and cards arrangement | You want to keep an existing layout |

All layouts support up to **eight app/input tiles, including LG Home**, and **six home controls**. Controls remain the same HA targets when you change theme. Cards disappear when disabled or empty; the remaining areas adapt. The first three temperatures stay on the main card. The status card supports up to four entries.

Existing profiles without a layout field open in **Classic**. Changing colours does not change the layout, app IDs, entity IDs or control actions. Selecting a theme does not install it: export the profile, rebuild the private package and reinstall it on the intended TV.

## Choose colours

| Color Palette | Character |
| --- | --- |
| Forest | Green with warm neutral accents |
| Slate | Blue and cool neutrals |
| Ocean | Teal and sea-glass tones |
| Dusk | Plum and rose |
| Sand | Warm light surfaces |
| Monochrome | Charcoal and neutral accents |
| Custom | Your own five colour values |

Custom exposes **Background, Surface, Accent, Text and Muted** colours. Use six-digit hex colours. Keep text and muted text readable against the surface; Accent is also used for selection and active states. Check the focused app tile in the full-screen preview as well as ordinary cards. A light surface automatically uses contrasting bundled logo variants where supplied.

The configurator keeps its own MBS colours and logo. The TV uses your selected palette, with only the small “by mbsintegrations.ie” footer credit.

## Weather artwork and day/night

The selected HA weather entity supplies the actual condition and temperature. Local SVG artwork depicts sun, clouds, rain, snow and other supported conditions. Weather and Panorama use a larger sky scene; its light or dark appearance follows the weather/day-night state independently of the card palette.

For reliable night appearance during cloudy or rainy weather, select your Sun integration entity in **Home cards → Day / night entity**. When configured, **below_horizon** selects night; otherwise the weather integration's day/night attribute or clear-night condition is used. An unavailable Sun entity is not a reliable indication of night, so check that the selected entity works in HA.

**Weather display name is a label only.** The weather integration behind the selected HA entity determines the location. To use another location, configure that weather entity in HA first. See [weather configuration](CONFIGURATION.md#where-the-actual-weather-location-is-configured).

## Preview and apply

1. Import your exported profile or start with the sample.
2. Choose layout and colours in Your space.
3. Review apps and Home cards; leave unused features empty or disabled.
4. Open the full-screen preview. Try arrows, Enter and Escape. Its readings are fictional and its controls never operate your home.
5. Export the updated profile. Connect HA, build privately and install using [webOS Dev Manager](WEBOS-DEV-MANAGER.md).
6. For an installation using the optional helper, follow the [helper update procedure](UPDATES-AND-RECOVERY.md#update-a-helper-installation) so its service and per-TV ownership remain correct.

See the [complete screenshot gallery](SCREENSHOTS.md) for every preset combination and custom examples. Version 0.3.0 adds [uploaded backgrounds, rotation, card styling and custom row arrangement](CUSTOMIZER.md). Rows snap into fixed positions; cards cannot overlap or be freely resized.
