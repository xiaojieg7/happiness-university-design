import type { DiaryEntry, DiaryImage, AIEvaluation } from '../types/diary'

const DB_NAME = 'HappinessDiaryDB'
const DB_VERSION = 1
const STORAGE_KEY = 'happiness_diary_entries'
const PIN_HASH_KEY = 'happiness_pin_hash'
const SECURITY_Q_KEY = 'happiness_security_question'
const SECURITY_A_KEY = 'happiness_security_answer_hash'

class DiaryStorage {
  private db: IDBDatabase | null = null

  // ========== IndexedDB 初始化 ==========
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('evaluations')) {
          db.createObjectStore('evaluations', { keyPath: 'diaryId' })
        }
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onerror = () => reject(request.error)
    })
  }

  // ========== 日记 CRUD (localStorage) ==========
  getDiaries(): DiaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      const entries = JSON.parse(data) as DiaryEntry[]
      return entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch {
      return []
    }
  }

  getDiary(id: string): DiaryEntry | null {
    const diaries = this.getDiaries()
    return diaries.find((d) => d.id === id) || null
  }

  saveDiary(entry: DiaryEntry): void {
    const diaries = this.getDiaries()
    const existingIndex = diaries.findIndex((d) => d.id === entry.id)
    if (existingIndex >= 0) {
      diaries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() }
    } else {
      diaries.unshift(entry)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries))
  }

  deleteDiary(id: string): void {
    const diaries = this.getDiaries().filter((d) => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diaries))
  }

  // ========== 图片操作 (IndexedDB) ==========
  async saveImage(image: DiaryImage): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('images', 'readwrite')
      const store = tx.objectStore('images')
      const request = store.put(image)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getImage(id: string): Promise<DiaryImage | null> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('images', 'readonly')
      const store = tx.objectStore('images')
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('images', 'readwrite')
      const store = tx.objectStore('images')
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // ========== AI 评价 (IndexedDB) ==========
  async saveEvaluation(diaryId: string, evaluation: AIEvaluation): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('evaluations', 'readwrite')
      const store = tx.objectStore('evaluations')
      const request = store.put({ diaryId, ...evaluation })
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getEvaluation(diaryId: string): Promise<AIEvaluation | null> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('evaluations', 'readonly')
      const store = tx.objectStore('evaluations')
      const request = store.get(diaryId)
      request.onsuccess = () => {
        const result = request.result
        if (result) {
          resolve({
            content: result.content,
            generatedAt: result.generatedAt,
            keywords: result.keywords || [],
            encouragement: result.encouragement || '',
            happinessScore: result.happinessScore,
            dimensionScores: result.dimensionScores,
            summary: result.summary || '',
          })
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // ========== PIN 码 (localStorage) ==========
  getPinHash(): string | null {
    return localStorage.getItem(PIN_HASH_KEY)
  }

  savePinHash(hash: string): void {
    localStorage.setItem(PIN_HASH_KEY, hash)
  }

  clearPinHash(): void {
    localStorage.removeItem(PIN_HASH_KEY)
  }

  // ========== 密保问题 (localStorage) ==========
  getSecurityQuestion(): string | null {
    return localStorage.getItem(SECURITY_Q_KEY)
  }

  getSecurityAnswerHash(): string | null {
    return localStorage.getItem(SECURITY_A_KEY)
  }

  saveSecurityQuestion(question: string, answerHash: string): void {
    localStorage.setItem(SECURITY_Q_KEY, question)
    localStorage.setItem(SECURITY_A_KEY, answerHash)
  }

  clearSecurityQuestion(): void {
    localStorage.removeItem(SECURITY_Q_KEY)
    localStorage.removeItem(SECURITY_A_KEY)
  }

  hasSecurityQuestion(): boolean {
    return !!localStorage.getItem(SECURITY_Q_KEY) && !!localStorage.getItem(SECURITY_A_KEY)
  }
}

export const storage = new DiaryStorage()
