# BedrockPlus 0.1.0 Beta 4

Release date: 2026-10-17

BedrockPlus 0.1.0 Beta 4 is a Windows x64 public beta for server owners and
Python/C++ plugin authors. It keeps plugin API/ABI v1 and pins the native runtime
to Bedrock Dedicated Server 1.26.51.1.

## Highlights since Beta 3

- Added the native item registry captured from the real BDS
  `ItemRegistryPacket`, including signed runtime IDs, component flags, item
  versions, custom namespaces, immutable generations, and lookup in both
  directions.
- Added a native scoreboard API for objectives, criteria, identities, scores,
  display slots, sorting, fake players, players, and entities. Mutations execute
  on the BDS tick thread and do not compose vanilla scoreboard commands.
- Added automatic world registration for valid development behavior/resource
  pack folders, `.zip`, and `.mcpack` archives. Registrations update when the
  manifest version changes; items ending in `Disabled` are excluded; manual
  registrations are preserved.
- Removed the obsolete world-pack conflict ownership rule. Server owners may
  edit their normal world pack registrations and manifest versions.
- Simplified `.bppack` to plugin code and declared dependencies only. Vanilla
  behavior/resource packs are managed independently.
- Added structured operator errors with a plain-language summary, cause,
  corrective action, retry guidance, server-start status, and file-change
  status.
- Updated the full Python example to 1.15.0 and the full C++ example to 1.12.0.
- Reworked the multilingual documentation into a Microsoft Learn-style layout
  using BedrockPVP colors, with left navigation, article navigation, search,
  global Python/C++ switching, and linked API members.

## Supported environment

- Windows x64
- Python 3.13
- Bedrock Dedicated Server 1.26.51.1
- BedrockPlus plugin API/ABI version 1

BedrockPlus does not redistribute BDS. The initializer downloads the supported
official archive after confirmation and reuses a verified matching archive in
the server's `Downloads` directory.

## Install or upgrade

```console
pip install --upgrade --pre bedrockplus==0.1.0b4
```

## Known beta boundaries

- Linux is not supported.
- Entity mutation, live Level/BlockSource access, chunks, inventory/equipment,
  NBT, forms, boss bars, and raw packets are not complete public APIs.
- Player helpers documented as command-backed remain explicit command APIs.
- IP address and ping are available only when the pinned BDS build and selected
  transport expose reliable values; BedrockPlus does not invent them.
- Python plugins share one embedded interpreter. Vendored dependency paths are
  separate, but this is not process-level security isolation.

Back up worlds and configuration before beta testing. Remove IP addresses,
device IDs, XUIDs, tokens, and other personal data before sharing logs.

## Legal

BedrockPlus is distributed under the included proprietary `LICENSE.txt`.
Minecraft and Bedrock Dedicated Server are products of Microsoft/Mojang.
BedrockPlus is an independent project and is not affiliated with or endorsed
by Microsoft or Mojang.
