import { useEffect, useRef } from 'react'

import type { NextPage } from 'next'
import * as THREE from 'three'

const Materials: NextPage = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer()

    const elm = mountRef.current

    elm?.appendChild(renderer.domElement)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerWidth, 1, 10000)
    camera.position.set(0, 0, 10)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1)
    scene.add(light)

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const debounce = (fn: () => void, ms: number) => {
      let timer = 0
      return () => {
        window.clearTimeout(timer)
        timer = window.setTimeout(() => {
          fn()
        }, ms)
      }
    }

    const debouncedOnWindowResize = debounce(onWindowResize, 500)

    window.addEventListener('resize', debouncedOnWindowResize, false)

    const animate = () => {
      cube.rotation.y += 0.01
      cube.rotation.x += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      elm?.removeChild(renderer.domElement)
      window.removeEventListener('resize', debouncedOnWindowResize, false)
    }
  }, [])

  return (
    <div className="relative">
      <div ref={mountRef} />
    </div>
  )
}

export default Materials
