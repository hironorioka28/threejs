import { useState, useRef, useEffect } from 'react'

import dat from 'dat.gui'
import Stats from 'stats.js'
import * as THREE from 'three'

// import { useAnimationFrame } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const mountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const statsRef = useRef<Stats>(new Stats())
  const guiRef = useRef<dat.GUI>(new dat.GUI())

  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer())
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
  )
  const axesRef = useRef<THREE.AxesHelper>(new THREE.AxesHelper(20))

  const stepRef = useRef<number>(0)

  const [rotationSpeed, setRotationSpeed] = useState<number>(0.02)
  const [bounce, setBounce] = useState<number>(0.03)

  useEffect(() => {
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    const axes = axesRef.current

    const stats = statsRef.current
    const gui = guiRef.current

    renderer.setClearColor(new THREE.Color(0xeeeeee))
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
    renderer.shadowMap.enabled = true

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
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
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

    stats.showPanel(0)
    stats.dom.style.position = 'absolute'
    stats.dom.style.left = '0px'
    stats.dom.style.top = '48px'

    const controls = {
      rotationSpeed: rotationSpeed,
      bounce: bounce,
    }
    gui.add(controls, 'rotationSpeed', 0, 0.5).onChange((v) => setRotationSpeed(v))
    gui.add(controls, 'bounce', 0, 0.5).onChange((v) => setBounce(v))

    const onResize = () => {
      camera.aspect = window.innerWidth / (window.innerHeight - 48)
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight - 48)
    }
    window.addEventListener('resize', onResize, false)

    const mount = mountRef.current
    mount?.appendChild(renderer.domElement)

    const statsMount = statsMountRef.current
    statsMount?.appendChild(stats.dom)

    function animate() {
      stats.update()

      cube.rotation.x += 0.02
      cube.rotation.y += 0.02
      cube.rotation.z += 0.02

      stepRef.current += 0.02
      sphere.position.x = 20 + 10 * Math.cos(stepRef.current)
      sphere.position.y = 2 + 10 * Math.abs(Math.sin(stepRef.current))
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      mount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [rotationSpeed, bounce])

  return (
    <>
      <div ref={mountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
