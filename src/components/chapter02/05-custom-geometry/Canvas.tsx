import { useEffect, useMemo, useRef } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stats = myStats()

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1)
  camera.position.x = -20
  camera.position.y = 25
  camera.position.z = 20
  camera.lookAt(new THREE.Vector3(5, 0, 0))

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

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 60, 10)
  spotLight.castShadow = true
  scene.add(spotLight)

  const geom = new THREE.BufferGeometry()

  const points = [
    new THREE.Vector3(1, -1, -1), // 3
    new THREE.Vector3(1, 3, 1), // 0
    new THREE.Vector3(1, -1, 1), // 2

    new THREE.Vector3(1, 3, -1), // 1
    new THREE.Vector3(1, 3, 1), // 0
    new THREE.Vector3(1, -1, -1), // 3

    new THREE.Vector3(-1, 3, 1), // 5
    new THREE.Vector3(1, 3, 1), // 0
    new THREE.Vector3(-1, 3, -1), // 4

    new THREE.Vector3(-1, 3, -1), // 4
    new THREE.Vector3(1, 3, 1), // 0
    new THREE.Vector3(1, 3, -1), // 1

    new THREE.Vector3(-1, -1, 1), // 7
    new THREE.Vector3(-1, 3, 1), // 5
    new THREE.Vector3(-1, -1, -1), // 6

    new THREE.Vector3(-1, -1, -1), // 6
    new THREE.Vector3(-1, 3, 1), // 5
    new THREE.Vector3(-1, 3, -1), // 4

    new THREE.Vector3(1, -1, 1), // 2
    new THREE.Vector3(-1, -1, 1), // 7
    new THREE.Vector3(1, -1, -1), // 3

    new THREE.Vector3(1, -1, -1), // 3
    new THREE.Vector3(-1, -1, 1), // 7
    new THREE.Vector3(-1, -1, -1), // 6

    new THREE.Vector3(-1, 3, 1), // 5
    new THREE.Vector3(-1, -1, 1), // 7
    new THREE.Vector3(1, 3, 1), // 0

    new THREE.Vector3(1, 3, 1), // 0
    new THREE.Vector3(-1, -1, 1), // 7
    new THREE.Vector3(1, -1, 1), // 2

    new THREE.Vector3(1, -1, -1), // 3
    new THREE.Vector3(-1, -1, -1), // 6
    new THREE.Vector3(1, 3, -1), // 1

    new THREE.Vector3(1, 3, -1), // 1
    new THREE.Vector3(-1, -1, -1), // 6
    new THREE.Vector3(-1, 3, -1), // 4
  ]
  const pointIndex = [
    3, 0, 2,

    1, 0, 3,

    5, 0, 4,

    4, 0, 1,

    7, 5, 6,

    6, 5, 4,

    2, 7, 3,

    3, 7, 6,

    5, 7, 0,

    0, 7, 2,

    3, 6, 1,

    1, 6, 4,
  ]
  geom.setFromPoints(points)

  const materials = [
    new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
  ]
  const mesh = SceneUtils.createMultiMaterialObject(geom, materials)
  mesh.children.forEach((e) => {
    e.castShadow = true
  })
  scene.add(mesh)

  const addControl = (x: number, y: number, z: number) => {
    const controls = { x: 0, y: 0, z: 0 }
    controls.x = x
    controls.y = y
    controls.z = z

    return controls
  }

  const controlPoints: { x: number; y: number; z: number }[] = useMemo(() => [], []) // useMemo の中で空の配列を定義しているだけ
  controlPoints.push(addControl(3, 5, 3)) // 0
  controlPoints.push(addControl(3, 5, 0)) // 1
  controlPoints.push(addControl(3, 0, 3)) // 2
  controlPoints.push(addControl(3, 0, 0)) // 3
  controlPoints.push(addControl(0, 5, 0)) // 4
  controlPoints.push(addControl(0, 5, 3)) // 5
  controlPoints.push(addControl(0, 0, 0)) // 6
  controlPoints.push(addControl(0, 0, 3)) // 7

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    mesh.children.forEach(() => {
      for (let i = 0; i < 36; i++) {
        geom.attributes.position.setX(i, controlPoints[pointIndex[i]].x)
        geom.attributes.position.setY(i, controlPoints[pointIndex[i]].y)
        geom.attributes.position.setZ(i, controlPoints[pointIndex[i]].z)
      }
      geom.attributes.position.needsUpdate = true
      geom.computeVertexNormals()
    })

    renderer.render(scene, camera)
  })

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    const gui = new dat.GUI()

    for (let i = 0; i < 8; i++) {
      const f1 = gui.addFolder(`Vertices${i + 1}`)
      f1.add(controlPoints[i], 'x', -10, 10, 0.1)
      f1.add(controlPoints[i], 'y', -10, 10, 0.1)
      f1.add(controlPoints[i], 'z', -10, 10, 0.1)
    }

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
      gui.destroy()
    }
  }, [stats.dom, renderer.domElement, controlPoints])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
