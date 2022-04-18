import { useEffect, useRef, useState } from 'react'

import * as THREE from 'three'

import { useGui } from './useGui'

import { myStats, useAnimationFrame } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  console.log('Parent')
  const sceneRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  // const rotRef = useRef(0)

  const [rotationSpeed, setRotationSpeed] = useState<number>(0)

  const scene = new THREE.Scene()
  const [sceneInfo, setSceneInfo] = useState<THREE.Scene>(scene)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(20)
  scene.add(axes)

  const planeGeometory = new THREE.PlaneGeometry(60, 40, 1, 1)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  const plane = new THREE.Mesh(planeGeometory, planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  const ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const stats = myStats()

  useGui(scene, planeGeometory, setRotationSpeed, setSceneInfo)
  console.log('at Canvas.tsx', rotationSpeed)
  console.log('SCENE', sceneInfo.children)

  useAnimationFrame(() => {
    stats.update()

    // rotRef.current = rotationSpeed
    sceneInfo.traverse((e) => {
      if (e instanceof THREE.Mesh && e != plane) {
        e.rotation.x += /* rotRef.current */ rotationSpeed
        e.rotation.y += /* rotRef.current */ rotationSpeed
        e.rotation.z += /* rotRef.current */ rotationSpeed
        console.log(rotationSpeed, e.rotation.x)
      }
    })

    console.log('animated', sceneInfo.children)

    renderer.render(sceneInfo, camera)
    // renderer.render(scene, camera)
  })

  useEffect(() => {
    const sceneElm = sceneRef.current
    sceneElm?.appendChild(renderer.domElement)
    const statsElm = statsRef.current
    statsElm?.appendChild(stats.dom)

    return () => {
      sceneElm?.removeChild(renderer.domElement)
      statsElm?.removeChild(stats.dom)
    }
  }, [renderer.domElement, stats.dom])

  const onResize = () => {
    camera.aspect = window.innerWidth / (window.innerHeight - 48)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
  }

  window.addEventListener('resize', onResize, false)

  return (
    <>
      <div ref={sceneRef} />
      <div ref={statsRef} />
    </>
  )
}

export default Canvas
