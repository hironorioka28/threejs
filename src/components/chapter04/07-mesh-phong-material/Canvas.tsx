import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const sideRef = useRef<'front' | 'back' | 'double'>('front')
  const flatShadingRef = useRef<boolean>(false)
  const selectedMeshRef = useRef<'cube' | 'sphere' | 'plane'>('cube')
  const stepRef = useRef<number>(0)

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
    () => new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({ color: 0x555555 })),
    [groundGeom],
  )
  groundMesh.rotation.x = -Math.PI / 2
  groundMesh.position.y = -20
  scene.add(groundMesh)

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(14, 20, 20), [])
  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(15, 15, 15), [])
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(14, 14, 4, 4), [])
  const meshMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: 0x7777ff }), [])
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

  camera.position.x = -30
  camera.position.y = 30
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const spotLight = useMemo(() => new THREE.SpotLight(0xffffff), [])
  spotLight.position.set(-30, 60, 60)
  spotLight.castShadow = true
  scene.add(spotLight)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    cube.rotation.y = stepRef.current += 0.01
    plane.rotation.y = stepRef.current
    sphere.rotation.y = stepRef.current

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      opacity: meshMaterial.opacity,
      transparent: meshMaterial.transparent,
      visible: meshMaterial.visible,
      emissive: meshMaterial.emissive.getHex(),
      specular: meshMaterial.specular.getHex(),
      shininess: meshMaterial.shininess,
      side: sideRef.current,
      flatShading: flatShadingRef.current,
      color: meshMaterial.color.getStyle(),
      selectedMesh: selectedMeshRef.current,
    }
  }, [meshMaterial])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()
    gui.add(datGuiControls, 'opacity', 0, 1).onChange((e) => {
      meshMaterial.opacity = e
      meshMaterial.needsUpdate = true
    })
    gui.add(datGuiControls, 'transparent').onChange((e) => (meshMaterial.transparent = e))
    gui.add(datGuiControls, 'visible').onChange((e) => (meshMaterial.visible = e))
    gui
      .addColor(datGuiControls, 'emissive')
      .onChange((e) => (meshMaterial.emissive = new THREE.Color(e)))
    gui
      .addColor(datGuiControls, 'specular')
      .onChange((e) => (meshMaterial.specular = new THREE.Color(e)))
    gui.add(datGuiControls, 'shininess', 0, 200).onChange((e) => (meshMaterial.shininess = e))
    gui.add(datGuiControls, 'side', ['front', 'back', 'double']).onChange((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
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
    gui.add(datGuiControls, 'flatShading').onChange((e) => {
      meshMaterial.flatShading = e
      meshMaterial.needsUpdate = true
    })
    gui.addColor(datGuiControls, 'color').onChange((e) => meshMaterial.color.setStyle(e))
    gui.add(datGuiControls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange((e) => {
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
          break
      }
    })

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer, stats.dom, scene, datGuiControls, cube, sphere, plane, meshMaterial])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
