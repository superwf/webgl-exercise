import * as React from 'react'
import * as THREE from 'three'
import { getCanvasContextAndProgram } from '../webglUtils'
import * as dat from 'dat.gui'

const useThree = () => {
  React.useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    const { canvas } = getCanvasContextAndProgram()
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setClearColor(0)
    // renderer.setSize(500, 500)

    const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0
    scene.add(plane)

    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0
    scene.add(cube)

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    Object.assign(sphere.position, {
      x: 20,
      y: 4,
      z: 2,
    })
    scene.add(sphere)

    // section.appendChild(renderer.domElement)
    renderer.renderBufferDirect
    renderer.render(scene, camera)

    const gui = new dat.GUI()
  })
}

const Three = () => {
  useThree()
  return <p> use three.js render </p>
}

export default Three
