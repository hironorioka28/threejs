import { useEffect } from 'react'

import type { NextPage } from 'next'
import * as THREE from 'three'

const Home: NextPage = () => {
  const init = () => {
    const w = 960
    const h = 540

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#threejs-area') as HTMLCanvasElement,
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
    camera.position.set(0, 0, +1000)

    const geometry = new THREE.SphereGeometry(300, 30, 30)

    const loader = new THREE.TextureLoader()

    const texture = loader.load('/texture/earthmap1k.jpg')

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    })

    const mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1)

    scene.add(directionalLight)

    const tick = () => {
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }

    tick()
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className="bg-indigo-900">
      <h1 className="text-9xl text-amber-300 font-bold">Hello Three.js</h1>
      <canvas id="threejs-area" />
    </div>
  )
}

export default Home
