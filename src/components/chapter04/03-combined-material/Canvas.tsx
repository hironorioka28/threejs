import { useRef, useEffect, useMemo } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const rotationSpeedRef = useRef<number>(0.02)
  const numberOfObjectsRef = useRef<number>(0)
  const colorRef = useRef<number>(0x00ff00)

  const defaultNumberOfObjectsRef = useRef<number>(10)

  const scene = useMemo(() => new THREE.Scene(), [])

  const camera = useMemo(
    () => new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 30, 170),
    [],
  )

  const renderer = useMemo(() => new THREE.WebGLRenderer(), [])
  renderer.sortObjects = false
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
      color: colorRef.current,

      removeCube: () => {
        const allChildren = scene.children
        const lastObject = allChildren[allChildren.length - 1]
        if (lastObject instanceof THREE.Group) {
          scene.remove(lastObject)
          numberOfObjectsRef.current = scene.children.length
        }
      },

      addCube: () => {
        const cubeSize = Math.ceil(3 + Math.random() * 3)
        const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
        const cubeMaterial = new THREE.MeshDepthMaterial()
        const colorMaterial = new THREE.MeshBasicMaterial({
          color: datGuiControls.color,
          transparent: true,
          blending: THREE.MultiplyBlending,
        })
        const cube = SceneUtils.createMultiMaterialObject(cubeGeometry, [
          colorMaterial,
          cubeMaterial,
        ])
        cube.children[1].scale.set(0.99, 0.99, 0.99)
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

    const defaultNumberOfObjects = defaultNumberOfObjectsRef.current

    const gui = new dat.GUI()

    gui.addColor(datGuiControls, 'color')
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

    for (let i = 0; i < defaultNumberOfObjects; i++) {
      datGuiControls.addCube()
    }

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()

      for (let i = 0; i < defaultNumberOfObjects; i++) {
        datGuiControls.removeCube()
      }
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
