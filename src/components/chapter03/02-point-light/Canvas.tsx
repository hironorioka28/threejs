import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const rotationSpeedRef = useRef<number>(0.02)
  const bounceRef = useRef<number>(0.03)
  const stepRef = useRef<number>(0)
  const ambiColorRef = useRef<string>('#0c0c0c')
  const pointColorRef = useRef<string>('#ccffcc')
  const intensityRef = useRef<number>(1)
  const distanceRef = useRef<number>(100)
  const decayRef = useRef<number>(1)
  const invertRef = useRef<number>(1)
  const phaseRef = useRef<number>(0)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 48),
    0.1,
    1000,
  )
  camera.position.x = -25
  camera.position.y = 30
  camera.position.z = 25
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const planeGeometory = new THREE.PlaneGeometry(60, 20, 20, 20)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  const plane = new THREE.Mesh(planeGeometory, planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const cubeGeometory = new THREE.BoxGeometry(4, 4, 4)
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const cube = new THREE.Mesh(cubeGeometory, cubeMaterial)
  cube.castShadow = true
  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 0
  scene.add(cube)

  const sphereGeometory = new THREE.SphereGeometry(4, 20, 20)
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
  const sphere = new THREE.Mesh(sphereGeometory, sphereMaterial)
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 4
  sphere.position.z = 2
  scene.add(sphere)

  const ambientLight = useMemo(() => new THREE.AmbientLight(ambiColorRef.current), [])
  scene.add(ambientLight)

  const pointLight = useMemo(() => new THREE.PointLight(pointColorRef.current), [])
  pointLight.distance = distanceRef.current
  scene.add(pointLight)

  const sphereLight = new THREE.SphereGeometry(0.2)
  const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 })
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
  sphereLightMesh.castShadow = true
  sphereLightMesh.position.set(3, 0, 3)
  scene.add(sphereLightMesh)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    cube.rotation.x += rotationSpeedRef.current
    cube.rotation.y += rotationSpeedRef.current
    cube.rotation.z += rotationSpeedRef.current

    stepRef.current += bounceRef.current
    sphere.position.x = 20 + 10 * Math.cos(stepRef.current)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(stepRef.current))

    if (phaseRef.current > 2 * Math.PI) {
      invertRef.current = invertRef.current * -1
      phaseRef.current -= 2 * Math.PI
    } else {
      phaseRef.current += rotationSpeedRef.current
    }
    sphereLightMesh.position.z = +(7 * Math.sin(phaseRef.current))
    sphereLightMesh.position.x = +(14 * Math.cos(phaseRef.current))
    sphereLightMesh.position.y = 5

    if (invertRef.current < 0) {
      const pivot = 14
      sphereLightMesh.position.x = invertRef.current * (sphereLightMesh.position.x - pivot) + pivot
    }

    pointLight.position.copy(sphereLightMesh.position)

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      ambientColor: ambiColorRef.current,
      pointColor: pointColorRef.current,
      intensity: intensityRef.current,
      distance: distanceRef.current,
      decay: decayRef.current,
    }
  }, [])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current
    const gui = new dat.GUI()

    gui
      .addColor(datGuiControls, 'ambientColor')
      .onChange((e) => (ambientLight.color = new THREE.Color(e)))
    gui
      .addColor(datGuiControls, 'pointColor')
      .onChange((e) => (pointLight.color = new THREE.Color(e)))
    gui.add(datGuiControls, 'intensity', 0, 3).onChange((e) => (pointLight.intensity = e))
    gui.add(datGuiControls, 'distance', 0, 100).onChange((e) => (pointLight.distance = e))
    gui.add(datGuiControls, 'decay', 1, 100).onChange((e) => (pointLight.decay = e))

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer.domElement, stats.dom, datGuiControls, ambientLight, pointLight])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
