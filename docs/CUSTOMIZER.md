# Backgrounds and the theme customizer

Available in **v0.3.0**. Backgrounds, card styling and arrangement are optional; your existing layout and palette still work on their own.

Upload backgrounds directly in **Your space**, below **Layout theme**, including rotation, image opacity and darkening. No customizer is required. The **Open theme customizer** button below these settings, or **Theme customizer** in the sidebar, opens optional card styling and arrangement controls. **Continue** goes straight to Home Assistant setup.

The customizer has three tabs: Backgrounds, Card styling and Arrangement. The preview uses sample readings and never sends household commands or installs anything on a TV.

## Backgrounds

- Upload or drop 1–5 JPG, PNG or static WebP images. Maximum input: 4 MB and 16 megapixels per image. Animated images and SVG are not accepted.
- Best source: **1920 × 1080, 16:9**, ideally **200–450 KB**. Other aspect ratios are centre-cropped. The preview shows the result; pre-crop a photo if its subject needs a different position.
- Images are resized to Full HD and re-encoded as JPEG in your browser, removing source metadata. Each optimized image must fit within **450 KB**. Five images total at most about **2.2 MB** of image files; decoded images use more memory.
- A single image is static. With multiple images, select 30 seconds, 1 minute, 2 minutes or 5 minutes. Off shows the first image. Use **Use first** to choose it.
- Rotation pauses while Home is hidden. There are no zoom, pan or crossfade effects. One static image is the lightest option for older TVs.
- **Image opacity** fades the photo into the palette: 100% shows it fully; 0% hides it. **Darken background** independently adds a black overlay from 0% to 85%. Both sliders display their percentage.
- Aurora, Dusk and Forest are optional lightweight generated samples.

Images remain in the local setup session and are embedded in your exported JSON profile and built TV package. Export before stopping the configurator. An export has no HA credential, but uploaded photos can be private: review them before sharing. No online image service or remote background URL is used.

## Card styling

Choose Solid (100% opaque), Translucent (60% tint), Outlined (15% fill with a bold edge) or Glass (30% tint with a frosted wallpaper and soft highlights). Selecting a style applies its starting opacity. Adjust it from 10% to 100% for any style except Solid. Opacity differences are much clearer over a photo than a plain palette.

Glass generates one small blurred wallpaper when the image changes and shares it across cards, with tint and highlights over it. It works without modern browser backdrop-filter support. It frosts the wallpaper rather than other live content. TV performance still needs physical testing.

Corner shape applies to app tiles, controls, status cards and the weather panel. Square also removes rounding from inner energy boxes. Optional accent borders and separate colours for apps, controls, temperatures, status and energy remain available. Check contrast from TV distance, especially with translucent surfaces.

Reset card styling restores the defaults without removing photos, entity mappings or app choices. These settings are independent of the overall palette and layout theme.

## Drag-and-drop arrangement

Drag app tiles and controls within their lists, or use **Earlier** and **Later**. LG Home remains last for recovery. Moving an item preserves its app ID or HA entity mapping.

Existing themes retain their designed section positions. Choose **Custom arrangement** to reorder four rows: Clock & weather, Apps & inputs, Home controls and Status cards. Rows snap into fixed positions on the 1920 × 1080 canvas; this is not arbitrary overlapping or resizable placement. Status cards can be reordered except in Sidebar, which keeps its fixed positions. Hidden sections do not consume a row.

## Animated house energy card

In **Home cards > Energy & power > Power layout**, choose **Energy flow · animated house**. The classic diagram and simple readings remain available. The house view uses our original vector illustration, with SVG moving dots to show measured power direction, using the same W/kW and sign settings as the existing card.

- Leave a power entity empty, or select **Hide** for that device, to remove its node and connection. Battery and charger branches are optional. Entities missing from a connected HA snapshot are hidden; no device is inferred from its name.
- A present sensor reading zero remains visible as idle. Unknown/unavailable readings show no active flow. Disconnection stops flow rather than animating stale readings. Battery percentage is optional and belongs to the battery branch.
- Positive grid power means import; negative means export. Positive battery power means charging; negative means supplying. Use **Invert sign** if your integration uses the opposite convention. Charger power normally flows away from the house; negative values flow toward it.
- The house is the diagram's connection point. Lines show each sensor's direction, not an inferred split of solar energy between individual consumers.
- Animation pauses while Home is hidden and respects reduced-motion preferences. The preview uses sample readings. The house view was installed on both reference TVs; its Living Room appearance was accepted by the owner.

The house uses the original vector illustration from our Home dashboard. It has no vendor name or branding. Battery, solar panels and charger artwork follow the available configured sensors; the car is hidden when neither charger is configured. The card title and individual labels remain editable.

## Preview updates

The configurator retries layout saves once after a local server restart. It never automatically replays credential discovery or package builds. An update failure appears above the preview as well as in the footer. Refresh an older configurator tab after a code update to load the new controls.

## Screenshots

![Background upload and rotation controls](images/screenshots/customizer-backgrounds.jpg)

![Card finishes, corners and opacity](images/screenshots/customizer-cards.jpg)

![Arrange rows, app tiles and controls](images/screenshots/customizer-arrangement.jpg)

![Animated house energy flow with sample readings](images/screenshots/energy-house.jpg)
