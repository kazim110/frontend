import { useEffect, useRef } from 'react'

const HORIZONTAL_PASSES = 3
const VERTICAL_GAP = 48

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function LandingEffects() {
  const cometRef = useRef(null)
  const trailGlowRef = useRef(null)
  const trailCoreRef = useRef(null)
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)

  useEffect(() => {
    const comet = cometRef.current
    const trailGlow = trailGlowRef.current
    const trailCore = trailCoreRef.current
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    let frameId = 0
    let cursorFrameId = 0
    let cursorVisible = false
    const pointer = { x: -100, y: -100 }
    const follower = { x: -100, y: -100 }

    function updateComet() {
      frameId = 0

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      )
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)
      const sidePadding = clamp(window.innerWidth * 0.1, 64, 140)
      const centerX = window.innerWidth / 2
      const amplitude = Math.max(centerX - sidePadding, 0)
      const curvePosition = progress * HORIZONTAL_PASSES * Math.PI
      const x = centerX - amplitude * Math.cos(curvePosition)
      const travelHeight = Math.max(window.innerHeight - VERTICAL_GAP * 2, 0)
      const y = VERTICAL_GAP + travelHeight * progress

      // The tangent of the sine path gives the comet a smooth turn at both sides.
      const horizontalSlope =
        amplitude * HORIZONTAL_PASSES * Math.PI * Math.sin(curvePosition)
      const angle = Math.atan2(travelHeight, horizontalSlope) * (180 / Math.PI)

      // Draw the travelled part of the curve. Its first point always stays
      // anchored at the top-left starting position.
      const sampleCount = Math.max(Math.ceil(progress * 90), 1)
      const points = []

      for (let index = 0; index <= sampleCount; index += 1) {
        const sampleProgress = progress * (index / sampleCount)
        const sampleCurve = sampleProgress * HORIZONTAL_PASSES * Math.PI
        const sampleX = centerX - amplitude * Math.cos(sampleCurve)
        const sampleY = VERTICAL_GAP + travelHeight * sampleProgress
        points.push(`${index === 0 ? 'M' : 'L'} ${sampleX.toFixed(2)} ${sampleY.toFixed(2)}`)
      }

      comet.style.setProperty('--comet-x', `${x}px`)
      comet.style.setProperty('--comet-y', `${y}px`)
      comet.style.setProperty('--comet-angle', `${angle}deg`)
      const path = points.join(' ')
      trailGlow.setAttribute('d', path)
      trailCore.setAttribute('d', path)
    }

    function scheduleUpdate() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateComet)
      }
    }

    function animateCursor() {
      const easing = 0.16
      follower.x += (pointer.x - follower.x) * easing
      follower.y += (pointer.y - follower.y) * easing

      cursor.style.setProperty('--cursor-x', `${follower.x}px`)
      cursor.style.setProperty('--cursor-y', `${follower.y}px`)
      cursorDot.style.setProperty('--cursor-x', `${pointer.x}px`)
      cursorDot.style.setProperty('--cursor-y', `${pointer.y}px`)

      if (
        cursorVisible &&
        (Math.abs(pointer.x - follower.x) > 0.05 || Math.abs(pointer.y - follower.y) > 0.05)
      ) {
        cursorFrameId = window.requestAnimationFrame(animateCursor)
      } else {
        cursorFrameId = 0
      }
    }

    function handlePointerMove(event) {
      pointer.x = event.clientX
      pointer.y = event.clientY

      if (!cursorVisible) {
        cursorVisible = true
        follower.x = event.clientX
        follower.y = event.clientY
        cursor.classList.add('is-visible')
        cursorDot.classList.add('is-visible')
      }

      const interactive = event.target.closest(
        'a, button, input, textarea, select, [role="button"]',
      )
      cursor.classList.toggle('is-interactive', Boolean(interactive))

      if (!cursorFrameId) {
        cursorFrameId = window.requestAnimationFrame(animateCursor)
      }
    }

    function handlePointerLeave() {
      cursorVisible = false
      cursor.classList.remove('is-visible', 'is-interactive')
      cursorDot.classList.remove('is-visible')
    }

    frameId = window.requestAnimationFrame(updateComet)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      window.cancelAnimationFrame(frameId)
      window.cancelAnimationFrame(cursorFrameId)
    }
  }, [])

  return (
    <>
      <div className="landing-effects" aria-hidden="true">
        <svg className="scroll-comet-trail" width="100%" height="100%">
          <defs>
            <linearGradient id="comet-trail-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f97316" stopOpacity="0.08" />
              <stop offset="0.68" stopColor="#fb923c" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff7ed" stopOpacity="0.95" />
            </linearGradient>
            <filter id="comet-trail-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path className="comet-trail-glow" ref={trailGlowRef} />
          <path className="comet-trail-core" ref={trailCoreRef} />
        </svg>
        <div className="scroll-comet" ref={cometRef}>
          <span className="scroll-comet-halo" />
          <span className="scroll-comet-shard" />
          <span className="scroll-comet-core" />
        </div>
      </div>
      <div className="mouse-effects" aria-hidden="true">
        <span className="mouse-follower" ref={cursorRef} />
        <span className="mouse-dot" ref={cursorDotRef} />
      </div>
    </>
  )
}

export default LandingEffects
