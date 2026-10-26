# Privacy, an ad-free home screen and your media/IoT network

Updated 26 October 2026 · applies to launcher v0.4.0.

**Our launcher displays no advertising, sponsored recommendations or the promotional tiles you would normally see on LG Home.** It gives you your own apps, inputs and Home Assistant dashboard instead. Opening the original LG Home screen or a streaming app takes you into that application's interface, where its own advertising may still appear.

LG TV – HA Home Launcher is an independent MBS Integrations project, not an LG product. It does not implement LG's advertising, content-recognition or device-discovery systems. Installing it changes your home-screen experience; it does **not** disable those underlying webOS services or change your LG privacy agreements.

## The recent LG discussion

The discussion includes [this video about LG smart-TV privacy](https://www.youtube.com/watch?v=6IFVTcM28KA) and [LG's published response](https://www.lg.com/global/newsroom/news/statements/statement-understanding-privacy-on-lg-smart-tvs/). The video is linked as context; this guide does not reproduce or independently verify its allegations.

LG says that device discovery supports connecting compatible devices and that information from that function is not used for household profiling or advertising segmentation. Separately, LG says nearby Wi-Fi access-point and signal-strength information may help estimate location for ACR where available, enabled and covered by accepted agreements. LG describes ACR, voice recognition and interest-based advertising as optional, and says wake-word detection is local, with speech recognition activated by a recognised wake word or deliberate microphone-button use. These are **LG's statements**, not findings from a firmware or traffic audit by this project. [Read LG's explanation and privacy controls](https://www.lg.com/global/newsroom/news/statements/statement-understanding-privacy-on-lg-smart-tvs/).

Review your own TV's agreements, viewing-information/ACR, personalised advertising and voice settings. Names and availability vary by model, firmware and region. Our launcher does not change them, suppress system-level prompts, or block traffic from LG or other installed apps.

## What this project connects to

The shipped source has no MBS analytics endpoint, advertising SDK, microphone recording or screen-capture feature, and no subnet or nearby Wi-Fi scanning feature.

| Component | Behaviour |
| --- | --- |
| Local configurator | Connects to the Home Assistant address you enter and reads its entity list. “Entity discovery” means an authenticated HA API request, not a scan of your network. The browser preview uses sample data. |
| TV launcher | Connects directly to your configured HA WebSocket endpoint for status and selected controls. Weather comes from your selected HA weather entity. Artwork and app logos are bundled locally. |
| Optional network tools | A manually started test contacts Cloudflare. Footer latency checks contact only the selected router and internet endpoint. Both are disabled by default. See [network settings](NETWORK.md). |
| Optional Home-button helper | Handles remote-button input and subscribes to the configured TV entity in HA to recognise selected app exits. It does not record conversations or video. |
| App/input tiles | Launch the selected TV app or input. Those apps, connected devices and webOS continue to operate under their own settings and privacy policies. |

The launcher currently receives HA's state snapshot and state-change events, then filters them locally to the configured entities. A short list of visible controls is **not** a permission boundary. Use a dedicated non-admin HA account, protect the token-bearing IPK and revoke its token when no longer needed. The token is readable by someone with access to the package; network isolation does not remove its HA permissions. See [Security and private files](SECURITY.md).

Source references: [HA connection](../app/ha.js), [local configurator](../wizard/server.cjs), [helper HA watcher](../helper/app/ha-watch.js).

## Is network discovery unusual on TVs and streaming devices?

No. Finding compatible devices is common for casting, remote control and media sharing. These documented examples show that this is not unique to LG:

| Platform | Documented discovery behaviour |
| --- | --- |
| Amazon Fire TV | Amazon lists DIAL support in its [Fire TV developer FAQ](https://developer.amazon.com/docs/fire-tv/faq-general.html). [DIAL](https://www.dial-multiscreen.org/) lets a phone discover a TV/receiver and launch a compatible app on the same home network. |
| Google Cast / Chromecast | Google's [discovery guide](https://developers.google.com/cast/docs/discovery) describes finding receivers and their advertised `_googlecast._tcp.local` service. The [Cast protocol documentation](https://chromium.googlesource.com/openscreen/+/HEAD/cast/docs/protocol_flow.md) describes mDNS queries and receiver responses. |
| Apple TV / AirPlay | Apple's [deployment guide](https://support.apple.com/en-gb/guide/deployment/dep9151c4ace/web) documents Bonjour, Bluetooth advertisements and peer-to-peer discovery. Some AirPlay connections can work without sharing the same LAN. |
| Roku players / Roku TVs | Roku's [External Control Protocol documentation](https://developer.roku.com/dev/docs/external-control-api) describes SSDP service advertisements and responses to discovery queries for local remote control. |
| Samsung TVs / Smart View | Samsung's [Smart View documentation](https://developer.samsung.com/smarttv/design/smart-view-sdk.html) describes discovering compatible TVs on the same network and, on supported devices, through Bluetooth Low Energy. Support depends on the model and SDK. |

These examples include discovery initiated by phones or other senders, and TVs advertising or responding. They do **not** establish that every TV scans every host or port.

Service discovery, broad port scanning, nearby Wi-Fi scanning, viewing recognition and uploading information to a vendor are different activities. Seeing discovery packets alone does not establish surveillance; equally, finding a legitimate discovery feature does not settle concerns about other collection or advertising. The destination, data, purpose, retention and consent matter.

## Recommended network setup

**Keep TVs, streaming boxes and other IoT devices on a secured, separate network with enforced access rules.** This applies across brands. CISA also recommends a separate dedicated network for connected devices in its [IoT security guidance](https://www.cisa.gov/sites/default/files/publications/Internet-of-Things-Tip-Sheet-122019-508.pdf).

1. **Separate devices from trusted computers and storage.** Use a media/IoT VLAN, or an isolated guest network if your router supports the exceptions you need. A different Wi-Fi name or VLAN number alone is not enough: firewall rules must restrict traffic between networks, for IPv4 and IPv6. Devices in the same VLAN may still reach each other; use additional segmentation or client isolation where appropriate.
2. **Allow specific connections instead of access to your whole LAN.** The launcher and optional helper need the TV to reach your configured HA endpoint. Keep HA in a trusted/server network and permit that destination and service only. Use HTTPS/WSS with valid certificates. Retain the specific HA-to-TV connection required by your existing webOS integration and startup automation. Allow developer access only from your maintenance computer when needed.
3. **Keep required infrastructure and media paths deliberate.** Permit the DNS/time services, streaming access, update services and any local media server you actually use. Do not expose the TV's developer services or local configurator to the internet. A guest network that blocks all local access will also block the launcher from a local HA server unless an exception is possible.
4. **Treat casting discovery as a separate requirement.** Crossing subnets can break casting and remote discovery. If needed, configure narrowly scoped mDNS/Bonjour forwarding and the corresponding device-to-device firewall rules. Avoid forwarding all discovery traffic or opening unrestricted access between networks just to make a device appear. Apple's [AirPlay network guide](https://support.apple.com/en-gb/guide/deployment/dep9151c4ace/web) explains the multicast and peer-to-peer cases; also review the receiver's nearby-device/access settings.
5. **Review privacy settings and keep devices updated.** Disable optional viewing/advertising/voice features you do not want. Segmentation limits access to other local devices; it does not automatically prevent cloud telemetry over an allowed internet connection, stop nearby radio discovery, or constrain a token's access through an allowed HA connection. Outbound filtering is a separate decision and can affect apps, updates and Developer Mode renewal.

Apply and check rules for your own router and integrations before removing existing access. No network changes are made by installing this launcher. For setup and token handling, continue with [Home Assistant configuration](HOME-ASSISTANT.md) and [Security](SECURITY.md).

## Optional network measurements

Version 0.4.0 adds an optional manually started Cloudflare speed test. It contacts Cloudflare and shares the public IP and test measurements with that provider; it does not send HA credentials or entity data. Optional footer checks contact only the selected router and internet endpoint while Home is visible. TCP opens a connection without a login or application request. Both features are disabled by default. [Data use, ports and timing](NETWORK.md).
