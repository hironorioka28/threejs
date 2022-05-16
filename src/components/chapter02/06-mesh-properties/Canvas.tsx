import { useEffect, useMemo, useRef } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stats = myStats()

  const scene = useMemo(() => new THREE.Scene(), [])

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / (window.innerHeight - 48),
    0.1,
    1000,
  )
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(0xeeeeee), 1.0)
  renderer.setSize(window.innerWidth, window.innerHeight - 48)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(7)
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
  spotLight.position.set(-20, 30, 10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const material = useMemo(() => new THREE.MeshLambertMaterial({ color: 0x44ff44 }), [])
  const geom = useMemo(() => new THREE.BoxGeometry(5, 8, 3), [])
  const cube = useMemo(() => new THREE.Mesh(geom, material), [geom, material])
  cube.position.y = 4
  cube.castShadow = true
  scene.add(cube)

  const controls = useMemo(() => {
    return {
      scaleX: 1,
      scaleY: 1,
      scaleZ: 1,

      positionX: 0,
      positionY: 4,
      positionZ: 0,

      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,

      scale: 1,

      translateX: 0,
      translateY: 0,
      translateZ: 0,

      visible: true,

      translate: () => {
        cube.translateX(controls.translateX)
        cube.translateY(controls.translateY)
        cube.translateZ(controls.translateZ)

        controls.positionX = cube.position.x
        controls.positionY = cube.position.y
        controls.positionZ = cube.position.z
      },
    }
  }, [cube])

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    cube.visible = controls.visible

    cube.rotation.x = controls.rotationX
    cube.rotation.y = controls.rotationY
    cube.rotation.z = controls.rotationZ

    cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ)

    renderer.render(scene, camera)
  })

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()

    const guiScale = gui.addFolder('scale')
    guiScale.add(controls, 'scaleX', 0, 5)
    guiScale.add(controls, 'scaleY', 0, 5)
    guiScale.add(controls, 'scaleZ', 0, 5)

    const guiPosition = gui.addFolder('position')
    const contX = guiPosition.add(controls, 'positionX', -10, 10)
    const contY = guiPosition.add(controls, 'positionY', -4, 20)
    const contZ = guiPosition.add(controls, 'positionZ', -10, 10)

    contX.listen()
    contX.onChange(() => {
      cube.position.x = controls.positionX
    })
    contY.listen()
    contY.onChange(() => {
      cube.position.y = controls.positionY
    })
    contZ.listen()
    contZ.onChange(() => {
      cube.position.z = controls.positionZ
    })

    const guiRotation = gui.addFolder('rotation')
    guiRotation.add(controls, 'rotationX', -4, 4)
    guiRotation.add(controls, 'rotationY', -4, 4)
    guiRotation.add(controls, 'rotationZ', -4, 4)

    const guiTranslate = gui.addFolder('translate')
    guiTranslate.add(controls, 'translateX', -10, 10)
    guiTranslate.add(controls, 'translateY', -10, 10)
    guiTranslate.add(controls, 'translateZ', -10, 10)
    guiTranslate.add(controls, 'translate')

    gui.add(controls, 'visible')

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [stats.dom, renderer.domElement, controls, cube.position])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
