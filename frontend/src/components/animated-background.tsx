'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface Particle {
  x: number
  y: number
  speed: number
  size: number
  opacity: number
  char: string
}

const CHARS = ['0', '1', '·', '•', '○', '□']

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles - capped for performance
    const particleCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 15000),
      80 // Max 80 particles for performance
    )
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.3 + Math.random() * 0.5, // Slow
      size: 10 + Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.20, // 15-35% opacity
      char: CHARS[Math.floor(Math.random() * CHARS.length)]
    }))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Subtle color based on theme
      const baseColor = isDark ? '139, 92, 246' : '109, 40, 217' // violet-500 / violet-700

      particlesRef.current.forEach((particle) => {
        // Draw particle
        ctx.font = `${particle.size}px monospace`
        ctx.fillStyle = `rgba(${baseColor}, ${particle.opacity})`
        ctx.fillText(particle.char, particle.x, particle.y)

        // Move particle down
        particle.y += particle.speed

        // Reset if off screen
        if (particle.y > canvas.height + 20) {
          particle.y = -20
          particle.x = Math.random() * canvas.width
          particle.char = CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
      aria-hidden="true"
    />
  )
}
