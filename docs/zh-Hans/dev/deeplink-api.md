# Deeplink API

Deeplink 可用于自动运行或唤起 SJMCL 并执行一些操作，适合网页、工具链、桌面快捷方式等外部集成场景。

协议名固定为 `sjmcl://`

> [!NOTE]
> Windows 和 Linux 便携版需要至少运行一次方可使用；macOS 仅 DMG 版本可以使用该功能。

## `add-auth-server`

打开“添加认证服务器”对话框，并自动填入待添加的第三方认证服务器地址。

> [!NOTE]
> 该接口不会直接保存新的第三方认证服务器，仍需用户在启动器内确认后完成添加

### 格式

```sh
sjmcl://add-auth-server?url=<server_url>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `url` | `string` | 是 | 认证服务器地址，建议传入 authlib-injector / Yggdrasil 服务根地址 |

### 示例

```sh
sjmcl://add-auth-server?url=https%3A%2F%2Flittleskin.cn%2Fapi%2Fyggdrasil
sjmcl://add-auth-server?url=https%3A%2F%2Fexample.com%2Fapi%2Fyggdrasil
```

### 在 Blessing-Skin 仪表盘添加“添加到 SJMCL”按钮

需要安装 `Yggdrasil Connect` 或 `Yggdrasil API` 插件。  
在“管理面板”的“个性化”页面中添加以下 JavaScript 脚本。

```javascript
var yggBtn = document.getElementById('ygg-dnd-button');
var button = document.createElement('button');
button.className = 'btn btn-info ml-2';
button.textContent = '添加到 SJMCL';
button.setAttribute(
  'onclick',
  'location.href="sjmcl://add-auth-server?url=' +
  encodeURIComponent(yggBtn.getAttribute('data-clipboard-text')) +
  '"'
);
yggBtn.parentNode.insertBefore(button, yggBtn.nextSibling);
```

## `launch`

启动实例，并直接进入启动流程。SJMCL 本身也使用这一端点生成启动实例的桌面快捷方式。

### 格式

```sh
sjmcl://launch?[id=<instance_id>][&playerId=<player_id>][&quickPlaySingleplayer=<world_name>][&quickPlayMultiplayer=<server_addr>]
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 否 | 实例 ID；省略时使用当前已选中的实例 |
| `playerId` | `string` | 否 | 玩家 ID；省略时使用当前已选中的玩家 |
| `quickPlaySingleplayer` | `string` | 否 | 直接进入指定单人存档 |
| `quickPlayMultiplayer` | `string` | 否 | 直接加入指定多人服务器地址 |

### 参数说明

- **`id` 和 `playerId` 传入 `tbd` 时，会在启动流程中弹出选择对话框，让用户手动选择实例或玩家**
- 部分特定情况下无选中实例或玩家，此时无需传入 `tbd` 也会弹出选择对话框
- 查询参数顺序不敏感，建议对每个参数值单独进行 URL 编码，尤其是包含空格、冒号或其他特殊字符时

### 示例

```sh
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1
sjmcl://launch?id=CURRENT_DIR%3AFabric%201.20.1&playerId=e9755ca2-6ebf-4ea7-a548-cf1074ab7f0f
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1&quickPlaySingleplayer=My%20World
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1&quickPlayMultiplayer=mc.example.com%3A25565
sjmcl://launch?id=tbd&playerId=tbd
```
