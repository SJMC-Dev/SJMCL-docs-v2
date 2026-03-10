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

## `launch`

启动指定实例，并直接进入启动流程。SJMCL 本身也使用这一端点生成启动实例的桌面快捷方式。

### 格式

```sh
sjmcl://launch?id=<instance_id>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 实例 ID |

### 参数说明

- 当前版本中，实例 ID 由启动器内部组合为 `<game_directory_name>:<instance_name>`
- 常见示例：`OFFICIAL_DIR:1.20.1`
- 如果实例名称中包含空格或其他特殊字符，建议整体进行 URL 编码

### 示例

```sh
sjmcl://launch?id=OFFICIAL_DIR%3A1.20.1
sjmcl://launch?id=CURRENT_DIR%3AFabric%201.20.1
```
