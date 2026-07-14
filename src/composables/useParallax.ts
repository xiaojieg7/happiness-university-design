import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useParallax(speed: number = 0.5) {
  const elementRef = ref<HTMLElement | null>(null)
  let trigger: ScrollTrigger | null = null

  onMounted(() => {
    if (!elementRef.value) return

    // 检查是否启用减弱动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    trigger = ScrollTrigger.create({
      trigger: elementRef.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const yOffset = self.progress * 100 * speed
        gsap.set(elementRef.value!, { y: yOffset })
      },
    })
  })

  onUnmounted(() => {
    trigger?.kill()
  })

  return elementRef
}

export function useScrollReveal() {
  const elementRef = ref<HTMLElement | null>(null)
  let trigger: ScrollTrigger | null = null

  onMounted(() => {
    if (!elementRef.value) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      if (elementRef.value) {
        elementRef.value.style.opacity = '1'
        elementRef.value.style.transform = 'none'
      }
      return
    }

    gsap.set(elementRef.value, { opacity: 0, y: 40 })

    trigger = ScrollTrigger.create({
      trigger: elementRef.value,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(elementRef.value!, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
      },
    })
  })

  onUnmounted(() => {
    trigger?.kill()
  })

  return elementRef
}
