import { useEffect, useRef, useState } from 'react'

import type { NextPage } from 'next'
import * as THREE from 'three'

const Materials: NextPage = () => {
  const [boxX, setBoxX] = useState<number>(1)

  const mountRef = useRef<HTMLDivElement>(null)

  const increaseBoxX = () => {
    setBoxX(boxX + 1)
  }
  const decreaseBoxX = () => {
    if (boxX > 1) {
      setBoxX(boxX - 1)
    }
  }

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer()

    const elm = mountRef.current

    elm?.appendChild(renderer.domElement)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerWidth, 1, 10000)
    camera.position.set(0, 0, 10)

    const geometry = new THREE.BoxGeometry(boxX, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const light = new THREE.DirectionalLight(0xffffff)
    light.position.set(1, 1, 1)
    scene.add(light)

    const onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', onWindowResize, false)

    const animate = () => {
      cube.rotation.y += 0.01
      cube.rotation.x += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      elm?.removeChild(renderer.domElement)
      window.removeEventListener('resize', onWindowResize, false)
    }
  }, [boxX])

  // TODO: なんか立方体がゆがむ。ウィンドウサイズをちょっと動かすと直る。アスペクト比が関係していそうだ

  return (
    <div className="relative">
      <div className=" absolute top-4 left-4 text-white">
        <div className=" flex space-x-8">
          <button className="text-2xl" onClick={increaseBoxX}>
            +
          </button>
          <button className="text-2xl" onClick={decreaseBoxX}>
            -
          </button>
          <p className="text-2xl">(X,Y,Z) = ({boxX},1,1)</p>
        </div>
      </div>
      <div ref={mountRef} />
    </div>
  )
}

export default Materials
