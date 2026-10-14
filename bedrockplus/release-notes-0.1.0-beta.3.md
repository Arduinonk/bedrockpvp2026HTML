# BedrockPlus 0.1.0 Beta 3

Release date: 2026-10-14

BedrockPlus 0.1.0 Beta 3 is a public beta for server owners and plugin authors.
It packages the Windows launcher/runtime, the typed Python SDK, the public C++
headers, and the `.bppack` workflow as one versioned release.

## Supported environment

- Windows x64
- Python 3.13 for the `bedrockplus` command and Python plugins
- Bedrock Dedicated Server 1.26.51.1
- BedrockPlus plugin API/ABI version 1

BedrockPlus does not redistribute BDS. On first use, the launcher downloads the
supported official archive after confirmation. A matching verified archive in
the server's `Downloads` directory is reused instead of downloaded again.

## Changes since Beta 2

- Added the Native Object Core with generation-checked handles and server-thread
  execution boundaries.
- Added a verified read-only Entity API backed by the live BDS Level actor
  registry: runtime and unique IDs, type identity, dimension, position,
  velocity, rotation, player classification, refresh, and validity checks.
- Added authenticated online-player lookup through `Server.online_players`,
  `online_player_count`, and `get_player(identity)`.
- Expanded the live event surface to eighteen documented event types, including
  login, respawn, death, interaction, movement, chat, block, list-ping, jump,
  kick, and input-state events where supported by the pinned BDS profile.
- Added typed scheduler helpers equivalent to next-tick, timeout, interval,
  iterator job, and task cancellation operations.
- Added and updated full Python 1.13.0 and C++ 1.10.0 reference plugins.
- Simplified `.bppack`: a plugin package contains plugin code and declared
  dependencies only. Vanilla behavior and resource packs remain normal
  server/world content managed separately by the server owner.
- Updated the English, Turkish, Russian, and Turkmen website documentation with
  a clickable API symbol index, anchored members, small examples, and explicit
  descriptions of native versus command-backed behavior.

## Install or upgrade

```console
pip install --upgrade --pre bedrockplus==0.1.0b3
```

Run `bedrockplus` in a new empty server directory. Run `bedrockplus help` for
server and plugin commands.

## Known beta boundaries

- Linux is not supported in this release.
- Entity mutation, a public native Level/BlockSource API, chunks, live
  inventory/equipment, NBT, scoreboard, forms, boss bars, and raw packets are
  not complete public APIs yet.
- Player convenience actions documented as command-backed are not presented as
  native object operations.
- IP address and ping are available only when the pinned BDS build and selected
  transport expose reliable native values. BedrockPlus does not invent them.
- Python plugins share one embedded interpreter. Vendored dependency folders
  are separate, but this is not process-level security isolation.

Back up worlds and configuration before beta testing. Remove IP addresses,
device IDs, XUIDs, tokens, and other personal data before sharing logs.

## Legal

BedrockPlus is distributed under the included proprietary `LICENSE.txt`.
Minecraft and Bedrock Dedicated Server are products of Microsoft/Mojang.
BedrockPlus is an independent project and is not affiliated with or endorsed
by Microsoft or Mojang.
