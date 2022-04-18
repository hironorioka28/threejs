import React, { useEffect } from 'react'

import * as dat from 'dat.gui'
import * as THREE from 'three'

export const useGui = (
  scene: THREE.Scene,
  planeGeometory: THREE.PlaneGeometry,
  setRotationSpeed: React.Dispatch<React.SetStateAction<number>>,
  setSceneInfo: React.Dispatch<React.SetStateAction<THREE.Scene>>,
) => {
  class Controls {
    rotationSpeed = 0.02

    numberOfObjects = scene.children.length

    removeCube() {
      const allChildren = scene.children
      const lastObject = allChildren[allChildren.length - 1]

      if (lastObject instanceof THREE.Mesh) {
        scene.remove(lastObject)

        this.numberOfObjects = scene.children.length
      }
    }

    addCube() {
      console.log('this is', this)
      const cubeSize = Math.ceil(Math.random() * 3)
      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })

      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.castShadow = true
      cube.name = `cube-${scene.children.length}`
      cube.position.x = -30 + Math.round(Math.random() * planeGeometory.parameters.width)
      cube.position.y = Math.round(Math.random() * 5)
      cube.position.z = -20 + Math.round(Math.random() * planeGeometory.parameters.height)

      scene.add(cube)

      this.numberOfObjects = scene.children.length
    }

    outputObjects() {
      console.log(scene.children)
    }
  }

  const controls = new Controls()

  useEffect(() => {
    console.log('call useEffect in useGui', scene.children)
    const gui = new dat.GUI()

    gui.add(controls, 'rotationSpeed', 0, 0.5).onChange((v) => setRotationSpeed(v))
    gui.add(controls, 'addCube')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'outputObjects')
    gui.add(controls, 'numberOfObjects').listen()

    setSceneInfo(scene)

    return () => {
      gui.destroy()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRotationSpeed, setSceneInfo])
}
