# 幸福大学 · Happiness University Design

> 以"幸福设计"为核心主题的交互式网站，将积极心理学的研究成果与设计美学融合，帮助用户发现幸福、记录幸福、理解幸福。

**在线预览**：[https://xiaojieg7.github.io/happiness-university-design/](https://xiaojieg7.github.io/happiness-university-design/)

**GitHub 仓库**：[https://github.com/xiaojieg7/happiness-university-design](https://github.com/xiaojieg7/happiness-university-design)

---

## 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [部署指南](#部署指南)
- [AI 幸福设计师](#ai-幸福设计师)
- [多层记忆系统](#多层记忆系统)
- [数据存储方案](#数据存储方案)
- [设计特色](#设计特色)
- [页面路由](#页面路由)
- [更新日志](#更新日志)

---

## 项目简介

幸福大学是一个以幸福设计为理念的 Web 应用，旨在通过**视差滚动叙事**、**幸福日记系统**、**AI 幸福设计师**和**期刊专栏**四大核心功能，引导用户关注生活中的美好瞬间，并用科学的方法理解幸福。

项目采用**粉红玻璃质感（Glassmorphism）**设计风格，以温暖柔和的视觉语言传递幸福感受。所有数据存储在浏览器本地，无需后端服务，注重隐私保护。

---

## 核心功能

### 1. 视差滚动首页

- 基于 **GSAP ScrollTrigger** 实现的高级视差滚动叙事
- 五大幸福维度展示（情感、意义、关系、成就、正念）
- 设计思维理念传达，分章节沉浸式体验
- 行动号召（CTA）引导用户开始幸福之旅

### 2. 幸福日记系统

- 支持图文混排的日记编辑器
- **心情选择器**：8 种情绪标签（开心、平静、感恩、激动、温暖、希望、安宁、启发）
- **图片上传**：支持多图上传，自动压缩存储到浏览器 IndexedDB
- **本地存储**：所有数据存储在浏览器本地，无需后端服务
- **隐私保护**：
  - 可选私密日记，PIN 码加密保护（SHA-256 + Salt）
  - 密保问题找回 PIN 码（7 个预设密保问题，答案同样 SHA-256 加密）
  - 支持修改密码与彻底重置（将私密日记转为公开）

### 3. AI 幸福设计师

- 基于 **OpenAI 兼容协议**的 AI 评价系统（直接 fetch 调用 `/chat/completions`）
- 以"幸福设计师"角度对每篇日记进行温暖鼓励的评价
- **五维幸福指数打分**：情感、意义、关系、成就、正念，每项 0-100 分
- **多层记忆系统**：四层记忆架构，让 AI 真正"了解"每一位用户
- **降级策略**：无 API Key 或请求超时时，使用本地预设评价（标记为降级数据，不持久化）
- **智能超时**：120 秒超时机制，确保 AI 有充足时间生成高质量评价
- 支持 OpenAI / DeepSeek / 通义千问 / 智谱 GLM / Moonshot 等兼容协议

### 4. 期刊专栏

- 精选 **18 篇**积极心理学、幸福学、设计与幸福领域的经典学术文献
- 五大分类：积极心理学、幸福学研究、设计与幸福、正念与心智、社会关系
- 分类筛选 + 关键词搜索（支持标题、作者、关键词、期刊名多字段搜索）
- 每篇文章含期刊来源、年份、卷号、作者、摘要、关键词、DOI 链接
- 编辑精选推荐（6 篇横幅展示）

---

## 技术栈

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 前端框架（Composition API + `<script setup>`） | ^3.5 |
| TypeScript | 类型安全 | ~6.0 |
| Vite | 构建工具（`base: './'` 相对路径部署） | ^8.1 |
| Tailwind CSS v4 | 原子化 CSS（@tailwindcss/vite 插件模式） | ^4.3 |
| GSAP | 视差滚动动画（ScrollTrigger） | ^3.15 |
| Pinia | 状态管理 | ^3.0 |
| Vue Router | SPA 路由（Hash 模式，兼容静态部署） | ^4.6 |
| LangChain.js | AI Agent 框架（类型参考 + 记忆架构） | ^1.2 |
| Lucide Icons | 图标库 | ^0.577 |
| IndexedDB | 浏览器端图片与评价存储 | 原生 API |
| localStorage | 日记数据、设置、记忆存储 | 原生 API |
| GitHub Actions | CI/CD 自动部署到 GitHub Pages | — |

---

## 项目结构

```
happiness-university/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions 自动部署工作流
├── src/
│   ├── main.ts                           # 应用入口
│   ├── App.vue                           # 根组件（背景光斑 + 导航 + 路由视图）
│   ├── style.css                         # 全局样式（CSS变量 + 玻璃效果 + 滚动条美化）
│   ├── router/
│   │   └── index.ts                      # 路由配置（6条路由，Hash 模式）
│   ├── views/                            # 页面视图
│   │   ├── HomeView.vue                  # 首页
│   │   ├── DiaryView.vue                 # 日记列表页
│   │   ├── DiaryNewView.vue              # 新建日记页
│   │   ├── DiaryDetailView.vue           # 日记详情页（含 AI 评价生成 + 降级提示）
│   │   ├── JournalView.vue               # 期刊专栏页
│   │   └── SettingsView.vue              # 设置页（API 配置 + 模型选择）
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue             # 导航栏（响应式，桌面端 + 移动端）
│   │   │   └── AppFooter.vue             # 页脚
│   │   ├── home/
│   │   │   ├── HeroChapter.vue           # 首页 Hero 区域
│   │   │   ├── DesignThinking.vue        # 设计思维章节
│   │   │   ├── FiveDimensions.vue        # 五维幸福模型
│   │   │   ├── PracticeChapter.vue       # 实践章节
│   │   │   └── JourneyCTA.vue            # 行动号召
│   │   ├── diary/
│   │   │   ├── DiaryList.vue             # 日记列表
│   │   │   ├── DiaryCard.vue             # 日记卡片
│   │   │   ├── MoodSelector.vue          # 心情选择器
│   │   │   ├── ImageUploader.vue         # 图片上传
│   │   │   ├── AIEvaluation.vue          # AI 评价展示（圆环仪表盘 + 五维进度条 + 降级标记）
│   │   │   ├── PinVerify.vue             # PIN 码验证 / 密保找回 / 修改密码
│   │   │   └── PrivacyToggle.vue         # 隐私开关
│   │   └── journal/
│   │       └── JournalCard.vue           # 期刊文章卡片
│   ├── stores/
│   │   ├── diary.ts                      # 日记状态管理（CRUD + PIN + 评价 + 降级数据过滤）
│   │   └── settings.ts                   # 设置状态管理（API 配置 + 模型预设）
│   ├── services/
│   │   ├── ai-evaluator.ts               # AI 评价引擎（System Prompt + API 调用 + 降级策略）
│   │   ├── agent-memory.ts               # 多层记忆系统（四层架构）
│   │   ├── crypto.ts                     # SHA-256 加密（PIN + 密保答案）
│   │   ├── image-processor.ts            # 图片压缩处理
│   │   └── storage.ts                    # IndexedDB + localStorage 存储服务
│   ├── composables/
│   │   └── useParallax.ts                # 视差滚动 composable
│   ├── data/
│   │   └── journals.ts                   # 期刊专栏数据（18 篇学术文章）
│   └── types/
│       ├── diary.ts                      # 日记类型定义（含 isFallback 字段）
│       └── memory.ts                     # 记忆系统类型定义（四层结构）
├── index.html
├── vite.config.ts                        # Vite 配置（base: './' 相对路径）
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## 快速开始

### 环境要求

- Node.js >= 18（推荐 22.x）
- npm 或其他包管理器

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/xiaojieg7/happiness-university-design.git
cd happiness-university-design

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

开发服务器默认运行在 `http://localhost:3000`。

### AI 功能配置

1. 启动项目后，进入**设置**页面（导航栏 → 设置）
2. 选择预设模型或选择"自定义"
3. 填写 API URL（如 `https://api.openai.com/v1`）
4. 填写 API Key
5. 填写模型名称（如 `gpt-4o-mini`）
6. 点击"测试连接"验证配置（HTTP 200 即为成功）
7. 配置成功后，在日记详情页点击"生成评价"即可获得 AI 幸福设计师的反馈

**预设模型列表**：

| 预设 | 模型 | API 地址 | 说明 |
|------|------|----------|------|
| GPT-4o Mini | `gpt-4o-mini` | `https://api.openai.com/v1` | OpenAI - 快速经济 |
| GPT-4o | `gpt-4o` | `https://api.openai.com/v1` | OpenAI - 强力推荐 |
| DeepSeek Chat | `deepseek-chat` | `https://api.deepseek.com/v1` | DeepSeek - 中文优秀 |
| DeepSeek Reasoner | `deepseek-reasoner` | `https://api.deepseek.com/v1` | DeepSeek - 深度思考 |
| 通义千问-Max | `qwen-max` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 阿里云 - 通义千问 |
| GLM-4-Flash | `glm-4-flash` | `https://open.bigmodel.cn/api/paas/v4` | 智谱AI - GLM-4 |
| 自定义 | — | — | 自定义 API 地址 |

> 未配置 API Key 时，系统会使用本地预设评价作为降级方案（标记为"预设评价"，不会持久化保存）。

---

## 部署指南

### GitHub Pages 自动部署

项目已配置 GitHub Actions 自动部署工作流（`.github/workflows/deploy.yml`）：

1. 推送代码到 `main` 分支
2. Actions 自动触发：安装依赖 → 构建 → 上传构建产物 → 部署到 GitHub Pages
3. 部署完成后访问 `https://<用户名>.github.io/<仓库名>/`

**关键配置**：

| 配置项 | 文件 | 说明 |
|--------|------|------|
| `base: './'` | `vite.config.ts` | 相对路径，适配任何部署环境的子路径 |
| `createWebHashHistory()` | `src/router/index.ts` | Hash 路由模式，静态服务器无需 fallback 配置 |
| `npm run build` | `deploy.yml` | 构建命令，输出到 `dist/` 目录 |

> **本地验证**：构建后可直接双击打开 `dist/index.html`，相对路径确保在任何环境下都能正确加载资源。

### 其他静态服务器部署

由于使用相对路径 + Hash 路由，项目可部署在任何静态服务器上：

```bash
# 构建
npm run build

# 使用任意静态服务器托管 dist/ 目录
npx serve dist
# 或
python -m http.server 8000 --directory dist
```

---

## AI 幸福设计师

### System Prompt 设计

AI 以"幸福设计师"身份评价日记，核心原则：

1. **温暖鼓励** — 像真正关心的朋友那样回应，不是 AI 工具
2. **五维打分** — 情感、意义、关系、成就、正念各维度 0-100 分
3. **建设性引导** — 先看到积极的一面，然后温和地引导思考
4. **个性化** — 基于多层记忆系统，回顾用户过往日记模式
5. **JSON 结构化输出** — 便于前端解析展示

### 评价数据结构

```typescript
interface AIEvaluation {
  content: string                    // 评价正文（150-250字）
  generatedAt: string                // 生成时间 ISO
  keywords: string[]                 // 关键词标签
  encouragement?: string             // 简短鼓励语
  happinessScore?: number            // 幸福指数总分 0-100
  dimensionScores?: DimensionScore[] // 五维评分
  summary?: string                   // 一句话总结
  isFallback?: boolean               // 是否为降级预设数据
}
```

### 降级策略与持久化逻辑

| 场景 | 行为 | 持久化 |
|------|------|--------|
| 无 API Key | 返回预设评价，标记 `isFallback: true` | 不保存 |
| API 超时（120s） | 返回预设评价，标记 `isFallback: true` | 不保存 |
| API 返回错误 | 返回预设评价，标记 `isFallback: true` | 不保存 |
| API 成功 | 返回真实评价，`isFallback` 为 false/undefined | 保存到 IndexedDB + localStorage |
| 应用启动 | 检查历史数据，清理错误保存的降级数据 | 自动清理 |

> 降级评价在 UI 上会显示橙色"预设评价"标记和"重新生成 AI 评价"按钮，用户可随时重新生成真实评价。

---

## 多层记忆系统

AI 幸福设计师配备四层记忆架构，让每次评价都建立在之前的了解之上：

### Layer 1 — 用户画像（UserProfile）

长期积累的性格特点和偏好：

- 性格特点推断（细腻、乐观、善于内省、重视关系、懂得感恩...）
- 兴趣话题提取（从日记关键词中自动挖掘）
- 写作风格分析（简洁/详细/感性/理性）
- 情绪基线判断（积极/平和/内省）

### Layer 2 — 对话上下文（ConversationContext）

近期交互和话题连贯性：

- 最近 5 篇日记摘要
- 最近 10 次情绪趋势
- 持续话题检测（关键词频率 ≥2 自动归入）
- 上次评价话题记录

### Layer 3 — 长期模式（LongTermPatterns）

数据驱动的洞察：

- 情绪分布统计（各情绪出现次数）
- 高频关键词 Top 30
- 平均每周日记频率
- 五维幸福得分追踪（随日记积累缓慢增长）
- 成长里程碑（第1篇、第10篇、第30篇、第100篇）

### Layer 4 — 关系记忆（RelationshipMemory）

AI 与用户之间的情感连接：

- 信任度（0-100，每篇日记 +1，初始 20）
- 在一起的天数
- 个人细节引用（家庭、工作、健康、梦想分类）
- 庆祝时刻记录

### 记忆提示词构建

每次评价时，系统会从四层记忆中提取关键信息构建上下文提示词，让 AI 能够：

- 引用用户之前分享的内容
- 关注用户的成长轨迹
- 在里程碑时刻给予特别鼓励
- 避免重复的鼓励语

---

## 数据存储方案

| 数据类型 | 存储方式 | localStorage Key / IndexedDB Store | 说明 |
|----------|----------|-------------------------------------|------|
| 日记文本数据 | localStorage | `happiness_diary_entries` | JSON 序列化，含元数据 |
| 日记图片 | IndexedDB | `images` store | Blob 格式，支持大文件 |
| AI 评价结果 | IndexedDB | `evaluations` store | 仅真实评价，降级数据不存储 |
| PIN 码哈希 | localStorage | `happiness_pin_hash` | SHA-256 + Salt 加密 |
| 密保问题 | localStorage | `happiness_security_question` | 明文存储问题文本 |
| 密保答案哈希 | localStorage | `happiness_security_answer_hash` | SHA-256 + Salt，答案小写归一化 |
| API 配置 | localStorage | `happiness-settings` | API URL / Key / 模型名称 |
| AI 记忆数据 | localStorage | `happiness-agent-memory` | 四层记忆结构化存储 |

### 加密方案

- **PIN 码**：`SHA-256(pin + 'happiness-university-2026')`
- **密保答案**：`SHA-256(answer.trim().toLowerCase() + 'happiness-security-answer-2026')`，答案归一化处理避免大小写差异
- 使用浏览器原生 `crypto.subtle.digest` API

---

## 设计特色

### 粉红玻璃质感（Glassmorphism）

- 半透明背景 + `backdrop-filter: blur(16px)` 实现毛玻璃效果
- 渐变背景：粉红 → 薰衣草 → 淡紫
- 三个动态光斑装饰球（粉、紫、青）营造梦幻氛围
- 玻璃按钮、输入框、卡片统一视觉语言

### 字体系统

- **标题**：Lora（优雅衬线体）
- **正文**：Noto Sans SC（中文无衬线）
- **装饰**：Playfair Display

### 色彩系统

- 主色：`#FF6B9D`（粉红）
- 辅助：`#C084FC`（紫）、`#67E8F9`（青）、`#FBBF24`（暖黄）
- 8 种情绪色彩映射（CSS 变量 `--mood-*`）

### 布局规范

- 页面内容居中：使用显式内联 style（`display:flex; justify-content:center; max-width; margin:auto`）
- 首页五维卡片：3+2 两行布局，避免过宽
- 日记详情页：`padding-top: 8rem` 避免被固定导航栏遮挡

---

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/#/` | 首页 | 视差滚动叙事，展示幸福设计理念 |
| `/#/diary` | 日记列表 | 全部日记浏览与管理 |
| `/#/diary/new` | 新建日记 | 图文编辑 + 心情 + 隐私设置 |
| `/#/diary/:id` | 日记详情 | 查看日记 + AI 评价生成 |
| `/#/journal` | 期刊专栏 | 学术文献浏览与检索 |
| `/#/settings` | 设置 | API Key 配置 + 模型选择 |

> 使用 Hash 路由模式（`/#/path`），确保在 GitHub Pages 等静态服务器上刷新页面不会 404。

---

## 更新日志

### v1.2.0 — AI 评价可靠性增强

- **超时优化**：API 请求超时从 30s 提升到 120s，确保 AI 有充足时间生成评价
- **降级数据标记**：新增 `isFallback` 字段，降级评价与真实评价明确区分
- **降级数据不持久化**：预设评价只存在内存中，不再错误保存到 IndexedDB
- **历史数据清理**：应用启动时自动清理之前错误保存的降级数据
- **UI 区分**：降级评价显示橙色"预设评价"标记 + "重新生成 AI 评价"按钮
- **storage 新增** `deleteEvaluation` 方法，`getEvaluation` 返回 `isFallback` 字段

### v1.1.0 — GitHub Pages 部署支持

- **相对路径**：`vite.config.ts` 的 `base` 从 `/` 改为 `./`，适配任何部署环境
- **Hash 路由**：`createWebHistory` 改为 `createWebHashHistory`，静态服务器无需 fallback
- **GitHub Actions**：新增 `deploy.yml` 自动部署工作流
- **修复**：本地双击打开 `dist/index.html` 也能正常工作

### v1.0.0 — 初始版本

- 视差滚动首页（GSAP ScrollTrigger）
- 幸福日记系统（图文编辑 + IndexedDB 存储 + PIN 加密）
- AI 幸福设计师（OpenAI 兼容协议 + 五维打分 + 多层记忆）
- 期刊专栏（18 篇学术文献 + 分类筛选 + 搜索）
- 设置页面（API Key 配置 + 7 个模型预设 + 连接测试）
- 密保问题找回 PIN 码功能

---

## License

MIT
