import { v4 as uuidv4 } from 'uuid'
import type { DiaryImage } from '../types/diary'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_DIMENSION = 1200
const THUMB_SIZE = 200
const COMPRESS_QUALITY = 0.8
const THUMB_QUALITY = 0.6

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImageProcessingError'
  }
}

export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageProcessingError('不支持的图片格式，请上传 JPG、PNG、GIF 或 WebP 格式')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ImageProcessingError('图片大小不能超过 10MB')
  }
}

export async function compressImage(file: File): Promise<DiaryImage> {
  validateImageFile(file)

  const img = await loadImage(file)

  // 计算压缩后的尺寸
  let { width, height } = img
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  // 压缩主图
  const compressedBlob = await canvasToBlob(
    drawToCanvas(img, width, height),
    file.type,
    COMPRESS_QUALITY
  )

  // 生成缩略图
  const thumbRatio = Math.min(THUMB_SIZE / width, THUMB_SIZE / height)
  const thumbWidth = Math.round(width * thumbRatio)
  const thumbHeight = Math.round(height * thumbRatio)
  const thumbnail = drawToCanvas(img, thumbWidth, thumbHeight).toDataURL(
    'image/jpeg',
    THUMB_QUALITY
  )

  return {
    id: uuidv4(),
    data: compressedBlob,
    thumbnail,
    mimeType: file.type,
    size: compressedBlob.size,
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      resolve(img)
    }
    img.onerror = () => reject(new ImageProcessingError('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

function drawToCanvas(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  return canvas
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new ImageProcessingError('图片压缩失败'))
      },
      type,
      quality
    )
  })
}

export function blobToUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}
