import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const rotationSpeedRef = useRef<number>(0.02)
  const numberOfObjectsRef = useRef<number>(0)

  const scene = useMemo(() => new THREE.Scene(), [])
  scene.overrideMaterial = useMemo(() => new THREE.MeshDepthMaterial(), [])

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 30, 170),
    [],
  )

  const renderer = useMemo(() => new THREE.WebGLRenderer(), [])
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  camera.position.x = -50
  camera.position.y = 40
  camera.position.z = 50
  camera.lookAt(scene.position)

  const stats = myStats()

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    scene.traverse((e) => {
      if (e instanceof THREE.Mesh) {
        e.rotation.x += rotationSpeedRef.current
        e.rotation.y += rotationSpeedRef.current
        e.rotation.z += rotationSpeedRef.current
      }
    })

    renderer.render(scene, camera)
  })

  const datGuiControls = useMemo(() => {
    numberOfObjectsRef.current = scene.children.length
    return {
      cameraNear: camera.near,
      cameraFar: camera.far,
      rotationSpeed: rotationSpeedRef.current,
      numberOfObjects: numberOfObjectsRef.current,

      removeCube: () => {
        const allChildren = scene.children
        const lastObject = allChildren[allChildren.length - 1]
        if (lastObject instanceof THREE.Mesh) {
          scene.remove(lastObject)
          numberOfObjectsRef.current = scene.children.length
        }
      },

      addCube: () => {
        const cubeSize = Math.ceil(3 + Math.random() * 3)
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshDepthMaterial()
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.castShadow = true

        cube.position.x = -60 + Math.round(Math.random() * 100)
        cube.position.y = Math.round(Math.random() * 10)
        cube.position.z = -100 + Math.round(Math.random() * 150)

        scene.add(cube)
        numberOfObjectsRef.current = scene.children.length
      },

      outpubObjects: () => {
        // eslint-disable-next-line no-console
        console.log(scene.children)
      },
    }
  }, [camera, scene])

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current
    const gui = new dat.GUI()

    gui.add(datGuiControls, 'rotationSpeed', 0, 0.5).onChange((e) => (rotationSpeedRef.current = e))
    gui.add(datGuiControls, 'addCube')
    gui.add(datGuiControls, 'removeCube')
    gui.add(datGuiControls, 'outpubObjects')
    gui.add(datGuiControls, 'cameraNear', 0, 50).onChange((e) => {
      camera.near = e
      camera.updateProjectionMatrix()
    })
    gui.add(datGuiControls, 'cameraFar', 100, 300).onChange((e) => {
      camera.far = e
      camera.updateProjectionMatrix()
    })

    for (let i = 0; i < 10; i++) {
      datGuiControls.addCube()
    }

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [renderer, stats.dom, datGuiControls, camera])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
