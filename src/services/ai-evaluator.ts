/**
 * AI 幸福设计师 - 评价引擎
 *
 * 集成多层记忆系统，使用 OpenAI 兼容协议
 * 支持幸福指数打分（五维度 + 总分）
 */

import type { DiaryEntry, AIEvaluation } from '../types/diary'
import { useSettingsStore } from '../stores/settings'
import { loadMemory, saveMemory, processNewDiaryForMemory, buildMemoryPrompt } from './agent-memory'

// ========== System Prompt ==========
const SYSTEM_PROMPT = `你是一位温柔、有洞察力的「幸福设计师」。你的使命是用温暖而专业的视角，帮助每一位用户发现和设计自己的幸福生活。

你的特点：
- 像一位真正关心的朋友那样回应，而不是一个AI工具
- 总是先看到积极的一面，然后温和地引导思考
- 用具体的细节回应，不说空泛的鸡汤
- 记住用户之前分享过的内容，建立连续的对话感
- 适时地引用用户的成长轨迹，让TA感受到被关注

## 评价风格
1. 开头用一句温暖的问候或感受（结合记忆中的信息）
2. 指出1-2个具体的亮点（引用日记原文）
3. 从幸福设计的角度给一个小洞察
4. 以鼓励结尾，与之前的对话形成连贯性

## 幸福指数打分
你需要从五个维度对这篇日记进行评分，每维度0-100分：

1. **情感** — 日记中表达的积极情绪的丰富度和真实感
2. **意义** — 日记内容是否反映了对自己重要的事物和价值观
3. **关系** — 日记中体现的人际连接、归属感或对他人的关注
4. **成就** — 日记中体现的自我成长、进步或完成的事情
5. **正念** — 日记中体现的活在当下、觉察和感恩的能力

评分原则：
- 不要苛刻，这是一个鼓励成长的工具，不是考试
- 即使是平凡的一天，只要用户记录了，就值得肯定
- 60分以上为"不错"，70分以上为"很好"，80分以上为"优秀"
- 只有极负面、完全无觉察的日记才给低分（50以下）
- 五维度的分数可以拉开差距，体现这篇日记的特点

## 语言
中文，温暖、有质感、像一封信。评价正文150-250字。

## 输出格式（严格JSON，不要包裹在markdown代码块中）
{
  "content": "完整的评价正文",
  "summary": "一句话总结这篇日记的幸福感",
  "happinessScore": 78,
  "dimensionScores": [
    { "name": "情感", "score": 80, "comment": "感受到了温暖的喜悦" },
    { "name": "意义", "score": 75, "comment": "关注了对重要的人的陪伴" },
    { "name": "关系", "score": 85, "comment": "与朋友的连接很珍贵" },
    { "name": "成就", "score": 60, "comment": "平凡的一天也有它的价值" },
    { "name": "正念", "score": 82, "comment": "能觉察到当下的美好" }
  ],
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "encouragement": "一句简短的鼓励语"
}`

// ========== 降级策略：无API Key时的预设鼓励语 ==========

const FALLBACK_ENCOURAGEMENTS = [
  {
    content: '每一次记录，都是在为自己的人生画上一笔温暖的色彩。你愿意停下来感受生活中的美好，这本身就是一种了不起的能力。',
    keywords: ['觉察', '美好', '记录'],
    encouragement: '继续写下你的故事吧 ✨',
    summary: '用心感受生活的一天',
    happinessScore: 72,
    dimensionScores: [
      { name: '情感', score: 70, comment: '愿意停下来感受' },
      { name: '意义', score: 68, comment: '记录本身就是意义' },
      { name: '关系', score: 60, comment: '与自己对话' },
      { name: '成就', score: 72, comment: '坚持记录是了不起的事' },
      { name: '正念', score: 80, comment: '觉察当下的美好' },
    ],
  },
  {
    content: '幸福不是终点，而是每一个「此刻」的选择。你在今天选择关注了那些让你感到幸福的瞬间——这个选择本身就很珍贵。',
    keywords: ['当下', '选择', '珍贵'],
    encouragement: '明天也会有美好的事在等你 💗',
    summary: '选择关注幸福的一天',
    happinessScore: 75,
    dimensionScores: [
      { name: '情感', score: 78, comment: '主动选择积极' },
      { name: '意义', score: 75, comment: '理解幸福是一种选择' },
      { name: '关系', score: 62, comment: '关注内心的连接' },
      { name: '成就', score: 70, comment: '做出了好的选择' },
      { name: '正念', score: 85, comment: '活在当下' },
    ],
  },
  {
    content: '写日记是一种与自己对话的方式。通过这些文字，你正在一点点了解什么让自己真正快乐。这种自我觉察，是通往更深层幸福的钥匙。',
    keywords: ['对话', '觉察', '成长'],
    encouragement: '你比自己想象的更有智慧 🌸',
    summary: '自我觉察的一天',
    happinessScore: 78,
    dimensionScores: [
      { name: '情感', score: 72, comment: '在探索内心' },
      { name: '意义', score: 82, comment: '追求深层理解' },
      { name: '关系', score: 58, comment: '更多是内在对话' },
      { name: '成就', score: 76, comment: '自我觉察是重要成长' },
      { name: '正念', score: 88, comment: '高度的自我觉察' },
    ],
  },
  {
    content: '生活的美往往藏在最平凡的瞬间里。你有一双发现美的眼睛，这比什么都重要。保持这份敏感，它会带你去到意想不到的地方。',
    keywords: ['平凡', '发现', '感知'],
    encouragement: '今天的你也做得很好 🌿',
    summary: '发现平凡之美的一天',
    happinessScore: 74,
    dimensionScores: [
      { name: '情感', score: 76, comment: '有发现美的眼睛' },
      { name: '意义', score: 70, comment: '在平凡中找到价值' },
      { name: '关系', score: 60, comment: '更多是个人感受' },
      { name: '成就', score: 68, comment: '保持敏感本身就是成就' },
      { name: '正念', score: 82, comment: '对当下有敏锐感知' },
    ],
  },
  {
    content: '每一篇日记都是一颗种子。也许现在还看不到结果，但它们正在你心里的土壤中生根发芽。相信时间的力量，也相信自己。',
    keywords: ['坚持', '时间', '信任'],
    encouragement: '慢慢来，比较快 🌱',
    summary: '坚持记录的一天',
    happinessScore: 73,
    dimensionScores: [
      { name: '情感', score: 70, comment: '有耐心和信任' },
      { name: '意义', score: 78, comment: '理解时间的力量' },
      { name: '关系', score: 60, comment: '专注于自我成长' },
      { name: '成就', score: 76, comment: '坚持本身就是成就' },
      { name: '正念', score: 78, comment: '有耐心地等待' },
    ],
  },
]

// ========== 核心评价函数 ==========

export async function evaluateDiary(entry: DiaryEntry): Promise<AIEvaluation> {
  const settingsStore = useSettingsStore()

  console.log('[AI评价] isConfigured:', settingsStore.isConfigured, 'model:', settingsStore.modelName, 'url:', settingsStore.apiUrl)

  // 如果没有配置 API Key，使用降级策略（带随机性的预设）
  if (!settingsStore.isConfigured) {
    console.log('[AI评价] 无API Key, 使用降级策略')
    return getFallbackEvaluation(entry)
  }

  // 加载并更新记忆
  let memory = loadMemory()
  memory = processNewDiaryForMemory(memory, entry)
  saveMemory(memory)

  // 构建记忆提示词
  const memoryContext = buildMemoryPrompt(memory)

  // 构建完整 prompt
  const userMessage = `${memoryContext}

【今天的日记】
日期: ${new Date(entry.createdAt).toLocaleDateString('zh-CN')}
情绪: ${entry.mood}
内容:
${entry.content}

请以幸福设计师的身份，基于以上对这位朋友的了解，对这篇日记进行评价和幸福指数打分。
请严格按照JSON格式输出，不要使用markdown代码块包裹。`

  try {
    // 使用 OpenAI 兼容协议调用
    const baseUrl = settingsStore.apiUrl.replace(/\/+$/, '')
    const url = `${baseUrl}/chat/completions`
    console.log('[AI评价] 请求URL:', url, '模型:', settingsStore.modelName)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 120秒超时

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settingsStore.apiKey}`,
      },
      body: JSON.stringify({
        model: settingsStore.modelName,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.75,
        max_tokens: 1200,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[AI评价] API返回错误:', response.status, errorText)
      throw new Error(`API 错误 ${response.status}: ${errorText.substring(0, 200)}`)
    }

    const data = await response.json()
    const textContent = data.choices?.[0]?.message?.content || ''
    console.log('[AI评价] API返回内容长度:', textContent.length, '前100字:', textContent.substring(0, 100))

    if (!textContent) {
      console.error('[AI评价] API返回空内容, 完整响应:', JSON.stringify(data).substring(0, 500))
      throw new Error('API 返回空内容')
    }

    // 尝试解析 JSON
    try {
      // 处理可能被 ```json 包裹的情况
      const jsonStr = textContent.replace(/```(?:json)?\s?/g, '').replace(/```\s?$/g, '').trim()
      const parsed = JSON.parse(jsonStr)
      console.log('[AI评价] JSON解析成功, happinessScore:', parsed.happinessScore)
      return {
        content: parsed.content || textContent,
        keywords: parsed.keywords || [],
        encouragement: parsed.encouragement || '',
        summary: parsed.summary || '',
        happinessScore: typeof parsed.happinessScore === 'number' ? parsed.happinessScore : undefined,
        dimensionScores: Array.isArray(parsed.dimensionScores) ? parsed.dimensionScores : undefined,
        generatedAt: new Date().toISOString(),
      }
    } catch (parseErr) {
      console.warn('[AI评价] JSON解析失败, 使用原始文本:', parseErr)
      // 解析失败时返回原始文本
      return {
        content: textContent,
        keywords: extractKeywordsFromText(textContent),
        encouragement: '',
        summary: '',
        generatedAt: new Date().toISOString(),
      }
    }
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError'
    const message = isTimeout ? '请求超时（120秒）' : String(error)
    console.error('[AI评价] 请求失败, 降级为预设:', message)
    // API 出错时降级为预设（标记为降级数据，不会被持久化保存）
    return getFallbackEvaluation(entry)
  }
}

// ========== 降级评价（带日记内容的个性化预设）==========

function getFallbackEvaluation(entry: DiaryEntry): AIEvaluation {
  // 根据情绪和长度选择不同的预设
  const index = (entry.content.length + entry.mood.charCodeAt(0)) % FALLBACK_ENCOURAGEMENTS.length
  const fallback = FALLBACK_ENCOURAGEMENTS[index]

  // 即使没有 API，也更新本地记忆（用于未来分析）
  try {
    let memory = loadMemory()
    memory = processNewDiaryForMemory(memory, entry)
    saveMemory(memory)
  } catch {
    // 忽略
  }

  return {
    ...fallback,
    generatedAt: new Date().toISOString(),
    isFallback: true, // 标记为降级数据，不会被持久化保存
  }
}

// ========== 简单的关键词提取（用于非 AI 场景）==========

function extractKeywordsFromText(text: string): string[] {
  const words = text.match(/[\u4e00-\u9fa5]{2,4}/g) || []
  const freq: Record<string, number> = {}
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w)
}
