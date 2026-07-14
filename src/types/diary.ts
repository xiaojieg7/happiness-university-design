// 情绪类型
export type MoodType =
  | 'happy'      // 开心
  | 'calm'       // 平静
  | 'grateful'   // 感恩
  | 'excited'    // 激动
  | 'warm'       // 温暖
  | 'hopeful'    // 充满希望
  | 'peaceful'   // 安宁
  | 'inspired'   // 受到启发

// 情绪配置
export interface MoodConfig {
  label: string
  emoji: string
  color: string
}

// 情绪映射
export const MOOD_MAP: Record<MoodType, MoodConfig> = {
  happy: { label: '开心', emoji: '😊', color: 'var(--mood-happy)' },
  calm: { label: '平静', emoji: '😌', color: 'var(--mood-calm)' },
  grateful: { label: '感恩', emoji: '🙏', color: 'var(--mood-grateful)' },
  excited: { label: '激动', emoji: '🎉', color: 'var(--mood-excited)' },
  warm: { label: '温暖', emoji: '🤗', color: 'var(--mood-warm)' },
  hopeful: { label: '希望', emoji: '🌟', color: 'var(--mood-hopeful)' },
  peaceful: { label: '安宁', emoji: '🕊️', color: 'var(--mood-peaceful)' },
  inspired: { label: '启发', emoji: '💡', color: 'var(--mood-inspired)' },
}

// 日记条目
export interface DiaryEntry {
  id: string
  content: string
  mood: MoodType
  imageIds: string[]
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  aiEvaluation?: AIEvaluation
}

// 五维评分
export interface DimensionScore {
  name: string      // 维度名称
  score: number     // 0-100
  comment: string   // 简短点评
}

// AI 评价
export interface AIEvaluation {
  content: string
  generatedAt: string
  keywords: string[]
  encouragement?: string
  happinessScore?: number           // 幸福指数总分 0-100
  dimensionScores?: DimensionScore[] // 五维评分
  summary?: string                   // 一句话总结
  isFallback?: boolean               // 是否为降级预设数据（非真实AI评价）
}

// 图片存储
export interface DiaryImage {
  id: string
  data: Blob
  thumbnail: string
  mimeType: string
  size: number
}

// 新建日记的表单数据
export interface DiaryFormData {
  content: string
  mood: MoodType
  isPrivate: boolean
  images: File[]
}
