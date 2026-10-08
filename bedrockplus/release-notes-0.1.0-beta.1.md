# BedrockPlus 0.1.0 Beta 1

Release date: 2026-10-08

BedrockPlus 0.1.0 Beta 1 is the first publication candidate intended for wider
server-owner and plugin-author testing. It combines the BedrockPlus launcher,
the Windows runtime, the typed Python SDK, the native C++ SDK, and the `.bppack`
plugin workflow in one verified release.

## Supported environment

- Windows x64
- Python 3.13 for the `bedrockplus` command and Python plugins
- Bedrock Dedicated Server 1.26.51.1
- BedrockPlus plugin API/ABI version 1

The official BDS archive is not redistributed by BedrockPlus. On first use,
the launcher downloads the supported archive from the official source after
the operator confirms installation. A valid archive already present in the
server's `Downloads` cache is reused.

## Highlights

- Global `bedrockplus` command for server initialization and startup.
- Typed custom slash commands with client autocomplete.
- Cancellable player and server command events.
- Python and native C++ `.bppack` plugins.
- Six-stage plugin lifecycle and safe task scheduling.
- Thirteen public event types using class properties and methods.
- `Server`, `Player`, `World`, `Level`, `Dimension`, `Block`, `Location`,
  `Vector`, and `ItemStack` public objects.
- Player messaging, command execution, teleportation, game mode, experience,
  tags, effects, damage, sound, animation, and entity-event actions.
- Player authentication snapshots with XUID, device, input, locale, and other
  connection fields when the selected BDS transport exposes them.
- Dynamic RakNet MOTD and displayed player-count support.
- Configurable compact console/file logging with Minecraft colour formatting.
- Isolated dependency vendoring and deterministic `.bppack` creation through
  `bedrockplus plugin pack`.
- English, Russian, Turkish, and Turkmen documentation catalogs.

## Install or upgrade

New installation:

```console
pip install bedrockplus
```

Upgrade an existing development build to this beta explicitly:

```console
pip install --upgrade --pre bedrockplus==0.1.0b1
```

Run `bedrockplus` inside a new empty server directory. Run
`bedrockplus help` to see server and plugin commands.

## Known Beta limitations

- Linux is not supported in this release.
- Inventory/equipment, live entities and chunks, NBT, scoreboard, forms, boss
  bars, and raw packet APIs are not yet public APIs.
- IP address and ping are available only when the exact BDS build and selected
  transport expose a reliable native value; BedrockPlus does not invent one.
- This is a beta release. Back up worlds and configuration before testing and
  report problems with logs after removing personal identifiers.

## Legal

BedrockPlus is distributed under the included proprietary `LICENSE.txt`.
Minecraft and Bedrock Dedicated Server are products of Microsoft/Mojang.
BedrockPlus is an independent project and is not affiliated with or endorsed
by Microsoft or Mojang.
