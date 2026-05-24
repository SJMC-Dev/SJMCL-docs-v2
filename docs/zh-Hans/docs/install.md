# 下载与安装

您可以直接从 [本站](/downloads/) 下载 SJMCL 的最新版本，该页面会自动优先展示适用于当前设备的文件；也可以前往 [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) 查看所有历史版本（包含 Nightly 版本）。

## 支持的平台

| 平台 | 系统要求 | 支持架构 | 提供的安装包 / 分发格式 |
| --- | --- | --- | --- |
| Windows | Windows 7 及以上 | `aarch64`、`i686`、`x86_64` | 安装器 `.exe`、便携版 `.exe` |
| macOS | macOS 10.15 及以上 | `aarch64`、`x86_64` | `.app`、`.dmg` |
| Linux | `webkit2gtk 4.1`（例如 Ubuntu 22.04） | `aarch64`、`x86_64` | `.deb`、`.rpm`、便携二进制 |

> [!TIP]
> 部分功能可能受运行平台或安装包类型限制。
> 
> 在 Windows 推荐下载便携版，macOS 推荐下载 DMG 版本，可以享受完整功能，并贴合 Minecraft 启动器常见的使用体验。

### 特别提示（适用 Windows 7）

如果您需要在 Windows 7 运行 SJMCL，请先 [下载 Microsoft Edge WebView2 运行时](https://developer.microsoft.com/zh-cn/microsoft-edge/webview2#download) 并安装之，推荐选择“常青引导程序”。


## 从命令行安装

<InstallCommandTabs />

### Winget

SJMCL 提供 Windows Package Manager 包，包 ID 为 `SJMC.SJMCL`。

该方式适用于 Windows 10/11：

```powershell
winget install SJMC.SJMCL
```

> [!WARNING]
> Winget 的索引仓库是公开协作维护的。安装前建议运行 `winget show SJMC.SJMCL` 查看安装器地址，并确认下载来源来自 `github.com/UNIkeEN/SJMCL` 或 `sjmcl.club`。

如果您需要在 Windows 7 上运行 SJMCL，请仍然参考页面上方的 WebView2 特别提示。

### Homebrew

SJMCL 提供 macOS Homebrew Cask，Cask 名为 `sjmcl`。

使用以下命令安装：

```bash
brew install --cask SJMC-Dev/SJMCL/sjmcl
```

之后可以使用以下命令更新：

```bash
brew upgrade --cask SJMC-Dev/SJMCL/sjmcl
```

### Linux 安装脚本

安装脚本当前仅支持 Linux，会自动识别 `x86_64` 与 `aarch64` 架构，并默认安装最新正式版本。

页面上方的命令默认指定 SJMC 源下载，适合中国大陆网络环境：

```bash
curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --source sjmc
```

如果不指定 `--source` 参数，脚本会使用自动选择安装源。

如果不希望通过系统包管理器安装，也可以安装用户级便携版：

```bash
curl -LsSf https://mc.sjtu.cn/sjmcl/releases/install.sh | sh -s -- --portable
```

便携版会安装到 `~/.sjmcl/SJMCL`，并创建 `~/.local/bin/sjmcl` 作为命令入口。该方式不需要 root 权限。

### DEB 包

如果您使用 Debian、Ubuntu、Linux Mint 等 Debian 系发行版，也可以从 [下载页](/downloads/) 或 [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) 下载对应架构的 `.deb` 文件后手动安装。

```bash
sudo apt install ./SJMCL_<version>_linux_<arch>.deb
```

如果使用较旧的系统，也可以使用 `dpkg` 安装后再修复依赖：

```bash
sudo dpkg -i ./SJMCL_<version>_linux_<arch>.deb
sudo apt install -f
```

### RPM 包

如果您使用 Fedora、RHEL、CentOS Stream、openSUSE 等 RPM 系发行版，可以从 [下载页](/downloads/) 或 [GitHub Releases](https://github.com/UNIkeEN/SJMCL/releases) 下载对应架构的 `.rpm` 文件后手动安装。

Fedora、RHEL、CentOS Stream 等发行版可使用：

```bash
sudo dnf install ./SJMCL_<version>_linux_<arch>.rpm
```

openSUSE 可使用：

```bash
sudo zypper install ./SJMCL_<version>_linux_<arch>.rpm
```

### Arch User Repository (AUR)

SJMCL 已发布到 Arch User Repository (AUR)，包名：`sjmcl-bin`。

该方式适用于 Arch Linux 及其衍生发行版。

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

### Snap

SJMCL 已发布到 Snap Store，包名：`sjmcl`。

该方式适合已经启用 Snap Store 的 Linux 发行版：

```bash
sudo snap install sjmcl
```

> [!NOTE]
> 由于 Snap 的沙盒机制，SJMCL 的部分功能可能无法正常工作。如果遇到异常，欢迎在 [GitHub Issues](https://github.com/UNIkeEN/SJMCL/issues) 反馈，并尽量附上日志、截图和复现步骤等信息。

> [!WARNING]
> 使用 Snap 安装时，游戏数据可能会默认存放在沙盒目录内。卸载启动器前，请及时备份存档、资源包、模组等重要数据。

## 常见问题

TBD

## 故障排查

### Linux: Gdk-Message: Error 71 (Protocol error) dispatching to Wayland display.

这是一个 [上游问题](https://github.com/tauri-apps/tauri/issues/9394)，通常发生在使用 Wayland 与 Nvidia 独立显卡时。

请添加环境变量 `__NV_DISABLE_EXPLICIT_SYNC=1` 或 `WEBKIT_DISABLE_DMABUF_RENDERER=1`。
