"use client"

import { useEffect, useRef } from "react"

interface SwipeInput {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function useSwipe(input: SwipeInput) {
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef(0)
  const touchEndY = useRef(0)
  const { threshold = 50 } = input

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX
    touchStartY.current = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX
    touchEndY.current = e.changedTouches[0].screenY
    handleSwipe()
  }

  const handleSwipe = () => {
    const diffX = touchStartX.current - touchEndX.current
    const diffY = touchStartY.current - touchEndY.current

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > threshold) {
        input.onSwipeLeft?.()
      } else if (diffX < -threshold) {
        input.onSwipeRight?.()
      }
    } else {
      if (diffY > threshold) {
        input.onSwipeUp?.()
      } else if (diffY < -threshold) {
        input.onSwipeDown?.()
      }
    }
  }

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, false)
    document.addEventListener("touchend", handleTouchEnd, false)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart, false)
      document.removeEventListener("touchend", handleTouchEnd, false)
    }
  }, [input])
}
