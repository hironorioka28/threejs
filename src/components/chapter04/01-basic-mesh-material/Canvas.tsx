import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stepRef = useRef<number>(0)

  const rotationSpeedRef = useRef<number>(0.02)
  const bouncingSpeedRef = useRef<number>(0.03)

  const sideRef = useRef<'front' | 'back' | 'double'>('front')

  const clippingEnabledRef = useRef<boolean>(false)
  const clippingPlaneZRef = useRef<number>(0)

  const selectedMeshRef = useRef<'cube' | 'sphere' | 'plane'>('cube')

  const scene = useMemo(() => new THREE.Scene(), [])

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
    [],
  )

  const renderer = useMemo(() => new THREE.WebGLRenderer(), [])
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const groundGeom = useMemo(() => new THREE.PlaneGeometry(100, 100, 4, 4), [])
  const groundMesh = useMemo(
    () => new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x777777 })),
    [groundGeom],
  )
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.position.y = -20
  scene.add(groundMesh)

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(14, 20, 20), [])
  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(15, 15, 15), [])
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(14, 14, 4, 4), [])

  const meshMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x7777ff }), [])
  const clippingPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1)), [])
  meshMaterial.clippingPlanes = [clippingPlane]

  const sphere = useMemo(
    () => new THREE.Mesh(sphereGeometry, meshMaterial),
    [sphereGeometry, meshMaterial],
  )
  const cube = useMemo(
    () => new THREE.Mesh(cubeGeometry, meshMaterial),
    [cubeGeometry, meshMaterial],
  )
  const plane = useMemo(
    () => new THREE.Mesh(planeGeometry, meshMaterial),
    [planeGeometry, meshMaterial],
  )

  sphere.position.x = 0
  sphere.position.y = 3
  sphere.position.z = 2

  cube.position.set(sphere.position.x, sphere.position.y, sphere.position.z)
  plane.position.set(sphere.position.x, sphere.position.y, sphere.position.z)

  scene.add(cube)

  camera.position.x = -20
  camera.position.y = 50
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const ambientLight = useMemo(() => new THREE.AmbientLight(0x0c0c0c), [])
  scene.add(ambientLight)

  const spotLight = useMemo(() => new THREE.DirectionalLight(0xffffff), [])
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    cube.rotation.x += rotationSpeedRef.current
    cube.rotation.y += rotationSpeedRef.current
    cube.rotation.z += rotationSpeedRef.current

    stepRef.current += bouncingSpeedRef.current
    sphere.position.x = 20 + 10 * Math.cos(stepRef.current)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(stepRef.current))

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      rotationSpeed: rotationSpeedRef.current,
      bouncingSpeed: bouncingSpeedRef.current,

      opacity: meshMaterial.opacity,
      transparent: meshMaterial.transparent,
      visible: meshMaterial.visible,
      side: sideRef.current,

      color: meshMaterial.color.getStyle(),
      wireframe: meshMaterial.wireframe,

      clippingEnabled: clippingEnabledRef.current,
      clippingPlaneZ: clippingPlaneZRef.current,

      selectedMesh: selectedMeshRef.current,
    }
  }, [meshMaterial])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current
    const gui = new dat.GUI()

    const spGui = gui.addFolder('Mesh')
    spGui.add(datGuiControls, 'opacity', 0, 1).onChange((e) => {
      meshMaterial.opacity = e
    })
    spGui.add(datGuiControls, 'transparent').onChange((e) => {
      meshMaterial.transparent = e
      meshMaterial.needsUpdate = true
    })
    spGui.add(datGuiControls, 'wireframe').onChange((e) => (meshMaterial.wireframe = e))
    spGui.add(datGuiControls, 'visible').onChange((e) => (meshMaterial.visible = e))
    spGui.add(datGuiControls, 'side', ['front', 'back', 'double']).onChange((e) => {
      switch (e) {
        case 'front':
          meshMaterial.side = THREE.FrontSide
          break
        case 'back':
          meshMaterial.side = THREE.BackSide
          break
        case 'double':
          meshMaterial.side = THREE.DoubleSide
          break
      }
      meshMaterial.needsUpdate = true
    })
    spGui.addColor(datGuiControls, 'color').onChange((e) => meshMaterial.color.setStyle(e))
    spGui
      .add(datGuiControls, 'clippingEnabled')
      .onChange((e) => (renderer.localClippingEnabled = e))
    spGui
      .add(datGuiControls, 'clippingPlaneZ', -5.0, 5.0)
      .onChange((e) => (meshMaterial.clippingPlanes[0].constant = e))
    spGui.add(datGuiControls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange((e) => {
      scene.remove(plane)
      scene.remove(cube)
      scene.remove(sphere)

      switch (e) {
        case 'cube':
          scene.add(cube)
          break
        case 'sphere':
          scene.add(sphere)
          break
        case 'plane':
          scene.add(plane)
      }

      scene.add(e)
    })

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer, stats.dom, datGuiControls, cube, plane, sphere, meshMaterial, scene])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
