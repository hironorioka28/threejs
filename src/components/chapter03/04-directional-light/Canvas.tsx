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

  const ambiColorRef = useRef<string>('#1c1c1c')
  const pointColorRef = useRef<string>('#ccffcc')

  const intensityRef = useRef<number>(1)

  const debugRef = useRef<boolean>(false)
  const castShadowRef = useRef<boolean>(true)
  const targetRef = useRef<string>('Plane')

  const scene = new THREE.Scene()

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
    [],
  )
  camera.position.x = -35
  camera.position.y = 30
  camera.position.z = 25
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(600, 200, 20, 20), [])
  const planeMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0xffffff }), [])
  const plane = useMemo(
    () => new THREE.Mesh(planeGeometry, planeMaterial),
    [planeGeometry, planeMaterial],
  )
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = -5
  plane.position.z = 0
  scene.add(plane)

  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(4, 4, 4), [])
  const cubeMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0xff3333 }), [])
  const cube = useMemo(
    () => new THREE.Mesh(cubeGeometry, cubeMaterial),
    [cubeGeometry, cubeMaterial],
  )
  cube.castShadow = true
  cube.position.x = -4
  cube.position.y = 3
  cube.position.z = 0
  scene.add(cube)

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 20, 20), [])
  const sphereMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0x7777ff }), [])
  const sphere = useMemo(
    () => new THREE.Mesh(sphereGeometry, sphereMaterial),
    [sphereGeometry, sphereMaterial],
  )
  sphere.castShadow = true
  sphere.position.x = 20
  sphere.position.y = 0
  sphere.position.z = 2
  scene.add(sphere)

  const ambientLight = useMemo(() => new THREE.AmbientLight(ambiColorRef.current), [])
  scene.add(ambientLight)

  const target = new THREE.Object3D()
  target.position.set(5, 0, 0)

  const pointColor = '#ff5808'
  const directionalLight = useMemo(() => new THREE.DirectionalLight(pointColor), [])
  directionalLight.position.set(-40, 60, -10)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 2
  directionalLight.shadow.camera.far = 200
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50
  directionalLight.intensity = 0.5
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.mapSize.width = 1024
  scene.add(directionalLight)

  const cameraHelper = useMemo(
    () => new THREE.CameraHelper(directionalLight.shadow.camera),
    [directionalLight],
  )
  cameraHelper.visible = debugRef.current
  scene.add(cameraHelper)

  const sphereLight = new THREE.SphereGeometry(0.2)
  const sphereLightMaterial = new THREE.MeshBasicMaterial({ color: 0xac6c25 })
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
  sphereLightMesh.castShadow = true
  sphereLightMesh.position.set(3, 20, 3)
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

    sphereLightMesh.position.z = -8
    sphereLightMesh.position.y = +(27 * Math.sin(stepRef.current / 3))
    sphereLightMesh.position.x = 10 + 26 * Math.cos(stepRef.current / 3)

    directionalLight.position.copy(sphereLightMesh.position)

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      ambientColor: ambiColorRef.current,
      pointColor: pointColorRef.current,
      intensity: intensityRef.current,
      debug: debugRef.current,
      castShadow: castShadowRef.current,
      target: targetRef.current,
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
      .onChange((e) => (directionalLight.color = new THREE.Color(e)))
    gui.add(datGuiControls, 'intensity', 0, 5).onChange((e) => (directionalLight.intensity = e))
    gui.add(datGuiControls, 'debug').onChange((e) => (cameraHelper.visible = e))
    gui.add(datGuiControls, 'castShadow').onChange((e) => (directionalLight.castShadow = e))
    gui.add(datGuiControls, 'target', ['Plane', 'Sphere', 'Cube']).onChange((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
      switch (e) {
        case 'Plane':
          directionalLight.target = plane
          break
        case 'Sphere':
          directionalLight.target = sphere
          break
        case 'Cube':
          directionalLight.target = cube
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
    renderer.domElement,
    stats.dom,
    datGuiControls,
    ambientLight,
    cube,
    sphere,
    plane,
    cameraHelper,
    directionalLight,
  ])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
