# 🦞 Moltbot 中文版 — 个人 AI 助手

**EXFOLIATE! EXFOLIATE! （蜕壳！蜕壳！）**

[![CI 状态](https://img.shields.io/github/actions/workflow/status/moltbot/moltbot/ci.yml?branch=main&style=for-the-badge)](https://github.com/moltbot/moltbot/actions/workflows/ci.yml?branch=main) [![GitHub 发布版本](https://img.shields.io/github/v/release/moltbot/moltbot?include_prereleases&style=for-the-badge)](https://github.com/moltbot/moltbot/releases) [![MIT 许可证](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://github.com/moltbot/moltbot/blob/main/LICENSE)

**Moltbot** 是一个在您自己的设备上运行的_个人 AI 助手_。它可以在您已经使用的频道上回答您的问题（WhatsApp、Telegram、Slack、Discord、Google Chat、Signal、iMessage、Microsoft Teams、WebChat），以及扩展频道如 BlueBubbles、Matrix、Zalo 和 Zalo Personal。它可以在 macOS/iOS/Android 上进行语音对话，并可以渲染您控制的实时画布。网关只是控制平面 —— 产品本身是助手。

如果您想要一个个人化的、单用户的助手，感觉本地化、快速且始终在线，这就是它。

[官方网站](https://molt.bot) · [文档](https://docs.molt.bot) · [入门指南](https://docs.molt.bot/start/getting-started) · [更新指南](https://docs.molt.bot/install/updating) · [展示](https://docs.molt.bot/start/showcase) · [常见问题](https://docs.molt.bot/start/faq) · [向导](https://docs.molt.bot/start/wizard) · [Nix](https://github.com/moltbot/nix-clawdbot) · [Docker](https://docs.molt.bot/install/docker) · [Discord](https://discord.gg/clawd)

## 📋 目录

- [安装](#安装推荐)
- [快速开始](#快速开始)
- [模型配置](#模型选择--认证)
- [功能特性](#功能特性)
- [支持的频道](#频道)
- [开发](#从源代码安装开发)
- [安全默认设置](#安全默认设置dm-访问)
- [贡献](#贡献)
- [许可证](#许可证)

## 🚀 安装（推荐）

推荐设置：运行入门向导（`moltbot onboard`）。它会引导您完成网关、工作区、频道和技能的配置。CLI 向导是推荐路径，适用于 **macOS、Linux 和 Windows（通过 WSL2；强烈推荐）**。支持 npm、pnpm 或 bun。首次安装？从这里开始：[入门指南](https://docs.molt.bot/start/getting-started)

**运行时要求：Node ≥22**

```bash
npm install -g moltbot@latest
# 或者: pnpm add -g moltbot@latest

moltbot onboard --install-daemon
```

向导会安装网关守护进程（launchd/systemd 用户服务），使其保持运行。旧版注意：`clawdbot` 仍作为兼容性垫片可用。

## ⚡ 快速开始

**运行时要求：Node ≥22**

完整的初学者指南（认证、配对、频道）：[入门指南](https://docs.molt.bot/start/getting-started)

```bash
# 运行入门向导
moltbot onboard --install-daemon

# 启动网关
moltbot gateway --port 18789 --verbose

# 发送消息
moltbot message send --to +1234567890 --message "来自 Moltbot 的问候"

# 与助手对话（可选择传送回任何已连接的频道）
moltbot agent --message "发送检查清单" --thinking high
```

需要升级？[更新指南](https://docs.molt.bot/install/updating)（并运行 `moltbot doctor`）。

## 🤖 模型（选择 + 认证）

**订阅支持（OAuth）：**

- **[Anthropic](https://www.anthropic.com/)** (Claude Pro/Max)
- **[OpenAI](https://openai.com/)** (ChatGPT/Codex)

模型说明：虽然支持任何模型，但我强烈推荐 **Anthropic Pro/Max (100/200) + Opus 4.5** 以获得长上下文强度和更好的提示注入抵抗力。参见[入门配置](https://docs.molt.bot/start/onboarding)。

- 模型配置 + CLI：[模型](https://docs.molt.bot/concepts/models)
- 认证配置文件轮换（OAuth vs API 密钥）+ 回退：[模型故障转移](https://docs.molt.bot/concepts/model-failover)

## ✨ 功能特性

### 核心平台

- [网关 WebSocket 控制平面](https://docs.molt.bot/gateway)，带有会话、在线状态、配置、定时任务、Webhook、[控制 UI](https://docs.molt.bot/web) 和[画布主机](https://docs.molt.bot/platforms/mac/canvas#canvas-a2ui)
- [CLI 界面](https://docs.molt.bot/tools/agent-send)：网关、代理、发送、[向导](https://docs.molt.bot/start/wizard) 和 [doctor](https://docs.molt.bot/gateway/doctor)
- RPC 模式下的 [Pi 代理运行时](https://docs.molt.bot/concepts/agent)，支持工具流和块流
- [会话模型](https://docs.molt.bot/concepts/session)：直接聊天的 `main`、群组隔离、激活模式、队列模式、回复。群组规则：[群组](https://docs.molt.bot/concepts/groups)
- [媒体管道](https://docs.molt.bot/nodes/images)：图像/音频/视频、转录钩子、大小限制、临时文件生命周期。音频详情：[音频](https://docs.molt.bot/nodes/audio)

### 频道

- [频道](https://docs.molt.bot/channels)：[WhatsApp](https://docs.molt.bot/channels/whatsapp) (Baileys)、[Telegram](https://docs.molt.bot/channels/telegram) (grammY)、[Slack](https://docs.molt.bot/channels/slack) (Bolt)、[Discord](https://docs.molt.bot/channels/discord) (discord.js)、[Google Chat](https://docs.molt.bot/channels/googlechat) (googleapis)、[Signal](https://docs.molt.bot/channels/signal) (libsignal)、[iMessage](https://docs.molt.bot/channels/imessage) (AppleScript)、[BlueBubbles](https://docs.molt.bot/channels/bluebubbles)、[Microsoft Teams](https://docs.molt.bot/channels/teams) (Bot Framework)、[Matrix](https://docs.molt.bot/channels/matrix) (matrix-js-sdk)、[Zalo](https://docs.molt.bot/channels/zalo)、[Zalo Personal](https://docs.molt.bot/channels/zalo-personal)、[WebChat](https://docs.molt.bot/channels/webchat)
- [macOS/iOS/Android 节点](https://docs.molt.bot/nodes)：语音唤醒、对话模式、通知、剪贴板、位置、屏幕截图
- [WebRTC 音频](https://docs.molt.bot/nodes/talk)：实时双向语音与 macOS/iOS/Android 节点对话

### 工具和扩展

- [浏览器工具](https://docs.molt.bot/tools/browser)：Playwright 自动化，支持快照、点击、输入、导航
- [画布工具](https://docs.molt.bot/platforms/mac/canvas)：macOS 的代理驱动视觉工作区
- [定时任务工具](https://docs.molt.bot/tools/cron)：基于 cron 的调度，支持一次性或重复任务
- [会话工具](https://docs.molt.bot/tools/sessions)：跨频道查询和管理会话
- [频道操作](https://docs.molt.bot/tools/actions)：Discord/Slack 特定操作（角色、频道管理等）
- [技能系统](https://docs.molt.bot/tools/skills)：捆绑/管理/工作区技能，支持自定义工具集成

### 平台应用

- [macOS 菜单栏应用](https://docs.molt.bot/platforms/macos)：系统托盘集成，快速访问
- [iOS/Android 节点](https://docs.molt.bot/nodes)：移动伴侣应用，支持语音、通知等
- [网页控制 UI](https://docs.molt.bot/web)：基于浏览器的网关管理界面

## 📱 频道

Moltbot 连接到您已经使用的消息平台：

- **即时通讯**：WhatsApp、Telegram、Signal
- **团队协作**：Slack、Discord、Microsoft Teams、Google Chat
- **其他平台**：iMessage、BlueBubbles、Matrix、Zalo、WebChat
- **语音**：macOS、iOS、Android 上的语音唤醒和对话模式

每个频道都可以单独配置，支持 DM 策略、允许列表和路由规则。

## 🛠️ 从源代码安装（开发）

推荐使用 `pnpm` 从源代码构建。Bun 是可选的，用于直接运行 TypeScript。

```bash
git clone https://github.com/moltbot/moltbot.git
cd moltbot

pnpm install
pnpm ui:build # 首次运行时自动安装 UI 依赖
pnpm build

pnpm moltbot onboard --install-daemon

# 开发循环（TS 更改时自动重新加载）
pnpm gateway:watch
```

注意：`pnpm moltbot ...` 直接运行 TypeScript（通过 `tsx`）。`pnpm build` 生成 `dist/` 用于通过 Node / 打包的 `moltbot` 二进制文件运行。

## 🔒 安全默认设置（DM 访问）

Moltbot 连接到真实的消息界面。将入站 DM 视为**不受信任的输入**。

完整安全指南：[安全](https://docs.molt.bot/gateway/security)

在 Telegram/WhatsApp/Signal/iMessage/Microsoft Teams/Discord/Google Chat/Slack 上的默认行为：

- **DM 配对**（`dmPolicy="pairing"`）：未知发送者会收到一个简短的配对代码，机器人不会处理他们的消息
- 批准方式：`moltbot pairing approve <channel> <code>`（然后将发送者添加到本地允许列表存储）
- 公开入站 DM 需要明确选择加入：设置 `dmPolicy="open"` 并在频道允许列表中包含 `"*"`

运行 `moltbot doctor` 来检查有风险/配置错误的 DM 策略。

## 📚 开发频道

- **stable（稳定版）**：标记版本（`vYYYY.M.D` 或 `vYYYY.M.D-<patch>`），npm dist-tag `latest`
- **beta（测试版）**：预发布标签（`vYYYY.M.D-beta.N`），npm dist-tag `beta`（macOS 应用可能缺失）
- **dev（开发版）**：`main` 分支的移动头部，npm dist-tag `dev`（发布时）

切换频道（git + npm）：`moltbot update --channel stable|beta|dev`。详情：[开发频道](https://docs.molt.bot/install/development-channels)。

## 🌟 我们目前构建的所有内容

### 核心功能

- 本地优先的网关控制平面
- 多频道收件箱
- 多代理路由
- 语音唤醒 + 对话模式
- 实时画布
- 一流的工具支持
- 伴侣应用程序
- 入门配置 + 技能系统

### 高级特性

- **会话管理**：支持主会话、群组隔离、激活模式
- **媒体处理**：图像、音频、视频处理，自动转录
- **工具生态系统**：浏览器自动化、画布控制、定时任务、会话管理
- **多平台支持**：桌面、移动、Web 全覆盖

## 🤝 贡献

欢迎贡献！如果您想为 Moltbot 的中文本地化做出贡献，请：

1. Fork 本仓库
2. 创建您的特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交您的更改（`git commit -m '添加某个很棒的功能'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启一个 Pull Request

### 本地化指南

本项目致力于为中文用户提供完整的 Moltbot 使用体验。我们需要以下方面的贡献：

- 📝 中文文档翻译
- 🌐 界面文本本地化
- 💬 命令行输出中文化
- 📖 示例和教程的中文版本
- 🐛 中文环境下的 Bug 修复

## 📄 许可证

本项目基于 MIT 许可证开源。详见 [LICENSE](https://github.com/moltbot/moltbot/blob/main/LICENSE)。

## 🔗 相关链接

- **原项目**：[moltbot/moltbot](https://github.com/moltbot/moltbot)
- **官方文档**：[docs.molt.bot](https://docs.molt.bot)
- **Discord 社区**：[加入讨论](https://discord.gg/clawd)
- **技能目录**：[molthub](https://github.com/moltbot/molthub)

## ⚠️ 免责声明

本仓库是 Moltbot 的中文本地化项目。所有核心功能和代码来自 [moltbot/moltbot](https://github.com/moltbot/moltbot) 官方仓库。本项目专注于提供中文语言支持和文档。

## 📞 支持

如果您在使用 Moltbot 时遇到问题：

1. 查看[常见问题](https://docs.molt.bot/start/faq)
2. 运行 `moltbot doctor` 进行诊断
3. 访问 [Discord 社区](https://discord.gg/clawd)寻求帮助
4. 在[官方仓库](https://github.com/moltbot/moltbot/issues)提交问题

---

**注意**：Moltbot 需要您自己的 AI 模型订阅（Anthropic Claude 或 OpenAI）。您的数据保留在您的设备上。