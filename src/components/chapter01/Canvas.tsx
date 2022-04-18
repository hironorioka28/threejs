import React, { useState, useRef, useEffect } from 'react'

import Stats from 'stats.js'
import * as THREE from 'three'

import Gui from '@components/Gui'

// import { useAnimationFrame } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const mountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const statsRef = useRef<Stats>(new Stats())

  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer())
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
  )
  const axesRef = useRef<THREE.AxesHelper>(new THREE.AxesHelper(20))
  const cubeGeometroyRef = useRef<THREE.BoxGeometry>(new THREE.BoxGeometry(4, 4, 4))
  const cubeMaterialRef = useRef<THREE.MeshLambertMaterial>(
    new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  )
  const cubeRef = useRef<THREE.Mesh>(
    new THREE.Mesh(cubeGeometroyRef.current, cubeMaterialRef.current),
  )
  const spotLightRef = useRef<THREE.SpotLight>(new THREE.SpotLight(0xffffff))

  const rotationSpeedRef = useRef<number>(0)
  const bounceRef = useRef<number>(0)
  const stepRef = useRef<number>(0)

  const [rotationSpeed, setRotationSpeed] = useState<number>(0.02)
  const [bounce, setBounce] = useState<number>(0.03)

  rotationSpeedRef.current = rotationSpeed
  bounceRef.current = bounce
  useEffect(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    const axes = axesRef.current
    const cube = cubeRef.current
    const spotLight = spotLightRef.current

    const stats = statsRef.current

    renderer.setClearColor(new THREE.Color(0xeeeeee))
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
    renderer.shadowMap.enabled = true

    scene.add(axes)

    const planeGeometory = new THREE.PlaneGeometry(60, 20)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc })
    const plane = new THREE.Mesh(planeGeometory, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0
    plane.receiveShadow = true
    scene.add(plane)

    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0
    cube.castShadow = true
    scene.add(cube)

    const sphereGeometory = new THREE.SphereGeometry(4, 20, 20)
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
    const sphere = new THREE.Mesh(sphereGeometory, sphereMaterial)
    sphere.position.x = 20
    sphere.position.y = 4
    sphere.position.z = 2
    sphere.castShadow = true
    scene.add(sphere)

    spotLight.position.set(-20, 30, -5)
    spotLight.castShadow = true
    scene.add(spotLight)

    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    stats.showPanel(0)
    stats.dom.style.position = 'absolute'
    stats.dom.style.left = '0px'
    stats.dom.style.top = '48px'

    const onResize = () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 48)
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight - 48)
    }
    window.addEventListener('resize', onResize, false)

    const mount = mountRef.current
    mount?.appendChild(renderer.domElement)

    const statsMount = statsMountRef.current
    statsMount?.appendChild(stats.dom)

    const animate = () => {
      stats.update()

      cube.rotation.x += rotationSpeedRef.current
      cube.rotation.y += rotationSpeedRef.current
      cube.rotation.z += rotationSpeedRef.current

      stepRef.current = bounceRef.current
      sphere.position.x = 20 + 10 * Math.cos(stepRef.current)
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(stepRef.current))
      renderer.render(scene, camera)
      console.log(rotationSpeedRef.current, bounceRef.current, stepRef.current)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      mount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
    }
  }, [bounce, rotationSpeed])

  return (
    <>
      <div ref={mountRef} />
      <div ref={statsMountRef} />
      <Gui setRot={setRotationSpeed} setBounce={setBounce} />
    </>
  )
}

export default Canvas
