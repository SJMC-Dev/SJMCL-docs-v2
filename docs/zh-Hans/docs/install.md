# 下载与安装

您可以直接从 [本站](/downloads/) 下载 SJMCL 的最新版本，该页面会自动优先展示适用于当前设备的文件；也可以前往 [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) 查看所有历史版本（包含 Nightly 版本）。

## 支持的平台

| 平台 | 系统要求（基于 README） | 支持架构 | 提供的安装包 / 分发格式 |
| --- | --- | --- | --- |
| Windows | Windows 7 及以上 | `aarch64`、`i686`、`x86_64` | 安装器 `.exe`、便携版 `.exe` |
| macOS | macOS 10.15 及以上 | `aarch64`、`x86_64` | `.app`、`.dmg` |
| Linux | `webkit2gtk 4.1`（例如 Ubuntu 22.04） | `aarch64`、`x86_64` | `.AppImage`、`.deb`、`.rpm`、便携二进制 |

> [!TIP]
> 部分功能可能受运行平台或安装包类型限制。
> 
> 在 Windows 推荐下载便携版，macOS 推荐下载 DMG 版本，可以享受完整功能，并贴合 Minecraft 启动器常见的使用体验。

### 特别提示（适用 Windows 7）

如果您需要在 Windows 7 运行 SJMCL，请先 [下载 Microsoft Edge WebView2 运行时](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2#download) 并安装之，推荐选择“常青引导程序”。


## 从命令行安装

### Arch User Repository (AUR)

SJMCL 已发布到 Arch User Repository (AUR)，包名：`sjmcl-bin`。

使用常见 AUR Helper（如 `yay`）安装：

```bash
yay -S sjmcl-bin
```

不使用 AUR Helper 的手动安装方式：

```bash
git clone https://aur.archlinux.org/sjmcl-bin.git
cd sjmcl-bin
makepkg -si
```

## 常见问题

TBD
