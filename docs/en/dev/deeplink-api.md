# Deeplink API

Deeplinks can be used to automatically launch or bring SJMCL to the foreground and perform certain actions. They are suitable for external integrations such as web pages, toolchains, and desktop shortcuts.

The protocol scheme is always `sjmcl://`.

> [!NOTE]
> On Windows and Linux portable builds, this feature is available only after the launcher has been run at least once. On macOS, it is available only in the DMG build.

## `add-auth-server`

Opens the Add Authentication Server dialog and automatically fills in the target third-party authentication server address.

> [!NOTE]
> This interface does not directly save a new third-party authentication server. The user still needs to confirm the action in the launcher.

### Format

```sh
sjmcl://add-auth-server?url=<server_url>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | `string` | Yes | Authentication server URL. Passing the root URL of an authlib-injector / Yggdrasil service is recommended |

### Examples

```sh
sjmcl://add-auth-server?url=https%3A%2F%2Flittleskin.cn%2Fapi%2Fyggdrasil
sjmcl://add-auth-server?url=https%3A%2F%2Fexample.com%2Fapi%2Fyggdrasil
```

## `launch`

Launches an instance and directly enters the launch flow. SJMCL itself also uses this endpoint to generate desktop shortcuts for launching instances.

### Format

```sh
sjmcl://launch?[id=<instance_id>][&playerId=<player_id>][&quickPlaySingleplayer=<world_name>][&quickPlayMultiplayer=<server_addr>]
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | Instance ID. If omitted, the launcher uses the currently selected instance |
| `playerId` | `string` | No | Player ID. If omitted, the launcher uses the currently selected player |
| `quickPlaySingleplayer` | `string` | No | Automatically enter the specified singleplayer world |
| `quickPlayMultiplayer` | `string` | No | Automatically join the specified multiplayer server address |

### Parameter Notes

- **When `id` and `playerId` are set to `tbd`, a selection dialog appears during the launch flow so the user can choose the instance or player manually**
- In some specific cases, if no instance or player is currently selected, the selection dialog may also appear even without passing `tbd`
- Query parameter order does not matter. It is recommended to URL-encode each parameter value individually, especially when it contains spaces, colons, or other special characters

### Examples

```sh
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1
sjmcl://launch?id=CURRENT_DIR%3AFabric%201.20.1&playerId=e9755ca2-6ebf-4ea7-a548-cf1074ab7f0f
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1&quickPlaySingleplayer=My%20World
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1&quickPlayMultiplayer=mc.example.com%3A25565
sjmcl://launch?id=tbd&playerId=tbd
```
