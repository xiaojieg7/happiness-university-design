// ========== 幸福设计师多层记忆系统 ==========

// 第一层：用户画像 - 长期积累的性格特点和偏好
export interface UserProfile {
  nickname?: string                    // 用户希望被称呼的名字
  personalityTraits: string[]          // 推断出的性格特点（如：细腻、乐观、内省...）
  interests: string[]                  // 兴趣爱好/关注话题
  writingStyle: '简洁' | '详细' | '感性' | '理性' | '未知'  // 写作风格
  emotionalBaseline: '积极' | '平和' | '敏感' | '波动' | '内省' | '未知'  // 情绪基线
  happinessSources: string[]           // 常见的幸福来源
  challenges: string[]                 // 经常面对的挑战
  goals: string[]                      // 提及的目标和愿望
  importantPeople: string[]            // 提到的重要的人
  significantDates: string[]           // 重要日期备注
  firstDiaryDate?: string              // 第一次写日记的日期
  totalDiaries: number                 // 累计日记数
  updatedAt: string                   // 最后更新时间
}

// 第二层：对话上下文 - 近期的交互记录
export interface ConversationContext {
  recentSummaries: DiarySummary[]       // 最近5篇日记摘要
  lastEvaluationAt?: string             // 上次AI评价的时间
  lastEvaluationTopic?: string          // 上次评价的话题
  ongoingThemes: string[]               // 持续的话题/主题
  recentMoodTrend: string[]             // 最近情绪趋势（最近10次的mood）
  encouragementHistory: string[]        // 最近给过的鼓励（避免重复）
  userReactions: UserReaction[]         // 用户对之前反馈的反应模式
}

export interface DiarySummary {
  id: string
  date: string
  mood: string
  brief: string              // 一句话概括
  keywords: string[]
}

export interface UserReaction {
  diaryId: string
  evaluationSnippet: string
  reactionType: 'positive' | 'neutral' | 'ignored'
}

// 第三层：长期模式 - 数据驱动的洞察
export interface LongTermPatterns {
  moodDistribution: Record<string, number>      // 情绪分布统计
  topKeywords: { word: string; count: number }[]  // 高频关键词
  weeklyFrequency: number                        // 平均每周写日记频率
  happinessDimensions: {
    emotional: number     // 情绪幸福得分 (0-100)
    meaning: number       // 意义幸福得分
    relational: number    // 关系幸福得分
    achievement: number   // 成就幸福得分
    mindfulness: number   // 正念幸福得分
  }
  growthIndicators: GrowthIndicator[]
  seasonalityNotes: string  // 季节性规律备注
  updatedAt: string
}

export interface GrowthIndicator {
  date: string
  type: 'milestone' | 'breakthrough' | 'pattern_shift'
  description: string
}

// 第四层：关系记忆 - 情感连接
export interface RelationshipMemory {
  milestones: Milestone[]
  trustLevel: number                          // 信任度 (0-100)
  daysTogether: number                        // 一起走过的天数
  favoriteEncouragements: string[]            // 用户可能喜欢的鼓励方式
  personalReferences: PersonalReference[]     // 用户分享的个人细节
  promisesMade: string[]                      // 对用户做出的承诺/目标
  celebrations: Celebration[]                 // 一起庆祝的时刻
  lastDeepConversation?: string               // 上次深度对话主题
}

export interface Milestone {
  date: string
  type: 'first_diary' | 'tenth_diary' | 'streak_week' | 'emotional_breakthrough' | 'goal_achieved'
  description: string
  celebrated: boolean
}

export interface PersonalReference {
  category: 'family' | 'work' | 'health' | 'hobby' | 'dream' | 'other'
  content: string
  mentionedAt: string
  importance: 'casual' | 'important' | 'deep'
}

export interface Celebration {
  date: string
  reason: string
  message: string
}

// ====== 完整记忆体 ======
export interface AgentMemory {
  profile: UserProfile
  context: ConversationContext
  patterns: LongTermPatterns
  relationship: RelationshipMemory
  version: number  // 记忆版本号，用于升级
  createdAt: string
  updatedAt: string
}

// 创建空白记忆的工厂函数
export function createEmptyMemory(): AgentMemory {
  const now = new Date().toISOString()
  return {
    profile: {
      personalityTraits: [],
      interests: [],
      writingStyle: '未知',
      emotionalBaseline: '未知',
      happinessSources: [],
      challenges: [],
      goals: [],
      importantPeople: [],
      significantDates: [],
      totalDiaries: 0,
      updatedAt: now,
    },
    context: {
      recentSummaries: [],
      ongoingThemes: [],
      recentMoodTrend: [],
      encouragementHistory: [],
      userReactions: [],
    },
    patterns: {
      moodDistribution: {},
      topKeywords: [],
      weeklyFrequency: 0,
      happinessDimensions: {
        emotional: 50,
        meaning: 50,
        relational: 50,
        achievement: 50,
        mindfulness: 50,
      },
      growthIndicators: [],
      seasonalityNotes: '',
      updatedAt: now,
    },
    relationship: {
      milestones: [],
      trustLevel: 20,  // 初始信任度
      daysTogether: 0,
      favoriteEncouragements: [],
      personalReferences: [],
      promisesMade: [],
      celebrations: [],
    },
    version: 1,
    createdAt: now,
    updatedAt: now,
  }
}
