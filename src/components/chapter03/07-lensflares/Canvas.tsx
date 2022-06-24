import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const rotationSpeedRef = useRef<number>(0.02)
  const bounceRef = useRef<number>(0.03)
  const stepRef = useRef<number>(0)

  const ambiColorRef = useRef<string>('#1c1c1c')
  const pointColorRef = useRef<string>('#ffffff')
  const intensityRef = useRef<number>(0.1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xaaaaaa, 0.01, 200)

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
    [],
  )
  camera.position.x = -20
  camera.position.y = 15
  camera.position.z = 45
  camera.lookAt(new THREE.Vector3(10, 0, 0))

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xaaaaff))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const textureLoader = new THREE.TextureLoader()
  const textureGrass = textureLoader.load('/oreilly/assets/textures/ground/grasslight-big.jpg')
  textureGrass.wrapS = THREE.RepeatWrapping
  textureGrass.wrapT = THREE.RepeatWrapping
  textureGrass.repeat.set(4, 4)

  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(1000, 200, 20, 20), [])
  const planeMaterial = useMemo(
    () => new THREE.MeshLambertMaterial({ map: textureGrass }),
    [textureGrass],
  )
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

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(4, 25, 25), [])
  const sphereMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: 0x7777ff }), [])
  const sphere = useMemo(
    () => new THREE.Mesh(sphereGeometry, sphereMaterial),
    [sphereGeometry, sphereMaterial],
  )
  sphere.castShadow = true
  sphere.position.x = 10
  sphere.position.y = 5
  sphere.position.z = 10
  scene.add(sphere)

  const ambientLight = useMemo(() => new THREE.AmbientLight(ambiColorRef.current), [])
  scene.add(ambientLight)

  const spotLight0 = new THREE.SpotLight(0xcccccc)
  spotLight0.position.set(-40, 60, -10)
  spotLight0.lookAt(plane.position)
  scene.add(spotLight0)

  const target = new THREE.Object3D()
  target.position.set(5, 0, 0)

  const pointColor = pointColorRef.current
  const spotLight = useMemo(() => new THREE.DirectionalLight(pointColor), [pointColor])
  spotLight.position.set(30, 10, -50)
  spotLight.castShadow = true
  spotLight.target = plane
  spotLight.shadow.camera.near = 2
  spotLight.shadow.camera.far = 200
  spotLight.shadow.camera.left = -100
  spotLight.shadow.camera.right = 100
  spotLight.shadow.camera.top = 100
  spotLight.shadow.camera.bottom = -100
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.mapSize.width = 2048
  scene.add(spotLight)

  const textureFlare0 = textureLoader.load('/oreilly/assets/textures/lensflare/lensflare0.png')
  const textureFlare3 = textureLoader.load('/oreilly/assets/textures/lensflare/lensflare3.png')
  const flareColor = useMemo(() => new THREE.Color(0xffaacc), [])
  const lensFlare = useMemo(() => new Lensflare(), [])
  lensFlare.addElement(new LensflareElement(textureFlare0, 350, 0.0, flareColor))
  lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6))
  lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7))
  lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9))
  lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1.0))
  lensFlare.position.copy(spotLight.position)
  scene.add(lensFlare)

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

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      ambientColor: ambiColorRef.current,
      pointColor: pointColorRef.current,
      intensity: intensityRef.current,
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
    gui.add(datGuiControls, 'intensity', 0, 5).onChange((e) => (spotLight.intensity = e))

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer.domElement, stats.dom, datGuiControls, ambientLight, spotLight])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
