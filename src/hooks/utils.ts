import { useState, useRef, useCallback, useEffect } from 'react'

import * as dat from 'dat.gui'
import Stats from 'stats.js'

export const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<ReturnType<typeof requestAnimationFrame>>()

  // callback関数に変更があった場合のみanimateを再生成する
  const animate = useCallback(() => {
    callback()
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  // callback関数に変更があった場合は一度破棄して再度呼び出す
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        return cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}

export const useGui = (rot: number, bounce: number) => {
  const [rotationSpeed, setRotationSpeed] = useState(rot)
  const [bouncingSpeed, setBouncingSpeed] = useState(bounce)

  useEffect(() => {
    const gui = new dat.GUI()
    gui.add({ rotationSpeed }, 'rotationSpeed', 0, 0.5).onChange((v) => setRotationSpeed(v))
    gui.add({ bouncingSpeed }, 'bouncingSpeed', 0, 0.5).onChange((v) => setBouncingSpeed(v))

    return () => {
      gui.destroy()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { rotationSpeed, bouncingSpeed }
}

export const myStats = () => {
  const s = new Stats()
  s.showPanel(0)
  s.dom.style.position = 'absolute'
  s.dom.style.left = '0px'
  s.dom.style.top = '48px'

  return s
}

export const useDebounce = (callback: () => void, ms: number) => {
  const timerRef = useRef<number>(0)

  const debounce = useCallback(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      callback()
    }, ms)
  }, [callback, ms])

  return debounce
}
