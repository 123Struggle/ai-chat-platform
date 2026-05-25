# AI大模型在线平台

一个类似ChatGPT的AI大模型在线平台，支持与GPT-5.5模型进行流式对话。

## 功能特性

- ✅ 实时流式响应（Streaming）
- ✅ Markdown完美渲染
- ✅ 代码语法高亮
- ✅ 可折叠侧边栏
- ✅ 对话历史本地存储
- ✅ 清空上下文功能
- ✅ 响应式设计
- ✅ Docker容器化部署

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **Markdown**: react-markdown + react-syntax-highlighter
- **AI SDK**: OpenAI Node SDK

## 快速开始

### 方式一：本地开发

#### 1. 克隆项目

```bash
git clone <项目地址>
cd AI大模型在线平台
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的API密钥：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.modelverse.cn/v1
OPENAI_MODEL=gpt-5.5
```

#### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 方式二：Docker部署

#### 1. 配置环境变量

创建 `.env` 文件：

```env
OPENAI_API_KEY=your_api_key_here
```

#### 2. 启动服务

```bash
docker-compose up -d
```

访问 http://localhost:3000

#### 3. 查看日志

```bash
docker-compose logs -f
```

#### 4. 停止服务

```bash
docker-compose down
```

## 项目结构

```
AI大模型在线平台/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts      # API路由（流式响应）
│   │   ├── globals.css           # 全局样式
│   │   ├── layout.tsx            # 根布局
│   │   └── page.tsx              # 主页面
│   ├── components/
│   │   ├── ChatInput.tsx         # 输入框组件
│   │   ├── ChatInterface.tsx     # 主界面组件
│   │   ├── Message.tsx           # 消息组件
│   │   └── Sidebar.tsx           # 侧边栏组件
│   └── types/
│       └── chat.ts               # 类型定义
├── public/                       # 静态资源
├── Dockerfile                    # Docker镜像文件
├── docker-compose.yml            # Docker Compose配置
├── .env.example                  # 环境变量示例
├── next.config.ts                # Next.js配置
├── package.json                  # 项目依赖
└── README.md                     # 项目说明
```

## 使用说明

### 基本操作

1. **发送消息**: 在输入框中输入内容，按 `Enter` 发送
2. **换行**: 按 `Shift + Enter` 换行
3. **清空对话**: 点击输入框右侧的垃圾桶图标
4. **展开/收起侧边栏**: 点击左上角菜单按钮

### 代码高亮

AI回复中的代码块会自动进行语法高亮显示，并显示对应的语言标签。

### 对话历史

对话记录会自动保存在浏览器的 `localStorage` 中，刷新页面后仍可查看历史对话。

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `OPENAI_API_KEY` | OpenAI API密钥 | 必填 |
| `OPENAI_BASE_URL` | API基础地址 | `https://api.modelverse.cn/v1` |
| `OPENAI_MODEL` | 模型名称 | `gpt-5.5` |

## 开发说明

### 添加新功能

1. 在 `src/components/` 目录下创建新组件
2. 在 `src/app/page.tsx` 中引入并使用
3. 如需新的API接口，在 `src/app/api/` 目录下添加路由

### 代码规范

- 使用TypeScript进行类型定义
- 组件使用函数式组件和Hooks
- 样式使用Tailwind CSS类名

## 常见问题

### 1. API连接失败

- 确保在 `.env.local` 文件中正确配置了API密钥
- 检查API地址是否正确
- 确保服务器可以访问外网

### 2. Docker构建失败

```bash
# 清理Docker缓存
docker-compose down
docker system prune -a

# 重新构建
docker-compose up --build
```

### 3. 依赖安装失败

```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules
npm install
```

## License

MIT
