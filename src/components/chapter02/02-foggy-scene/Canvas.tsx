import { useEffect, useMemo, useRef } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useDebounce } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const rotationSpeedRef = useRef<number>(0.02)

  const scene = useMemo(() => {
    return new THREE.Scene()
  }, [])

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1)
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(20)
  scene.add(axes)

  const planeGeometory = new THREE.PlaneGeometry(60, 40, 1, 1)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  const plane = new THREE.Mesh(planeGeometory, planeMaterial)
  plane.receiveShadow = true
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const ambientLight = new THREE.AmbientLight(0x0c0c0c)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, -10)
  spotLight.castShadow = true
  scene.add(spotLight)

  /* Fog */
  scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
  // scene.fog = new THREE.FogExp2(0xffffff, 0.015)

  const onResize = () => {
    camera.aspect = window.innerWidth / (window.innerHeight - 48)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight - 48)
  }
  const debouncedOnResize = useDebounce(onResize, 200)
  window.addEventListener('resize', debouncedOnResize, false)

  const stats = myStats()

  useAnimationFrame(() => {
    stats.update()

    scene.traverse((e) => {
      if (e instanceof THREE.Mesh && e != plane) {
        e.rotation.x += rotationSpeedRef.current
        e.rotation.y += rotationSpeedRef.current
        e.rotation.z += rotationSpeedRef.current
      }
    })

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    return {
      rotationSpeed: rotationSpeedRef.current,
      numberOfObjects: scene.children.length,
      removeCube: () => {
        const allChildren = scene.children
        const lastObject = allChildren[allChildren.length - 1]

        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject)
        }
      },
      addCube: () => {
        const cubeSize = Math.ceil(Math.random() * 3)
        const cubeGeometory = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
        const cube = new THREE.Mesh(cubeGeometory, cubeMaterial)
        cube.castShadow = true
        cube.name = `cube-${scene.children.length}`
        cube.position.x = -30 + Math.round(Math.random() * planeGeometory.parameters.width)
        cube.position.y = Math.round(Math.random() * 5)
        cube.position.z = -20 + Math.round(Math.random() * planeGeometory.parameters.height)
        scene.add(cube)
      },
      outputObjects: () => {
        // eslint-disable-next-line no-console
        console.log(scene.children)
      },
    }
  }, [scene, planeGeometory.parameters])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()

    gui.add(datGuiControls, 'rotationSpeed', 0, 0.5).onChange((v) => (rotationSpeedRef.current = v))
    gui
      .add(datGuiControls, 'addCube')
      .onFinishChange(() => (datGuiControls.numberOfObjects = scene.children.length))
    gui
      .add(datGuiControls, 'removeCube')
      .onFinishChange(() => (datGuiControls.numberOfObjects = scene.children.length))
    gui.add(datGuiControls, 'numberOfObjects').listen()
    gui.add(datGuiControls, 'outputObjects')

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer.domElement, stats.dom, datGuiControls, scene.children.length])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
