import { useState, useRef, useCallback, useEffect } from 'react'

import * as dat from 'dat.gui'
import Stats from 'stats.js'
import * as THREE from 'three'

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

export const debounce = (callback: () => void, ms: number) => {
  let timer = 0

  return () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      callback()
    }, ms)
  }
}

// Hook: 画面を表示後にカメラの種類を替えない場合
export const useWindowResize = (
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  interval: number,
) => {
  const onResize = () => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = window.innerWidth / (window.innerHeight - 48)
    } else if (camera instanceof THREE.OrthographicCamera) {
      // TODO: リサイズするとオブジェクトのアスペクト比がおかしくなる
      camera.left = window.innerWidth / -16
      camera.right = window.innerWidth / 16
      camera.top = (window.innerHeight - 48) / 16
      camera.bottom = (window.innerHeight - 48) / -16
    } else {
    }
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
  }

  const debounced = debounce(onResize, interval)
  useEffect(() => {
    window.addEventListener('resize', debounced, false)
    return () => {
      window.removeEventListener('resize', debounced, false)
    }
  }, [debounced])
}

// without Hook: 画面を表示後にカメラを切り替えることがある場合
export const windowResize = (
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  interval: number,
) => {
  const onResize = () => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = window.innerWidth / (window.innerHeight - 48)
    } else if (camera instanceof THREE.OrthographicCamera) {
      camera.left = window.innerWidth / -16
      camera.right = window.innerWidth / 16
      camera.top = (window.innerHeight - 48) / 16
      camera.bottom = (window.innerHeight - 48) / -16
    } else {
    }
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
  }

  window.addEventListener('resize', debounce(onResize, interval), false)
}
