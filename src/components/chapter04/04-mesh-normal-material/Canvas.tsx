import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stepRef = useRef<number>(0)

  const sideRef = useRef<'front' | 'back' | 'double'>('front')
  const selectedMeshRef = useRef<'cube' | 'sphere' | 'plane'>('sphere')

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

  const meshMaterial = useMemo(() => new THREE.MeshNormalMaterial(), [])

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

  const cubeVnh = useMemo(() => new VertexNormalsHelper(cube, 5, 0xff0000), [cube])
  const sphereVnh = useMemo(() => new VertexNormalsHelper(sphere, 5, 0xff0000), [sphere])
  const planeVnh = useMemo(() => new VertexNormalsHelper(plane, 5, 0xff0000), [plane])
  scene.add(sphereVnh)

  cube.position.set(sphere.position.x, sphere.position.y, sphere.position.z)
  plane.position.set(sphere.position.x, sphere.position.y, sphere.position.z)

  scene.add(sphere)

  camera.position.x = -20
  camera.position.y = 50
  camera.position.z = 40
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const ambientLight = useMemo(() => new THREE.AmbientLight(0x0c0c0c), [])
  scene.add(ambientLight)

  const spotLight = useMemo(() => new THREE.SpotLight(0xffffff), [])
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    cube.rotation.y = stepRef.current += 0.01
    plane.rotation.y = stepRef.current
    sphere.rotation.y = stepRef.current

    planeVnh.update()
    sphereVnh.update()
    cubeVnh.update()

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      opacity: meshMaterial.opacity,
      transparent: meshMaterial.transparent,
      wireframe: meshMaterial.wireframe,
      visible: meshMaterial.visible,
      side: sideRef.current,
      selectedMesh: selectedMeshRef.current,
    }
  }, [meshMaterial])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()
    gui.add(datGuiControls, 'opacity', 0, 1).onChange((e) => (meshMaterial.opacity = e))
    gui.add(datGuiControls, 'transparent').onChange((e) => {
      meshMaterial.transparent = e
      meshMaterial.needsUpdate = true
    })
    gui.add(datGuiControls, 'wireframe').onChange((e) => (meshMaterial.wireframe = e))
    gui.add(datGuiControls, 'visible').onChange((e) => (meshMaterial.visible = e))
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
    gui.add(datGuiControls, 'selectedMesh', ['cube', 'sphere', 'plane']).onChange((e) => {
      scene.remove(plane)
      scene.remove(cube)
      scene.remove(sphere)
      scene.remove(planeVnh)
      scene.remove(cubeVnh)
      scene.remove(sphereVnh)

      switch (e) {
        case 'cube':
          scene.add(cube)
          scene.add(cubeVnh)
          break
        case 'sphere':
          scene.add(sphere)
          scene.add(sphereVnh)
          break
        case 'plane':
          scene.add(plane)
          scene.add(planeVnh)
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
  }, [
    renderer,
    stats.dom,
    scene,
    datGuiControls,
    meshMaterial,
    cube,
    sphere,
    plane,
    sphereVnh,
    planeVnh,
    cubeVnh,
  ])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
