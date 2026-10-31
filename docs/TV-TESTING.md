# TV testing and compatibility reports

Record the exact launcher release/commit, helper version, model, firmware and reported webOS/SDK. Mark each feature works, fails or not tested. Use the [compatibility report template](../.github/ISSUE_TEMPLATE/compatibility_report.md); successful live HA readings alone do not establish helper or network-tool compatibility.

Keep your accepted profile and IPKs privately before building test variants. Change one setting at a time. Stop developer inspection while judging responsiveness and compare with normal LG navigation. No household control needs to be actuated for these checks.

## Startup and Home button

With the helper active, open YouTube and press Home once. Repeat by exiting with Back. Put the TV into standby for at least 30 seconds, turn it on and record whether Home appears and the helper becomes active. Repeat across several normal uses. Test a normal TV restart separately and label it separately from standby.

Test long Home and the LG Home tile last: both intentionally pause interception. Confirm arrows, pointer and volume still behave normally. Reopen Home and select Resume to restore interception. If startup fails, record whether Home itself is missing or only the helper is inactive. Capture sanitized status/logs before restarting the helper when possible.

## Backgrounds and Glass

Compare these variants with the same layout, cards, apps and network settings:

| Variant | Configuration |
|---|---|
| Baseline | No background, Solid cards |
| Static photo | One 1920 × 1080 image, Solid cards |
| Glass | Same photo, Glass cards |
| Rotation | Five optimized images, Glass, 30-second rotation |

Use non-private photos and record their optimized sizes (up to 450 KB each). Try each for at least ten minutes; watch several rotations, move focus through tiles, open an app, return, and test standby. Repeat the preferred setup for a longer normal viewing session. Record noticeable delays, dropped button presses, blank images or recovery time, not guessed frame rates or memory figures.

Home pauses background rotation while hidden and generates a shared small blurred wallpaper for Glass. Automated checks cover this behavior; they do not measure a particular TV's rendering cost. If rotation is sluggish, use one static photo or a longer interval. If Glass is sluggish, choose Solid or Translucent. Keep the baseline comparison so whole-TV sluggishness is not automatically attributed to one effect.

## Network tools

For OLED65CX6LA and OLED55B7V-Z, the existing base/helper reports do not include network tools. Record a current release and each result separately:

1. Open Home with optional TCP latency enabled. It should show no reading initially and start measuring after about ten seconds; the connection itself can add timeout/response time.
2. Open another app before that delay expires and return. Home should grant a fresh ten-second delay. Polling stops while hidden; an already-started probe may finish within its bounded timeout.
3. Record router and internet TCP results separately. A blocked/unreachable port is not evidence that the internet is down. Do not label TCP connection timing as ICMP ping.
4. Start Speed Test manually and confirm completion. Record whether a result persists when reopening the panel.
5. Start another test and cancel with Back. It should return to Home and preserve the previous completed result. Latency polling resumes after its delay.
6. Check app switching and remote responsiveness. Avoid testing while someone depends on the same bandwidth: the short test transfers about 24.2 MB of planned payload plus retries/overhead.

On-TV developer network inspection can confirm hidden polling stops, but disconnect inspection before assessing performance. If you only observed the screen, say so; do not infer absence of packets from hidden readings.

## Report limits clearly

Different firmware, browser engines, network conditions and profiles can change results. Share the tested configuration and duration; use not tested for unavailable TVs or features. Never attach private configured packages, credentials or personal background images. The maintained results are in [Validation and compatibility](VALIDATION.md).
