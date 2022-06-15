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
  const penumbraRef = useRef<number>(30)
  const angleRef = useRef<number>(0.1)

  const invertRef = useRef<number>(-1)
  const phaseRef = useRef<number>(0)

  const debugRef = useRef<boolean>(false)
  const castShadowRef = useRef<boolean>(true)
  const targetRef = useRef<string>('Plane')
  const stopMovingLightRef = useRef<boolean>(false)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 48),
    0.1,
    1000,
  )
  camera.position.x = -35
  camera.position.y = 30
  camera.position.z = 25
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(60, 20, 1, 1), [])
  const planeMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0xffffff }), [])
  const plane = useMemo(
    () => new THREE.Mesh(planeGeometry, planeMaterial),
    [planeGeometry, planeMaterial],
  )
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
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

  const spotLight0 = new THREE.SpotLight(0xcccccc)
  spotLight0.position.set(-40, 30, -10)
  spotLight0.lookAt(plane.position)
  scene.add(spotLight0)

  const target = new THREE.Object3D()
  target.position.set(5, 0, 0)

  const pointColor = '#ffffff'
  const spotLight = useMemo(() => new THREE.SpotLight(pointColor), [])
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = castShadowRef.current
  spotLight.shadow.camera.near = 2
  spotLight.shadow.camera.far = 200
  spotLight.shadow.camera.fov = 30
  spotLight.target = plane
  spotLight.decay = 1
  spotLight.distance = 0
  spotLight.angle = 0.4
  scene.add(spotLight)

  const cameraHelper = useMemo(() => new THREE.CameraHelper(spotLight.shadow.camera), [spotLight])
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

    if (!stopMovingLightRef.current) {
      if (phaseRef.current > 2 * Math.PI) {
        invertRef.current = invertRef.current * -1
        phaseRef.current -= 2 * Math.PI
      } else {
        phaseRef.current += rotationSpeedRef.current
      }
      sphereLightMesh.position.z = +(7 * Math.sin(phaseRef.current))
      sphereLightMesh.position.x = +(14 * Math.cos(phaseRef.current))
      sphereLightMesh.position.y = 10

      if (invertRef.current < 0) {
        const pivot = 14
        sphereLightMesh.position.x =
          invertRef.current * (sphereLightMesh.position.x - pivot) + pivot
      }

      spotLight.position.copy(sphereLightMesh.position)
    }

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      ambientColor: ambiColorRef.current,
      pointColor: pointColorRef.current,
      intensity: intensityRef.current,
      distance: distanceRef.current,
      decay: decayRef.current,
      penumbra: penumbraRef.current,
      angle: angleRef.current,
      debug: debugRef.current,
      castShadow: castShadowRef.current,
      target: targetRef.current,
      stopMovingLight: stopMovingLightRef.current,
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
      .onChange((e) => (spotLight.color = new THREE.Color(e)))
    gui.add(datGuiControls, 'angle', 0, Math.PI * 2).onChange((e) => (spotLight.angle = e))
    gui.add(datGuiControls, 'intensity', 0, 5).onChange((e) => (spotLight.intensity = e))
    gui.add(datGuiControls, 'decay', 1, 200).onChange((e) => (spotLight.decay = e))
    gui.add(datGuiControls, 'penumbra', 0, 100).onChange((e) => (spotLight.penumbra = e))
    gui.add(datGuiControls, 'debug').onChange((e) => (cameraHelper.visible = e))
    gui.add(datGuiControls, 'castShadow').onChange((e) => (spotLight.castShadow = e))
    gui.add(datGuiControls, 'target', ['Plane', 'Sphere', 'Cube']).onChange((e) => {
      console.log(e)
      switch (e) {
        case 'Plane':
          spotLight.target = plane
          break
        case 'Sphere':
          spotLight.target = sphere
          break
        case 'Cube':
          spotLight.target = cube
          break
      }
    })
    gui.add(datGuiControls, 'stopMovingLight').onChange((e) => (stopMovingLightRef.current = e))

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
    spotLight,
    cameraHelper,
  ])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
