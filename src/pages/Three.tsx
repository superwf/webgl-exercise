import * as React from 'react'
import * as THREE from 'three'
import { getCanvasContextAndProgram } from '../webglUtils'
import * as dat from 'dat.gui'
import { WEBGL } from 'three/examples/jsm/WebGL'

console.log(WEBGL.isWebGL2Available())

let ticker: any

const useThree = () => {
  React.useEffect(() => {
    const gui = new dat.GUI()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
    // const camera = new THREE.OrthographicCamera(-20, 20, -20, 20, 1, 1000)
    const { canvas } = getCanvasContextAndProgram()
    const context = canvas.getContext('webgl2', { alpha: false }) as WebGLRenderingContext
    const renderer = new THREE.WebGLRenderer({ canvas, context })
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

    const cameraGui = gui.addFolder('camera position')
    cameraGui.add(camera.position, 'x')
    cameraGui.add(camera.position, 'y')
    cameraGui.add(camera.position, 'z')

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0
    scene.add(cube)

    const texLoader = new THREE.TextureLoader()
    texLoader.load('/logo192.png', tex => {
      const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
      // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true })
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(2, 2)
      const sphereMaterial = new THREE.MeshBasicMaterial({ map: tex })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      Object.assign(sphere.position, {
        x: 20,
        y: 4,
        z: 2,
      })
      scene.add(sphere)

      const sphereGui = gui.addFolder('sphere position')
      sphereGui.add(sphere.rotation, 'x')
      sphereGui.add(sphere.rotation, 'y')
      sphereGui.add(sphere.rotation, 'z')
      sphereGui.add(sphere.scale, 'x')
      sphereGui.add(sphere.scale, 'y')
      sphereGui.add(sphere.scale, 'z')
    })

    // const text = new THREE.TextGeometry('ABC', {
    //   font: 'monospace',
    //   size: 80,
    //   height: 5,
    //   curveSegments: 12,
    //   bevelEnabled: true,
    //   bevelThickness: 10,
    //   bevelSize: 8,
    //   bevelSegments: 5,
    // })
    // scene.add(text)

    // section.appendChild(renderer.domElement)
    renderer.renderBufferDirect
    const render = () => {
      renderer.render(scene, camera)
      ticker = requestAnimationFrame(render)
    }

    const cubeGui = gui.addFolder('cube rotation')
    cubeGui.add(cube.rotation, 'x')
    cubeGui.add(cube.rotation, 'y')
    cubeGui.add(cube.rotation, 'z')

    cubeGui.open()

    ticker = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(ticker)
      gui.close()
    }
  }, [])
}

const Three = () => {
  useThree()
  return <p> use three.js render </p>
}

export default Three
