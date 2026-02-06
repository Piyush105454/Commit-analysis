'use client'
import { useEffect, useRef } from 'react'

export default function LineChart({ 
  data = [], 
  width = 400, 
  height = 200, 
  color = '#3B82F6',
  gradient = true,
  animated = true,
  className = ''
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data.length) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    // Set canvas size
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length === 0) return

    // Calculate dimensions
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min/max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // Create points
    const points = data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * chartWidth,
      y: padding + chartHeight - ((d.value - minValue) / valueRange) * chartHeight
    }))

    // Animation function
    let progress = animated ? 0 : 1
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw gradient background
      if (gradient) {
        const gradientFill = ctx.createLinearGradient(0, padding, 0, height - padding)
        gradientFill.addColorStop(0, color + '20')
        gradientFill.addColorStop(1, color + '05')
        
        ctx.beginPath()
        ctx.moveTo(points[0].x, height - padding)
        
        for (let i = 0; i < points.length * progress; i++) {
          const point = points[i]
          if (point) ctx.lineTo(point.x, point.y)
        }
        
        ctx.lineTo(points[Math.floor((points.length - 1) * progress)].x, height - padding)
        ctx.closePath()
        ctx.fillStyle = gradientFill
        ctx.fill()
      }

      // Draw line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      
      for (let i = 1; i < points.length * progress; i++) {
        const point = points[i]
        if (point) ctx.lineTo(point.x, point.y)
      }
      
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Draw points
      points.slice(0, Math.floor(points.length * progress)).forEach((point, i) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
      })

      if (animated && progress < 1) {
        progress += 0.02
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data, width, height, color, gradient, animated])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{ width, height }}
      />
      
      {/* Tooltip overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {data.map((item, index) => (
          <div
            key={index}
            className="absolute opacity-0 hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded text-xs"
            style={{
              left: `${(index / (data.length - 1)) * 100}%`,
              top: '10px',
              transform: 'translateX(-50%)'
            }}
          >
            {item.label}: {item.value}
          </div>
        ))}
      </div>
    </div>
  )
}