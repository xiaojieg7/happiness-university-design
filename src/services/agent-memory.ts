/**
 * 幸福设计师多层记忆系统
 *
 * 四层架构：
 *   Layer 1 - 用户画像 (UserProfile): 长期积累的性格特点和偏好
 *   Layer 2 - 对话上下文 (ConversationContext): 近期交互和话题
 *   Layer 3 - 长期模式 (LongTermPatterns): 数据驱动的洞察
 *   Layer 4 - 关系记忆 (RelationshipMemory): 情感连接和信任
 */

import type {
  AgentMemory,
  UserProfile,
  DiarySummary,
} from '../types/memory'
import { createEmptyMemory } from '../types/memory'
import type { DiaryEntry, MoodType } from '../types/diary'

const MEMORY_STORAGE_KEY = 'happiness-agent-memory'
const MAX_RECENT_SUMMARIES = 5
const MAX_MOOD_TREND = 10
const MAX_KEYWORDS = 30

// ========== 基础 CRUD ==========

export function loadMemory(): AgentMemory {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY)
    if (!raw) return createEmptyMemory()
    const parsed = JSON.parse(raw)
    // 版本迁移：如果缺少字段，用默认值填充
    return { ...createEmptyMemory(), ...parsed }
  } catch {
    return createEmptyMemory()
  }
}

export function saveMemory(memory: AgentMemory): void {
  try {
    memory.updatedAt = new Date().toISOString()
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory))
  } catch (e) {
    console.error('保存记忆失败:', e)
  }
}

export function clearMemory(): void {
  localStorage.removeItem(MEMORY_STORAGE_KEY)
}

// ========== Layer 1: 用户画像更新 ==========

function extractKeywords(text: string): string[] {
  // 简单的关键词提取（中文常用词过滤）
  const stopWords = new Set([
    '的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都',
    '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会',
    '着', '没有', '看', '好', '自己', '这', '那', '她', '他', '它',
    '们', '什么', '这个', '那个', '这样', '那样', '因为', '所以',
    '但是', '然后', '可以', '觉得', '知道', '现在', '今天', '明天',
    '昨天', '时候', '如果', '让', '把', '被', '对', '从', '与', '或',
    '及', '等', '比', '更', '最', '已', '以', '为', '之', '于',
  ])

  // 提取2-4字的词语
  const words = text.match(/[\u4e00-\u9fa5]{2,4}/g) || []
  const freq: Record<string, number> = {}

  for (const word of words) {
    if (!stopWords.has(word)) {
      freq[word] = (freq[word] || 0) + 1
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)
}

function inferMoodFromContent(content: string): UserProfile['emotionalBaseline'] {
  const positiveWords = ['开心', '快乐', '幸福', '满足', '感激', '温暖', '爱', '美好', '棒', '喜欢']
  const calmWords = ['平静', '安宁', '放松', '舒适', '悠闲', '宁静', '惬意']
  const reflectiveWords = ['思考', '感悟', '成长', '学习', '理解', '发现', '觉察']

  let positive = 0, calm = 0, reflective = 0

  for (const word of positiveWords) {
    if (content.includes(word)) positive++
  }
  for (const word of calmWords) {
    if (content.includes(word)) calm++
  }
  for (const word of reflectiveWords) {
    if (content.includes(word)) reflective++
  }

  if (positive >= calm && positive >= reflective) return '积极'
  if (calm >= reflective) return '平和'
  return '内省'
}

function inferWritingStyle(entries: DiaryEntry[]): UserProfile['writingStyle'] {
  if (entries.length < 3) return '未知'

  const avgLength = entries.reduce((sum, e) => sum + e.content.length, 0) / entries.length
  if (avgLength < 80) return '简洁'
  if (avgLength > 300) return '详细'

  // 检查情感词汇密度
  const emotionalWords = ['感觉', '心情', '情绪', '感动', '温暖', '幸福', '难过', '开心']
  const emotionalCount = entries.filter((e) =>
    emotionalWords.some((w) => e.content.includes(w))
  ).length

  return emotionalCount > entries.length / 2 ? '感性' : '理性'
}

export function updateUserProfile(memory: AgentMemory, entry: DiaryEntry): AgentMemory {
  const profile = { ...memory.profile }

  // 更新日记计数
  profile.totalDiaries += 1
  if (!profile.firstDiaryDate) {
    profile.firstDiaryDate = entry.createdAt
  }

  // 提取关键词并更新兴趣/幸福来源
  const keywords = extractKeywords(entry.content)

  // 更新兴趣标签（合并去重）
  for (const kw of keywords.slice(0, 5)) {
    if (!profile.interests.includes(kw)) {
      profile.interests.push(kw)
    }
  }
  profile.interests = profile.interests.slice(0, 20)

  // 推断性格特点
  if (entry.content.includes('感恩') || entry.content.includes('感谢')) {
    if (!profile.personalityTraits.includes('懂得感恩')) {
      profile.personalityTraits.push('懂得感恩')
    }
  }
  if (entry.content.length > 200 && !profile.personalityTraits.includes('细腻')) {
    profile.personalityTraits.push('细腻')
  }
  if (/思考|反思|觉察|发现/.test(entry.content)) {
    if (!profile.personalityTraits.includes('善于内省')) {
      profile.personalityTraits.push('善于内省')
    }
  }
  if (/家人|朋友|陪伴|一起/.test(entry.content)) {
    if (!profile.personalityTraits.includes('重视关系')) {
      profile.personalityTraits.push('重视关系')
    }
  }

  profile.personalityTraits = profile.personalityTraits.slice(0, 8)

  // 推断情绪基线
  if (profile.totalDiaries >= 3) {
    profile.emotionalBaseline = inferMoodFromContent(entry.content)
  }

  // 推断写作风格（基于已有日记）
  profile.writingStyle = inferWritingStyle(
    [] as unknown as DiaryEntry[], // 实际使用时从 store 获取完整列表
  )

  profile.updatedAt = new Date().toISOString()

  return { ...memory, profile }
}

// ========== Layer 2: 对话上下文更新 ==========

function generateBrief(content: string, maxLength = 60): string {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '...'
}

export function updateConversationContext(memory: AgentMemory, entry: DiaryEntry): AgentMemory {
  const context = { ...memory.context }

  // 添加日记摘要到最近记录
  const summary: DiarySummary = {
    id: entry.id,
    date: entry.createdAt,
    mood: entry.mood,
    brief: generateBrief(entry.content),
    keywords: extractKeywords(entry.content).slice(0, 3),
  }

  context.recentSummaries = [summary, ...context.recentSummaries].slice(0, MAX_RECENT_SUMMARIES)

  // 更新情绪趋势
  context.recentMoodTrend = [entry.mood, ...context.recentMoodTrend].slice(0, MAX_MOOD_TREND)

  // 更新持续话题（从关键词中提取）
  const allRecentKeywords = context.recentSummaries.flatMap((s) => s.keywords)
  const keywordFreq: Record<string, number> = {}
  for (const kw of allRecentKeywords) {
    keywordFreq[kw] = (keywordFreq[kw] || 0) + 1
  }
  context.ongoingThemes = Object.entries(keywordFreq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, 5)

  context.lastEvaluationTopic = generateBrief(entry.content, 40)

  return { ...memory, context }
}

// ========== Layer 3: 长期模式更新 ==========

export function updateLongTermPatterns(memory: AgentMemory, entry: DiaryEntry): AgentMemory {
  const patterns = { ...memory.patterns }

  // 更新情绪分布
  patterns.moodDistribution = { ...patterns.moodDistribution }
  patterns.moodDistribution[entry.mood] = (patterns.moodDistribution[entry.mood] || 0) + 1

  // 更新高频关键词
  const keywords = extractKeywords(entry.content)
  const existingMap = new Map(patterns.topKeywords.map((k) => [k.word, k.count]))
  for (const kw of keywords) {
    existingMap.set(kw, (existingMap.get(kw) || 0) + 1)
  }
  patterns.topKeywords = Array.from(existingMap.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_KEYWORDS)

  // 计算周频率
  if (memory.profile.firstDiaryDate) {
    const firstDate = new Date(memory.profile.firstDiaryDate)
    const now = new Date()
    const weeksDiff = Math.max(1, Math.ceil((now.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)))
    patterns.weeklyFrequency = Math.round((memory.profile.totalDiaries / weeksDiff) * 10) / 10
  }

  // 根据情绪更新五维得分
  const moodDimensionMap: Partial<Record<MoodType, 'emotional' | 'meaning' | 'relational' | 'achievement' | 'mindfulness'>> = {
    happy: 'emotional',
    grateful: 'emotional',
    excited: 'emotional',
    calm: 'mindfulness',
    peaceful: 'mindfulness',
    warm: 'relational',
    inspired: 'meaning',
    hopeful: 'achievement',
  }

  const dim = moodDimensionMap[entry.mood]
  if (dim) {
    patterns.happinessDimensions = { ...patterns.happinessDimensions }
    const current = patterns.happinessDimensions[dim]
    // 平滑递增，最高100
    patterns.happinessDimensions[dim] = Math.min(100, current + 3)
  }

  // 所有维度随时间缓慢增长（代表用户坚持写日记的成长）
  if (memory.profile.totalDiaries % 7 === 0) {
    // 每7篇日记，所有维度微增
    patterns.happinessDimensions = { ...patterns.happinessDimensions }
    for (const key of Object.keys(patterns.happinessDimensions) as Array<'emotional' | 'meaning' | 'relational' | 'achievement' | 'mindfulness'>) {
      patterns.happinessDimensions[key] = Math.min(100, patterns.happinessDimensions[key] + 1)
    }
  }

  // 检测里程碑
  const milestones = [...patterns.growthIndicators]
  if (memory.profile.totalDiaries === 1) {
    milestones.push({
      date: entry.createdAt,
      type: 'milestone' as const,
      description: '写下第一篇幸福日记，开启了自我探索之旅 🌱',
    })
  } else if (memory.profile.totalDiaries === 10) {
    milestones.push({
      date: entry.createdAt,
      type: 'milestone' as const,
      description: '累计写了10篇日记！你正在养成幸福的习惯 ✨',
    })
  } else if (memory.profile.totalDiaries === 30) {
    milestones.push({
      date: entry.createdAt,
      type: 'milestone' as const,
      description: '30天！一个月的幸福练习，你已经走得很远了 🏔️',
    })
  } else if (memory.profile.totalDiaries === 100) {
    milestones.push({
      date: entry.createdAt,
      type: 'milestone' as const,
      description: '百篇日记！你是真正的幸福践行者 🎉',
    })
  }

  patterns.growthIndicators = milestones
  patterns.updatedAt = new Date().toISOString()

  return { ...memory, patterns }
}

// ========== Layer 4: 关系记忆更新 ==========

export function updateRelationshipMemory(memory: AgentMemory, entry: DiaryEntry): AgentMemory {
  const rel = { ...memory.relationship }

  // 更新在一起的天数
  if (memory.profile.firstDiaryDate) {
    const firstDate = new Date(memory.profile.firstDiaryDate)
    const now = new Date()
    rel.daysTogether = Math.floor((now.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000))
  }

  // 信任度随互动增加（每篇日记+1，最高95）
  rel.trustLevel = Math.min(95, rel.trustLevel + 1)

  // 提取个人细节引用
  const personalRefs = [...rel.personalReferences]

  // 检测家庭成员提及
  if (/爸爸|妈妈|父亲|母亲|哥哥|姐姐|弟弟|妹妹|孩子|儿子|女儿|家人|家庭/.test(entry.content)) {
    personalRefs.push({
      category: 'family',
      content: '在日记中提到了家人/家庭',
      mentionedAt: entry.createdAt,
      importance: entry.content.length > 150 ? 'important' : 'casual',
    })
  }

  // 检测工作相关
  if (/工作|公司|同事|老板|项目|任务|加班|升职|加薪|辞职/.test(entry.content)) {
    personalRefs.push({
      category: 'work',
      content: '在日记中提到了工作',
      mentionedAt: entry.createdAt,
      importance: 'casual',
    })
  }

  // 检测健康相关
  if (/健康|运动|跑步|健身|睡眠|休息|生病|身体|锻炼|瑜伽|冥想/.test(entry.content)) {
    personalRefs.push({
      category: 'health',
      content: '在日记中关注了健康话题',
      mentionedAt: entry.createdAt,
      importance: entry.content.includes('运动') || entry.content.includes('跑步') ? 'important' : 'casual',
    })
  }

  // 检测梦想/目标
  if (/梦想|目标|希望|愿望|计划|想要|成为|未来|理想/.test(entry.content)) {
    personalRefs.push({
      category: 'dream',
      content: '在日记中分享了梦想或目标',
      mentionedAt: entry.createdAt,
      importance: 'deep',
    })
  }

  // 只保留最近的20条引用
  rel.personalReferences = personalRefs.slice(-20)

  // 检测是否需要庆祝
  if (memory.profile.totalDiaries === 1 || memory.profile.totalDiaries % 30 === 0) {
    rel.celebrations.push({
      date: new Date().toISOString(),
      reason: `第${memory.profile.totalDiaries}篇日记`,
      message: `这是你的第${memory.profile.totalDiaries}篇幸福日记！每一篇都是珍贵的时刻 💝`,
    })
  }

  return { ...memory, relationship: rel }
}

// ========== 统一入口：处理新日记时更新全部记忆层 ==========

export function processNewDiaryForMemory(memory: AgentMemory, entry: DiaryEntry): AgentMemory {
  let updated = updateUserProfile(memory, entry)
  updated = updateConversationContext(updated, entry)
  updated = updateLongTermPatterns(updated, entry)
  updated = updateRelationshipMemory(updated, entry)
  return updated
}

// ========== 构建给 AI 的记忆提示词 ==========

export function buildMemoryPrompt(memory: AgentMemory): string {
  const { profile, context, patterns, relationship } = memory

  const parts: string[] = []

  // 第一层：用户画像
  if (profile.totalDiaries > 0) {
    parts.push(`【关于这位朋友】`)
    parts.push(`TA已经写了 ${profile.totalDiaries} 篇幸福日记，我们一起走了 ${relationship.daysTogether} 天。`)

    if (profile.personalityTraits.length > 0) {
      parts.push(`TA的性格特点：${profile.personalityTraits.join('、')}。`)
    }
    if (profile.writingStyle !== '未知') {
      parts.push(`TA的表达风格偏${profile.writingStyle}。`)
    }
    if (profile.emotionalBaseline !== '未知') {
      parts.push(`整体来看，TA的情绪基调偏向${profile.emotionalBaseline}。`)
    }
    if (profile.interests.length > 0) {
      parts.push(`TA常关注的话题：${profile.interests.slice(0, 8).join('、')}。`)
    }
  }

  // 第二层：近期上下文
  if (context.recentSummaries.length > 0) {
    parts.push(`\n【最近在聊什么】`)
    for (const s of context.recentSummaries.slice(0, 3)) {
      parts.push(`- ${s.date.split('T')[0]} [${s.mood}] ${s.brief}`)
    }
    if (context.ongoingThemes.length > 0) {
      parts.push(`最近反复出现的话题：${context.ongoingThemes.join('、')}`)
    }
  }

  // 第三层：长期洞察
  if (patterns.weeklyFrequency > 0) {
    parts.push(`\n【长期观察】`)
    parts.push(`平均每周写 ${patterns.weeklyFrequency} 篇日记。`)
    if (Object.keys(patterns.moodDistribution).length > 0) {
      const topMood = Object.entries(patterns.moodDistribution).sort((a, b) => b[1] - a[1])[0]
      if (topMood) {
        parts.push(`最常见的情绪是「${topMood[0]}」（出现 ${topMood[1]} 次）。`)
      }
    }
    if (patterns.topKeywords.length > 0) {
      parts.push(`TA笔下最高频的词：${patterns.topKeywords.slice(0, 6).map((k) => k.word).join('、')}`)
    }
  }

  // 第四层：关系与信任
  if (relationship.trustLevel > 20) {
    parts.push(`\n【我们的关系】`)
    parts.push(`信任度：${relationship.trustLevel}/100。`)

    if (relationship.personalReferences.length > 0) {
      const deepRefs = relationship.personalReferences.filter((r) => r.importance === 'deep').slice(0, 2)
      if (deepRefs.length > 0) {
        parts.push(`TA曾分享过内心深处的事情——这代表着很大的信任。`)
      }
    }

    // 里程碑提醒
    const uncelebrated = patterns.growthIndicators.filter(
      (g) => !relationship.milestones.some((m) => m.description === g.description)
    )
    if (uncelebrated.length > 0) {
      parts.push(`值得注意的里程碑：${uncelebrated[0].description}`)
    }
  }

  return parts.join('\n')
}
