import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { DiaryEntry, DiaryFormData, AIEvaluation } from '../types/diary'
import { storage } from '../services/storage'
import { compressImage } from '../services/image-processor'
import { evaluateDiary } from '../services/ai-evaluator'
import { hashPin, verifyPin, hashSecurityAnswer, verifySecurityAnswer } from '../services/crypto'

// 预设密保问题
export const SECURITY_QUESTIONS = [
  '你最难忘的一次旅行是去了哪里？',
  '你童年最好的朋友叫什么名字？',
  '对你影响最大的一本书叫什么？',
  '你最幸福的一道菜是什么？',
  '你的第一个宠物叫什么名字？',
  '你最想去的地方是哪里？',
  '让你最感动的一句话是什么？',
]

export const useDiaryStore = defineStore('diary', () => {
  // ========== State ==========
  const diaries = ref<DiaryEntry[]>([])
  const isUnlocked = ref(false) // 私密日记是否已解锁
  const isLoading = ref(false)
  const hasPin = ref(false)
  const hasSecurityQ = ref(false)

  // ========== Getters ==========
  const sortedDiaries = computed(() =>
    [...diaries.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  )

  const visibleDiaries = computed(() =>
    sortedDiaries.value.filter((d) => !d.isPrivate || isUnlocked.value)
  )

  const privateCount = computed(() => diaries.value.filter((d) => d.isPrivate).length)

  // ========== Actions ==========

  // 初始化
  async function init() {
    isLoading.value = true
    try {
      await storage.init()
      diaries.value = storage.getDiaries()
      hasPin.value = !!storage.getPinHash()
      hasSecurityQ.value = storage.hasSecurityQuestion()

      // 从 IndexedDB 加载每篇日记的 AI 评价
      for (const diary of diaries.value) {
        // 清理之前错误保存的降级数据
        if (diary.aiEvaluation?.isFallback) {
          diary.aiEvaluation = undefined
          storage.saveDiary(diary)
        }
        if (!diary.aiEvaluation) {
          try {
            const evaluation = await storage.getEvaluation(diary.id)
            if (evaluation) {
              // 过滤掉之前错误保存的降级数据
              if (evaluation.isFallback) {
                await storage.deleteEvaluation(diary.id)
              } else {
                diary.aiEvaluation = evaluation
              }
            }
          } catch (e) {
            console.warn('加载评价失败:', diary.id, e)
          }
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  // 保存日记
  async function saveDiary(formData: DiaryFormData): Promise<DiaryEntry> {
    const now = new Date().toISOString()
    const entry: DiaryEntry = {
      id: uuidv4(),
      content: formData.content,
      mood: formData.mood,
      imageIds: [],
      isPrivate: formData.isPrivate,
      createdAt: now,
      updatedAt: now,
    }

    // 处理图片
    for (const file of formData.images) {
      try {
        const image = await compressImage(file)
        await storage.saveImage(image)
        entry.imageIds.push(image.id)
      } catch (error) {
        console.error('图片处理失败:', error)
      }
    }

    // 保存日记
    storage.saveDiary(entry)
    diaries.value = storage.getDiaries()

    // 异步生成 AI 评价
    generateEvaluation(entry)

    return entry
  }

  // 生成 AI 评价
  async function generateEvaluation(entry: DiaryEntry) {
    try {
      console.log('[AI评价] 开始生成评价, diaryId:', entry.id)
      const evaluation = await evaluateDiary(entry)
      console.log('[AI评价] 评价生成成功, isFallback:', evaluation.isFallback, ', content:', evaluation.content?.substring(0, 50))

      const diary = diaries.value.find((d) => d.id === entry.id)
      if (diary) {
        diary.aiEvaluation = evaluation

        // 只有真实AI评价才持久化保存，降级数据只在内存中显示
        if (!evaluation.isFallback) {
          storage.saveDiary(diary)
          await storage.saveEvaluation(entry.id, evaluation)
          console.log('[AI评价] 真实评价已保存到存储')
        } else {
          console.log('[AI评价] 降级数据不保存到存储，等待用户重新生成')
        }
      } else {
        console.warn('[AI评价] 未找到对应日记:', entry.id)
      }
    } catch (error) {
      console.error('[AI评价] 生成失败:', error)
    }
  }

  // 删除日记
  async function deleteDiary(id: string) {
    const diary = diaries.value.find((d) => d.id === id)
    if (diary) {
      // 删除关联图片
      for (const imageId of diary.imageIds) {
        await storage.deleteImage(imageId)
      }
    }
    storage.deleteDiary(id)
    diaries.value = storage.getDiaries()
  }

  // 获取日记
  function getDiary(id: string): DiaryEntry | null {
    return diaries.value.find((d) => d.id === id) || null
  }

  // ========== PIN 码管理 ==========

  // 设置 PIN 码
  async function setPin(pin: string) {
    const hash = await hashPin(pin)
    storage.savePinHash(hash)
    hasPin.value = true
    isUnlocked.value = true
  }

  // 验证 PIN 码
  async function verifyPinCode(pin: string): Promise<boolean> {
    const storedHash = storage.getPinHash()
    if (!storedHash) return false

    const isValid = await verifyPin(pin, storedHash)
    if (isValid) {
      isUnlocked.value = true
    }
    return isValid
  }

  // 锁定私密日记
  function lockPrivate() {
    isUnlocked.value = false
  }

  // 修改 PIN 码（需要验证旧 PIN）
  async function changePin(oldPin: string, newPin: string): Promise<boolean> {
    const isValid = await verifyPinCode(oldPin)
    if (!isValid) return false

    const hash = await hashPin(newPin)
    storage.savePinHash(hash)
    return true
  }

  // ========== 密保问题管理 ==========

  // 设置密保问题
  async function setSecurityQuestion(question: string, answer: string) {
    const answerHash = await hashSecurityAnswer(answer)
    storage.saveSecurityQuestion(question, answerHash)
    hasSecurityQ.value = true
  }

  // 验证密保答案
  async function verifySecurityAnswerCode(answer: string): Promise<boolean> {
    const storedHash = storage.getSecurityAnswerHash()
    if (!storedHash) return false
    return verifySecurityAnswer(answer, storedHash)
  }

  // 通过密保问题重置 PIN 码（不删除私密日记）
  async function resetPinViaSecurityQuestion(answer: string, newPin: string): Promise<boolean> {
    const isValid = await verifySecurityAnswerCode(answer)
    if (!isValid) return false

    // 设置新 PIN
    const hash = await hashPin(newPin)
    storage.savePinHash(hash)
    hasPin.value = true
    isUnlocked.value = true
    return true
  }

  // 获取密保问题文本
  function getSecurityQuestion(): string | null {
    return storage.getSecurityQuestion()
  }

  // 彻底重置 PIN 码（忘记密码且无密保问题时使用）
  // 会将所有私密日记转为公开
  async function resetPin() {
    const pinHash = storage.getPinHash()
    if (!pinHash) return

    // 将所有私密日记转为公开
    const updatedDiaries = diaries.value.map((d) => {
      if (d.isPrivate) {
        const updated = { ...d, isPrivate: false }
        storage.saveDiary(updated)
        return updated
      }
      return d
    })
    diaries.value = updatedDiaries

    // 清除 PIN 码和密保问题
    storage.clearPinHash()
    storage.clearSecurityQuestion()
    hasPin.value = false
    hasSecurityQ.value = false
    isUnlocked.value = false
  }

  // 获取图片
  async function getImage(imageId: string) {
    return storage.getImage(imageId)
  }

  // 加载单篇日记的评价（从 IndexedDB）
  async function loadEvaluation(id: string) {
    const diary = diaries.value.find((d) => d.id === id)
    if (!diary) return
    if (diary.aiEvaluation) return // 已有评价不重复加载
    try {
      const evaluation = await storage.getEvaluation(id)
      if (evaluation) {
        diary.aiEvaluation = evaluation
      }
    } catch (e) {
      console.warn('加载评价失败:', id, e)
    }
  }

  // 手动生成评价并保存
  async function generateAndSaveEvaluation(id: string): Promise<AIEvaluation | null> {
    const diary = diaries.value.find((d) => d.id === id)
    if (!diary) return null
    try {
      const evaluation = await evaluateDiary(diary)
      diary.aiEvaluation = evaluation

      // 只有真实AI评价才持久化保存
      if (!evaluation.isFallback) {
        storage.saveDiary(diary)
        await storage.saveEvaluation(id, evaluation)
        console.log('[AI评价] 手动生成真实评价已保存')
      } else {
        console.log('[AI评价] 手动生成降级数据不保存')
      }

      return evaluation
    } catch (error) {
      console.error('[AI评价] 手动生成失败:', error)
      return null
    }
  }

  return {
    // State
    diaries,
    isUnlocked,
    isLoading,
    hasPin,
    hasSecurityQ,
    // Getters
    sortedDiaries,
    visibleDiaries,
    privateCount,
    // Actions
    init,
    saveDiary,
    deleteDiary,
    getDiary,
    setPin,
    verifyPinCode,
    lockPrivate,
    changePin,
    setSecurityQuestion,
    verifySecurityAnswerCode,
    resetPinViaSecurityQuestion,
    getSecurityQuestion,
    resetPin,
    getImage,
    loadEvaluation,
    generateAndSaveEvaluation,
  }
})
