import { useEffect, useRef } from 'react'

import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry'
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils'

import { myStats, useAnimationFrame, useWindowResize } from '@hooks/utils'

const Canvas = (): JSX.Element => {
  const sceneMountRef = useRef<HTMLDivElement>(null)
  const statsMountRef = useRef<HTMLDivElement>(null)

  const stats = myStats()

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 48), 0.1)
  camera.position.x = -50
  camera.position.y = 30
  camera.position.z = 20
  camera.lookAt(new THREE.Vector3(-10, 0, 0))

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

  const ambientLight = new THREE.AmbientLight(0x090909)
  scene.add(ambientLight)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-40, 40, 50)
  spotLight.castShadow = true
  scene.add(spotLight)

  const addGeometories = (scene: THREE.Scene) => {
    const geoms = []

    geoms.push(new THREE.CylinderGeometry(1, 4, 4))

    geoms.push(new THREE.BoxGeometry(2, 2, 2))

    geoms.push(new THREE.SphereGeometry(2))

    geoms.push(new THREE.IcosahedronGeometry(4))

    const points = [
      new THREE.Vector3(2, 2, 2),
      new THREE.Vector3(2, 2, -2),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(-2, 2, 2),
      new THREE.Vector3(2, -2, 2),
      new THREE.Vector3(2, -2, -2),
      new THREE.Vector3(-2, -2, -2),
      new THREE.Vector3(-2, -2, 2),
    ]
    geoms.push(new ConvexGeometry(points))

    const pts = []
    const detail = 0.1
    const radius = 3
    for (let angle = 0.0; angle < Math.PI; angle += detail) {
      pts.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius))
    }
    geoms.push(new THREE.LatheGeometry(pts, 12))

    geoms.push(new THREE.OctahedronGeometry(3))

    geoms.push(new ParametricGeometry(ParametricGeometries.mobius3d, 20, 10))

    geoms.push(new THREE.TetrahedronGeometry(3))

    geoms.push(new THREE.TorusGeometry(3, 1, 10, 10))

    geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20))

    let j = 0
    for (let i = 0; i < geoms.length; i++) {
      const materials = [
        new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, flatShading: true }),
        new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
      ]

      const mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials)
      mesh.traverse((e) => {
        e.castShadow = true
      })

      mesh.position.x = -24 + (i % 4) * 12
      mesh.position.y = 4
      mesh.position.z = -8 + j * 12

      if ((i + 1) % 4 === 0) {
        j++
      }

      scene.add(mesh)
    }
  }

  addGeometories(scene)

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
