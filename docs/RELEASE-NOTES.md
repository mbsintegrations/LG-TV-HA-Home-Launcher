# LG TV – HA Home Launcher v0.4.0

Check your TV's connection without leaving Home. This update adds an embedded Cloudflare Speed Test and optional router/internet latency readings.

![Embedded Speed Test — sample readings](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/releases/download/v0.4.0/LG-TV-HA-Home-Launcher-speed-test.jpg)

## New

- **Speed Test tile:** download, upload, HTTP latency and jitter inside the launcher, using its selected palette. Start manually, cancel with the button or Back, and keep the last completed result with its timestamp.
- **Optional TCP latency footer:** router and internet readings measured from the TV. Choose Cloudflare 1.1.1.1 or Google 8.8.8.8, with 15/30/60-second checks. Router detection is automatic; an address and TCP port can be selected if needed.
- **Network step in the configurator:** both features are opt-in. Speed Test uses one of eight app slots. No HA add-on, API key, always-on computer or root required.
- **Older-TV compatibility:** bundled ES5 engine, abortable requests, and handling for missing Chromium 53 resource-timing fields.

## How it behaves

TCP connection timing is clearly labelled; it is not ICMP ping. ICMP remains available only on models that permit it. Polling stops when Home is hidden and pauses during a speed test. A blocked port shows no reading rather than a false offline claim.

The short speed test transfers about 24.2 MB of planned payload, plus retries and overhead. It can underestimate very fast connections and briefly affect streaming. Cloudflare receives the public IP and test measurements, never HA credentials. The engine is bundled locally, with no runtime CDN script.

## Updating

Import your saved profile, enable the desired options under Network, export it, then rebuild and reinstall your private package. Existing settings remain unchanged until you enable the new features. Follow the helper-aware update instructions if you use the optional Home-button helper. Public sample packages contain no HA credentials.

See [network setup and troubleshooting](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/main/docs/NETWORK.md), [updates](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/main/docs/UPDATES-AND-RECOVERY.md) and [compatibility](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher/blob/main/docs/VALIDATION.md).
