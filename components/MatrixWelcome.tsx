"use client"

import React, { useEffect, useRef, useState } from 'react'

const MatrixWelcome = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const text = "Välkommen till Halland TechWeek 2024"
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö0123456789'
    const fontSize = Math.max(20, Math.floor(dimensions.width / 50))
    const columns = Math.floor(dimensions.width / fontSize)
    const drops: Drop[] = []

    interface Drop {
      x: number
      y: number
      chars: string[]
      speed: number
      active: boolean
    }

    interface FinalPosition {
      x: number
      y: number
      char: string
      reached: boolean
    }

    // Calculate final positions for each letter
    const finalPositions: FinalPosition[] = text.split('').map((char, index) => ({
      x: (dimensions.width / 2) - ((text.length * fontSize) / 2) + (index * fontSize),
      y: dimensions.height / 2,
      char: char,
      reached: false
    }))

    // Reduce the number of active drops
    const activeDropCount = Math.min(columns, 100)
    for (let i = 0; i < activeDropCount; i++) {
      drops[i] = {
        x: Math.floor(Math.random() * columns) * fontSize,
        y: Math.random() * dimensions.height,
        chars: [characters[Math.floor(Math.random() * characters.length)]],
        speed: Math.random() * 10 + 5,
        active: true
      }
    }

    const gradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height)
    gradient.addColorStop(0, '#000000')
    gradient.addColorStop(1, '#001a1a')

    let allLettersFormed = false

    function draw() {
      if (!ctx) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      ctx.font = `${fontSize}px monospace`

      drops.forEach((drop, i) => {
        if (drop.active && !allLettersFormed) {
          // Draw the trail
          drop.chars.forEach((char, index) => {
            const alpha = (index + 1) / drop.chars.length
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.5})` // Changed to teal/bluish color
            ctx.fillText(char, drop.x, drop.y - index * fontSize)
          })

          const matchingPosition = finalPositions.find(pos => !pos.reached &&
            Math.abs(pos.x - drop.x) < fontSize / 2 &&
            Math.abs(pos.y - drop.y) < fontSize / 2)

          if (matchingPosition) {
            drop.y += (matchingPosition.y - drop.y) * 0.1
            drop.chars[0] = matchingPosition.char
            if (Math.abs(matchingPosition.y - drop.y) < 1) {
              matchingPosition.reached = true
              drop.active = false
            }
          } else if (drop.y > dimensions.height) {
            drop.y = 0
            drop.x = Math.floor(Math.random() * columns) * fontSize
            drop.chars = [characters[Math.floor(Math.random() * characters.length)]]
          } else {
            drop.y += drop.speed
            if (Math.random() > 0.9) {
              drop.chars.unshift(characters[Math.floor(Math.random() * characters.length)])
              if (drop.chars.length > 5) drop.chars.pop()
            }
          }
        }
      })

      // Draw the formed text
      ctx.fillStyle = '#00ffff' // Changed to teal/bluish color
      finalPositions.forEach(pos => {
        if (pos.reached) {
          ctx.fillText(pos.char, pos.x, pos.y)
        }
      })

      allLettersFormed = finalPositions.every(pos => pos.reached)
      if (!allLettersFormed) {
        requestAnimationFrame(draw)
      } else {
        // Ensure all letters are drawn one last time
        finalPositions.forEach(pos => {
          ctx.fillText(pos.char, pos.x, pos.y)
        })
      }
    }

    requestAnimationFrame(draw)
  }, [dimensions])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  )
}

export default MatrixWelcome
