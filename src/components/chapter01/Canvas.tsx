import { useRef, useEffect /* , useState */, useMemo } from 'react'

import Stats from 'stats.js'
import * as THREE from 'three'

import { useAnimationFrame, useGui } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const step = useRef<number>(0)
  const rotRef = useRef(0)

  const stats = new Stats()
  stats.showPanel(0)
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '0px'
  stats.dom.style.top = '48px'

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 48),
    0.1,
    1000,
  )

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(20)
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

  const cubeGeometory = new THREE.BoxGeometry(4, 4, 4)
  const cubeMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: /* 0xff0000 */ Math.random() * 0xffffff,
    })
  }, [])
  const cube = new THREE.Mesh(cubeGeometory, cubeMaterial)
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

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-20, 30, -5)
  spotLight.castShadow = true
  scene.add(spotLight)

  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  const { rotationSpeed: rot, bouncingSpeed: bounce } = useGui(0.02, 0.03)

  useAnimationFrame(() => {
    stats.update()

    rotRef.current += rot
    cube.rotation.x = rotRef.current
    cube.rotation.y = rotRef.current
    cube.rotation.z = rotRef.current

    step.current += bounce
    sphere.position.x = 20 + 10 * Math.cos(step.current)
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step.current))

    renderer.render(scene, camera)
  })

  const onResize = () => {
    camera.aspect = window.innerWidth / (window.innerHeight - 48)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
  }

  window.addEventListener('resize', onResize, false)

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

  return (
    <>
      <div ref={sceneRef} />
      <div ref={statsRef} />
    </>
  )
}

export default Canvas
