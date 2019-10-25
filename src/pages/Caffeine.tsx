import * as React from 'react'
import * as THREE from 'three'
import { getCanvasContextAndProgram } from '../webglUtils'
import * as dat from 'dat.gui'
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader'
// import { WEBGL } from 'three/examples/jsm/WebGL'

const loader = new PDBLoader()

let ticker: any

const useThree = () => {
  React.useEffect(() => {
    const gui = new dat.GUI()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000)
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    const cameraGui = gui.addFolder('camera position')
    cameraGui.add(camera.rotation, 'x')
    cameraGui.add(camera.rotation, 'y')
    cameraGui.add(camera.rotation, 'z')
    cameraGui.open()

    const { canvas } = getCanvasContextAndProgram()
    const context = canvas.getContext('webgl2', { alpha: false }) as WebGLRenderingContext
    const renderer = new THREE.WebGLRenderer({ canvas, context })
    renderer.setClearColor(0)

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(1, 1, 1)
    scene.add(light)

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8)
    light1.position.set(-1, -1, 1)
    scene.add(light1)

    loader.load('./caffeine.pdb', pdb => {
      const { geometryAtoms, geometryBonds, json } = pdb

      var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 2)

      geometryAtoms.computeBoundingBox()
      const offset = new THREE.Vector3()
      geometryAtoms.boundingBox.getCenter(offset).negate()

      geometryAtoms.translate(offset.x, offset.y, offset.z)
      geometryBonds.translate(offset.x, offset.y, offset.z)

      var positions = geometryAtoms.getAttribute('position')
      var colors = geometryAtoms.getAttribute('color')

      var position = new THREE.Vector3()
      var color = new THREE.Color()

      const root = new THREE.Group()

      for (let i = 0; i < positions.count; i++) {
        position.x = positions.getX(i)
        position.y = positions.getY(i)
        position.z = positions.getZ(i)

        color.r = colors.getX(i)
        color.g = colors.getY(i)
        color.b = colors.getZ(i)

        const material = new THREE.MeshPhongMaterial({ color })
        const object = new THREE.Mesh(sphereGeometry, material)
        object.position.copy(position)
        object.position.multiplyScalar(5)
        object.scale.multiplyScalar(2)
        root.add(object)
      }

      positions = geometryBonds.getAttribute('position')

      var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
      for (let i = 0; i < positions.count; i += 2) {
        const start = new THREE.Vector3()
        const end = new THREE.Vector3()
        start.x = positions.getX(i)
        start.y = positions.getY(i)
        start.z = positions.getZ(i)

        end.x = positions.getX(i + 1)
        end.y = positions.getY(i + 1)
        end.z = positions.getZ(i + 1)

        start.multiplyScalar(5)
        end.multiplyScalar(5)

        const m = new THREE.MeshBasicMaterial({ color: 0xff0000 })

        const object = new THREE.Mesh(boxGeometry, m)
        object.position.copy(start)
        object.position.lerp(end, 0.5)
        object.scale.set(0.1, 0.1, start.distanceTo(end))
        object.lookAt(end)
        root.add(object)
      }

      scene.add(root)

      const groupGui = gui.addFolder('group rotation')
      groupGui.add(root.rotation, 'x')
      groupGui.add(root.rotation, 'y')
      groupGui.add(root.rotation, 'z')

      groupGui.open()
    })

    const render = () => {
      renderer.render(scene, camera)
      ticker = requestAnimationFrame(render)
    }

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

THREE.Shape

export default Three
