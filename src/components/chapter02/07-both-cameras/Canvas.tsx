import { useEffect, useMemo, useRef } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | THREE.OrthographicCamera>(
    new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1, 1000),
  )

  const stats = myStats()

  const scene = useMemo(() => new THREE.Scene(), [])

  cameraRef.current.position.x = 120
  cameraRef.current.position.y = 60
  cameraRef.current.position.z = 180
  cameraRef.current.lookAt(scene.position)

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(7)
  scene.add(axes)

  const planeGeometory = new THREE.PlaneGeometry(180, 180)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  const plane = new THREE.Mesh(planeGeometory, planeMaterial)
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 0
  plane.position.y = 0
  plane.position.z = 0
  scene.add(plane)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
  directionalLight.position.set(-20, 40, 60)
  scene.add(directionalLight)

  const ambientLight = new THREE.AmbientLight(0x292929)
  scene.add(ambientLight)

  const cubeGeometory = new THREE.BoxGeometry(4, 4, 4)

  for (let j = 0; j < planeGeometory.parameters.height / 5; j++) {
    for (let i = 0; i < planeGeometory.parameters.width / 5; i++) {
      const rnd = Math.random() * 0.75 + 0.25
      const cubeMaterial = new THREE.MeshLambertMaterial()
      cubeMaterial.color = new THREE.Color(rnd, 0, 0)
      const cube = new THREE.Mesh(cubeGeometory, cubeMaterial)

      cube.position.z = -(planeGeometory.parameters.height / 2) + 2 + j * 5
      cube.position.x = -(planeGeometory.parameters.width / 2) + 2 + i * 5
      cube.position.y = 2

      scene.add(cube)
    }
  }

  const controls = useMemo(() => {
    return {
      perspective: 'Perspective',
      switchCamera: () => {
        if (cameraRef.current instanceof THREE.PerspectiveCamera) {
          cameraRef.current = new THREE.OrthographicCamera(
            window.innerWidth / -16,
            window.innerWidth / 16,
            (window.innerHeight - 48) / 16,
            (window.innerHeight - 48) / -16,
            -200,
            500,
          )
          cameraRef.current.position.x = 120
          cameraRef.current.position.y = 60
          cameraRef.current.position.z = 180
          cameraRef.current.lookAt(cameraRef.current.position)
          controls.perspective = 'Orthographic'
        } else {
          cameraRef.current = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / (window.innerHeight - 48),
            0.1,
            1000,
          )
          cameraRef.current.position.x = 120
          cameraRef.current.position.y = 60
          cameraRef.current.position.z = 180
          cameraRef.current.lookAt(cameraRef.current.position)
          controls.perspective = 'Perspective'
        }
      },
    }
  }, [])

  useWindowResize(cameraRef.current, renderer, 500)

  useAnimationFrame(() => {
    stats.update()
    cameraRef.current.lookAt(scene.position)

    renderer.render(scene, cameraRef.current)
  })

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()
    gui.add(controls, 'switchCamera')
    gui.add(controls, 'perspective').listen()

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [stats.dom, renderer.domElement, controls, scene.position])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
