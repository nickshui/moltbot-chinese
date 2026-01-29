# 配置示例文件

本目录包含 Moltbot 的各种配置示例，帮助您快速开始使用。

## 📋 文件列表

### 1. basic-config.json

**适用场景**：个人使用，单一频道

**包含功能**：
- 基础网关配置
- Anthropic Claude 模型
- Telegram 频道
- 基本安全设置
- 简单日志配置

**使用方法**：
```bash
# 复制到配置目录
cp examples/configs/basic-config.json ~/.moltbot/config.json

# 设置环境变量
export ANTHROPIC_API_KEY="your-api-key"
export TELEGRAM_BOT_TOKEN="your-bot-token"

# 启动 Moltbot
moltbot gateway
```

### 2. multi-channel-config.json

**适用场景**：多频道使用，团队协作

**包含功能**：
- 多个消息频道（Telegram、Discord、WhatsApp、Slack、WebChat）
- 多个 AI 模型提供商（Anthropic + OpenAI）
- 模型故障转移
- 多工作区支持
- 性能优化配置
- 会话管理

**使用方法**：
```bash
# 复制到配置目录
cp examples/configs/multi-channel-config.json ~/.moltbot/config.json

# 设置环境变量（参考 .env.example）
export ANTHROPIC_API_KEY="your-api-key"
export OPENAI_API_KEY="your-api-key"
export TELEGRAM_BOT_TOKEN="your-telegram-token"
export DISCORD_BOT_TOKEN="your-discord-token"
# ... 其他密钥

# 启动 Moltbot
moltbot gateway
```

### 3. .env.example

**用途**：环境变量模板

**包含内容**：
- API 密钥占位符
- 各消息平台的认证信息
- 网关配置
- 安全设置

**使用方法**：
```bash
# 复制为 .env 文件
cp examples/configs/.env.example .env

# 编辑 .env 文件，填入您的实际密钥
nano .env  # 或使用其他编辑器

# 确保 .env 不被提交到 Git
echo ".env" >> .gitignore
```

## 🎯 快速开始

### 场景 1：只使用 Telegram

```bash
# 1. 复制基础配置
cp examples/configs/basic-config.json ~/.moltbot/config.json

# 2. 设置必要的环境变量
export ANTHROPIC_API_KEY="your-anthropic-key"
export TELEGRAM_BOT_TOKEN="your-telegram-token"

# 3. 启动
moltbot gateway --verbose
```

### 场景 2：使用多个频道

```bash
# 1. 复制多频道配置
cp examples/configs/multi-channel-config.json ~/.moltbot/config.json

# 2. 使用 .env 文件管理环境变量
cp examples/configs/.env.example .env
# 编辑 .env 填入您的密钥

# 3. 启动
moltbot gateway --verbose
```

## 📝 自定义配置

### 修改配置文件

1. **选择基础配置**：根据您的需求选择最接近的示例
2. **复制到配置目录**：`cp example.json ~/.moltbot/config.json`
3. **修改配置**：使用文本编辑器修改配置文件
4. **验证配置**：`moltbot config validate`
5. **启动测试**：`moltbot gateway --verbose`

### 配置优先级

Moltbot 按以下优先级加载配置：

1. **命令行参数**：最高优先级
   ```bash
   moltbot gateway --port 18790 --logLevel debug
   ```

2. **环境变量**：中等优先级
   ```bash
   export MOLTBOT_GATEWAY_PORT=18790
   ```

3. **配置文件**：默认优先级
   ```json
   {
     "gateway": {
       "port": 18789
     }
   }
   ```

## 🔐 安全最佳实践

1. **保护 API 密钥**
   - 使用环境变量存储敏感信息
   - 不要在配置文件中硬编码密钥
   - 将 .env 添加到 .gitignore

2. **使用配对模式**
   - 始终启用 `dmPolicy: "pairing"`
   - 仅批准已知用户
   - 定期审查允许列表

3. **限制权限**
   - 为不同场景使用不同工作区
   - 限制技能访问路径
   - 设置文件大小限制

4. **监控使用**
   - 启用日志记录
   - 设置 API 使用警报
   - 定期检查会话

## 🛠️ 常见配置任务

### 更改默认端口

```json
{
  "gateway": {
    "port": 19000  // 改为您想要的端口
  }
}
```

### 添加新的消息频道

```json
{
  "channels": {
    "新频道名称": {
      "enabled": true,
      "配置项": "值"
    }
  }
}
```

### 配置多个工作区

```json
{
  "workspaces": {
    "workspace1": {
      "name": "工作区1",
      "model": "claude-opus-4.5",
      "skills": ["browser", "files"]
    },
    "workspace2": {
      "name": "工作区2",
      "model": "gpt-4",
      "skills": ["cron"]
    }
  }
}
```

### 设置定时任务

```json
{
  "cron": {
    "enabled": true,
    "jobs": [
      {
        "name": "每日提醒",
        "schedule": "0 8 * * *",
        "action": {
          "type": "message",
          "channel": "telegram",
          "to": "@username",
          "message": "早上好！"
        }
      }
    ]
  }
}
```

## 📚 相关文档

- [配置指南](../../配置指南.md) - 详细的配置说明
- [安装指南](../../安装指南.md) - 安装和设置
- [快速开始](../../快速开始.md) - 快速入门教程
- [常见问题](../../常见问题.md) - FAQ

## 🆘 获取帮助

如果您在配置过程中遇到问题：

1. 运行诊断：`moltbot doctor`
2. 验证配置：`moltbot config validate`
3. 查看日志：检查 `~/.moltbot/logs/gateway.log`
4. 查看 [FAQ](../../常见问题.md)
5. 访问 [Discord 社区](https://discord.gg/clawd)

---

**返回**: [主页](../../README.md)
