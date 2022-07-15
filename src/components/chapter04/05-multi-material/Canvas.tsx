import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stepRef = useRef<number>(0)
  const rotationSpeedRef = useRef<number>(0.02)

  const scene = useMemo(() => new THREE.Scene(), [])

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
    [],
  )

  const renderer = useMemo(() => new THREE.WebGLRenderer(), [])
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = false

  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(60, 40, 1, 1), [])
  const planeMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0xffffff }), [])
  const plane = useMemo(
    () => new THREE.Mesh(planeGeometry, planeMaterial),
    [planeGeometry, planeMaterial],
  )
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = -2
  plane.position.z = 0
  scene.add(plane)

  camera.position.x = -30
  camera.position.y = 30
  camera.position.z = 30
  camera.lookAt(scene.position)

  const spotLight = useMemo(() => new THREE.SpotLight(0xffffff), [])
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const group = useMemo(() => new THREE.Group(), [])
  const faceMaterial = []
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0x0051b1 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0x0051b1 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xc41e3a }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xffffff }))
  faceMaterial.push(new THREE.MeshBasicMaterial({ color: 0xffffff }))

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9)
        const cube = new THREE.Mesh(cubeGeom, faceMaterial)
        cube.position.set(x * 3 - 3, y * 3, z * 3 - 3)
        group.add(cube)
      }
    }
  }

  scene.add(group)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    group.rotation.y = stepRef.current += datGuiControls.rotationSpeed

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      rotationSpeed: rotationSpeedRef.current,
    }
  }, [])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()
    gui.add(datGuiControls, 'rotationSpeed', 0, 0.5)

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer, stats.dom, scene, datGuiControls])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
