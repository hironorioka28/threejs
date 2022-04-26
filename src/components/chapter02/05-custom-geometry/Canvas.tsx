import { useEffect, useRef } from 'react'

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
  const vertices = [
    { pos: [1, 3, 1], norm: [1, 0, 0], uv: [1, 1] }, // 0
    { pos: [1, 3, -1], norm: [1, 0, 0], uv: [1, 0] }, // 1
    { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 1] }, // 2
    { pos: [1, -1, -1], norm: [1, 0, 0], uv: [0, 0] }, // 3

    { pos: [-1, 3, -1], norm: [0, 1, 0], uv: [1, 0] }, // 4
    { pos: [-1, 3, 1], norm: [0, 1, 0], uv: [1, 1] }, // 5
    { pos: [1, 3, 1], norm: [0, 1, 0], uv: [0, 1] }, // 6 (0)
    { pos: [1, 3, -1], norm: [0, 1, 0], uv: [0, 0] }, // 7 (1)

    { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [1, 0] }, // 8 (6)
    { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 1] }, // 9 (7)
    { pos: [-1, 3, 1], norm: [-1, 0, 0], uv: [0, 1] }, // 10 (5)
    { pos: [-1, 3, -1], norm: [-1, 0, 0], uv: [0, 0] }, // 11 (4)

    { pos: [1, -1, 1], norm: [0, -1, 0], uv: [1, 1] }, // 12 (2)
    { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [0, 1] }, // 13 (7)
    { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [0, 0] }, // 14 (6)
    { pos: [1, -1, -1], norm: [0, -1, 0], uv: [1, 0] }, // 15 (3)

    { pos: [1, -1, 1], norm: [0, 0, 1], uv: [0, 0] }, // 16 (2)
    { pos: [1, 3, 1], norm: [0, 0, 1], uv: [1, 0] }, // 17 (0)
    { pos: [-1, 3, 1], norm: [0, 0, 1], uv: [1, 1] }, // 18 (5)
    { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 1] }, // 19 (7)

    { pos: [1, -1, -1], norm: [0, 0, -1], uv: [1, 0] }, // 20 (3)
    { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 1] }, // 21 (6)
    { pos: [-1, 3, -1], norm: [0, 0, -1], uv: [0, 1] }, // 22 (4)
    { pos: [1, 3, -1], norm: [0, 0, -1], uv: [0, 0] }, // 23 (1)
  ]
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  vertices.map((vertex) => {
    positions.push(...vertex.pos)
    normals.push(...vertex.norm)
    uvs.push(...vertex.uv)
  })
  geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geom.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
  geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geom.setIndex([
    0, 2, 3, 0, 3, 1,

    7, 4, 5, 7, 5, 6,

    8, 9, 10, 8, 10, 11,

    12, 13, 14, 12, 14, 15,

    17, 19, 16, 17, 18, 19,

    20, 21, 22, 20, 22, 23,
  ])
  const materials = [
    new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
  ]
  const mesh = SceneUtils.createMultiMaterialObject(geom, materials)
  mesh.children.forEach((e) => {
    e.castShadow = true
  })
  scene.add(mesh)

  useWindowResize(camera, renderer, 500)

  useAnimationFrame(() => {
    stats.update()

    renderer.render(scene, camera)
  })

  useEffect(() => {
    const sceneMount = sceneMountRef.current
    const statsMount = statsMountRef.current

    sceneMount?.appendChild(renderer.domElement)
    statsMount?.appendChild(stats.dom)

    return () => {
      sceneMount?.removeChild(renderer.domElement)
      statsMount?.removeChild(stats.dom)
    }
  }, [stats.dom, renderer.domElement])

  return (
    <>
      <div ref={sceneMountRef} />
      <div ref={statsMountRef} />
    </>
  )
}

export default Canvas
