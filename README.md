# 幸福大学 · Happiness University Design

> 以"幸福设计"为核心主题的交互式网站，将积极心理学的研究成果与设计美学融合，帮助用户发现幸福、记录幸福、理解幸福。

## 项目简介

幸福大学是一个以幸福设计为理念的 Web 应用，旨在通过**视差滚动叙事**、**幸福日记系统**和**AI 幸福设计师**三大核心功能，引导用户关注生活中的美好瞬间，并用科学的方法理解幸福。

项目采用**粉红玻璃质感（Glassmorphism）**设计风格，以温暖柔和的视觉语言传递幸福感受。

---

## 核心功能

### 1. 视差滚动首页
- 基于 **GSAP ScrollTrigger** 实现的高级视差滚动叙事
- 五大幸福维度展示（情感、意义、关系、成就、正念）
- 设计思维理念传达，分章节沉浸式体验
- 行动号召（CTA）引导用户开始幸福之旅

### 2. 幸福日记系统
- 支持图文混排的日记编辑器
- **心情选择器**：8种情绪标签（开心、平静、感恩、兴奋、温暖、希望、宁静、激励）
- **图片上传**：支持多图上传，自动压缩存储到浏览器 IndexedDB
- **本地存储**：所有数据存储在浏览器本地，无需后端服务
- **隐私保护**：
  - 可选私密日记，PIN 码加密保护（SHA-256）
  - 密保问题找回 PIN 码
  - 支持修改密码与彻底重置

### 3. AI 幸福设计师
- 基于 **LangChain.js + OpenAI 兼容协议**的 AI 评价系统
- 以"幸福设计师"角度对每篇日记进行温暖鼓励的评价
- **五维幸福指数打分**：情感、意义、关系、成就、正念，每项 0-100 分
- **多层记忆系统**：
  - 用户画像层 — 记住用户性格、偏好与写作风格
  - 对话上下文层 — 短期对话连贯性
  - 长期模式层 — 识别用户的成长轨迹与幸福模式
  - 关系记忆层 — AI 与用户之间建立的互动关系
- 支持 OpenAI / DeepSeek / 通义千问等兼容协议的自定义 API 配置
- 无 API Key 时提供本地预设评价降级方案

### 4. 期刊专栏
- 精选 **18 篇**积极心理学、幸福学、设计与幸福领域的经典学术文献
- 五大分类：积极心理学、幸福学研究、设计与幸福、正念与心智、社会关系
- 分类筛选 + 关键词搜索
- 每篇文章含期刊来源、作者、摘要、关键词、DOI 链接
- 编辑精选推荐

---

## 技术栈

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 前端框架（Composition API + `<script setup>`） | ^3.5 |
| TypeScript | 类型安全 | ~6.0 |
| Vite | 构建工具 | ^8.1 |
| Tailwind CSS v4 | 原子化 CSS（@tailwindcss/vite 插件模式） | ^4.3 |
| GSAP | 视差滚动动画（ScrollTrigger） | ^3.15 |
| Pinia | 状态管理 | ^3.0 |
| Vue Router | SPA 路由 | ^4.6 |
| LangChain.js | AI Agent 框架 | ^1.2 |
| Lucide Icons | 图标库 | ^0.577 |
| IndexedDB | 浏览器端图片存储 | 原生 API |
| localStorage | 日记数据与设置存储 | 原生 API |

---

## 项目结构

```
happiness-university/
├── src/
│   ├── main.ts                        # 应用入口
│   ├── App.vue                        # 根组件（背景光斑 + 导航 + 路由视图）
│   ├── style.css                      # 全局样式（CSS变量 + 玻璃效果 + 滚动条美化）
│   ├── router/
│   │   └── index.ts                   # 路由配置（6条路由）
│   ├── views/                         # 页面视图
│   │   ├── HomeView.vue               # 首页
│   │   ├── DiaryView.vue              # 日记列表页
│   │   ├── DiaryNewView.vue           # 新建日记页
│   │   ├── DiaryDetailView.vue        # 日记详情页
│   │   ├── JournalView.vue            # 期刊专栏页
│   │   └── SettingsView.vue           # 设置页（API配置）
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue          # 导航栏（响应式）
│   │   │   └── AppFooter.vue          # 页脚
│   │   ├── home/
│   │   │   ├── HeroChapter.vue        # 首页 Hero 区域
│   │   │   ├── DesignThinking.vue     # 设计思维章节
│   │   │   ├── FiveDimensions.vue     # 五维幸福模型
│   │   │   ├── PracticeChapter.vue    # 实践章节
│   │   │   └── JourneyCTA.vue         # 行动号召
│   │   ├── diary/
│   │   │   ├── DiaryList.vue          # 日记列表
│   │   │   ├── DiaryCard.vue          # 日记卡片
│   │   │   ├── MoodSelector.vue       # 心情选择器
│   │   │   ├── ImageUploader.vue      # 图片上传
│   │   │   ├── AIEvaluation.vue       # AI评价展示（圆环仪表盘 + 五维进度条）
│   │   │   ├── PinVerify.vue          # PIN码验证 / 密保找回
│   │   │   └── PrivacyToggle.vue      # 隐私开关
│   │   └── journal/
│   │       └── JournalCard.vue        # 期刊文章卡片
│   ├── stores/
│   │   ├── diary.ts                   # 日记状态管理（CRUD + PIN + 评价）
│   │   └── settings.ts                # 设置状态管理（API配置）
│   ├── services/
│   │   ├── ai-evaluator.ts            # AI评价服务（System Prompt + API调用 + 降级策略）
│   │   ├── agent-memory.ts            # 多层记忆系统
│   │   ├── crypto.ts                  # SHA-256加密（PIN + 密保答案）
│   │   ├── image-processor.ts         # 图片压缩处理
│   │   └── storage.ts                 # IndexedDB存储服务
│   ├── composables/
│   │   └── useParallax.ts             # 视差滚动 composable
│   ├── data/
│   │   └── journals.ts                # 期刊专栏数据（18篇学术文章）
│   └── types/
│       ├── diary.ts                   # 日记类型定义
│       └── memory.ts                  # 记忆系统类型定义
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## 快速开始

### 环境要求

- Node.js >= 18
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

1. 启动项目后，进入**设置**页面
2. 填写 API URL（如 `https://api.openai.com/v1`）
3. 填写 API Key
4. 选择或填写模型名称（如 `gpt-4o-mini`）
5. 点击"测试连接"验证配置
6. 配置成功后，在日记详情页点击"生成评价"即可获得 AI 幸福设计师的反馈

> 支持 OpenAI / DeepSeek / 通义千问 / Moonshot 等兼容 OpenAI 协议的 API 提供商。
> 未配置 API Key 时，系统会使用本地预设评价作为降级方案。

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
- 8种情绪色彩映射

---

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 视差滚动叙事，展示幸福设计理念 |
| `/diary` | 日记列表 | 全部日记浏览与管理 |
| `/diary/new` | 新建日记 | 图文编辑 + 心情 + 隐私设置 |
| `/diary/:id` | 日记详情 | 查看日记 + AI评价生成 |
| `/journal` | 期刊专栏 | 学术文献浏览与检索 |
| `/settings` | 设置 | API Key 配置 + 模型选择 |

---

## AI 幸福设计师 System Prompt 设计

AI 以"幸福设计师"身份评价日记，核心原则：

1. **温暖鼓励** — 以欣赏和共情的语气回应
2. **五维打分** — 情感、意义、关系、成就、正念各维度 0-100 分
3. **建设性引导** — 在肯定基础上温和提出成长建议
4. **个性化** — 基于多层记忆系统，回顾用户过往日记模式
5. **JSON 结构化输出** — 便于前端解析展示

---

## 数据存储方案

| 数据类型 | 存储方式 | 说明 |
|----------|----------|------|
| 日记文本数据 | localStorage | JSON 序列化存储 |
| 日记图片 | IndexedDB | Blob 格式存储，支持大文件 |
| PIN 码哈希 | localStorage | SHA-256 加密后存储 |
| 密保问题答案 | localStorage | SHA-256 加密后存储 |
| API 配置 | localStorage | API URL / Key / 模型名称 |
| AI 记忆数据 | localStorage | 多层记忆结构化存储 |
| AI 评价结果 | IndexedDB | 与日记图片关联存储 |

---

## License

MIT
