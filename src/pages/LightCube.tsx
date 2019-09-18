import * as React from 'react'
import { clearCanvas } from '../webglUtils'
import { mat4, vec3 } from 'gl-matrix'

import { useWebgl, draw } from '../hooks'
import { initIndexBuffer, initArrayBuffer, vertexData, indicesData, colorData, colorData_ALLWHITE } from './Cube'

const VSHADER = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  attribute vec4 a_Normal; //法向量
  uniform vec3 u_LightColor; //光照颜色
  uniform vec3 u_LightDirection; //光照方向 //=归一化后的世界坐标
  varying vec4 v_Color;
  void main() {
      gl_Position = u_MvpMatrix * a_Position;

      //法向量进行归一化
      vec3 normal = normalize(vec3(a_Normal));
      //计算cos入射角 当角度大于90 说明光照在背面 赋值为0
      float nDotLight = max(dot(u_LightDirection, normal), 0.0);
      //计算反射光颜色
      vec3 diffuse = u_LightColor * vec3(a_Color) * nDotLight;
      v_Color = vec4(diffuse, a_Color.a);
  }
`

const FSHADER = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
      gl_FragColor = v_Color;
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

let rotateAngel = 0

const drawLightCube = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const viewMat = mat4.lookAt(mat4.create(), [3, 3, 7], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
  const modelMat = mat4.fromRotation(mat4.create(), rotateAngel, [0, 1, 0])

  const fov = Math.PI / 3
  const aspect = 1.0
  const near = 1.0
  const far = 100.0
  const projMatrix = mat4.perspective(mat4.create(), fov, aspect, near, far)

  const vpMat = mat4.multiply(mat4.create(), projMatrix, viewMat)
  const mvpMat = mat4.multiply(mat4.create(), vpMat, modelMat)
  const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix')
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat)

  initArrayBuffer(gl, program, vertexData, 'a_Position', 3, gl.FLOAT)
  initArrayBuffer(gl, program, colorData_ALLWHITE, 'a_Color', 3, gl.FLOAT)
  initIndexBuffer(gl, indicesData)
  const n = indicesData.length

  //设置光照颜色
  const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)
  //设置光照方向
  const u_LightDirection = gl.getUniformLocation(program, 'u_LightDirection')
  const lightDirection = vec3.fromValues(0.5, 3.0, 4.0)
  vec3.normalize(lightDirection, lightDirection)
  gl.uniform3fv(u_LightDirection, lightDirection)
  //通过设置顶点的法向量 确定面的法向量
  const normalData = new Float32Array([
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
    0.0,
    0.0,
    -1.0,
  ])
  initArrayBuffer(gl, program, normalData, 'a_Normal', 3, gl.FLOAT)

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)

  let tempMatrix = mat4.identity(mat4.create())
  mat4.multiply(tempMatrix, tempMatrix, projMatrix)
  mat4.multiply(tempMatrix, tempMatrix, viewMat)
  // const tick = () => {
  //   const mat = animateRotate(gl, 3)
  //   const mvpMat = mat4.multiply(mat4.create(), tempMatrix, mat)
  //   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat)
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  //   gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
  //   requestAnimationFrame(tick)
  // }
  // requestAnimationFrame(tick)
}

let CURRENT_MODEL_MATRIX = mat4.create()
let CURRENT_TIMESTAMP = Date.now()
function animateRotate(webgl: WebGLRenderingContext, speed: number) {
  const now = Date.now()
  const interval = now - CURRENT_TIMESTAMP
  CURRENT_TIMESTAMP = now
  const angle = (interval * speed) / 1000
  //之所以不累加是因为
  mat4.rotate(CURRENT_MODEL_MATRIX, CURRENT_MODEL_MATRIX, angle, vec3.fromValues(0, -1, 0))
  // CURRENT_MODEL_MATRIX.setRotate(angle, 0, -1, 0)
  return CURRENT_MODEL_MATRIX
}

const LightCube = () => {
  useWebgl(VSHADER, FSHADER, drawLightCube)

  // 组件退出时恢复旋转角度
  React.useEffect(() => {
    return () => {
      rotateAngel = 0
    }
  }, [])
  return (
    <p>
      draw with perspective projection
      <button
        onClick={() => {
          rotateAngel += Math.PI / 18
          draw(VSHADER, FSHADER, drawLightCube)
        }}
      >
        rotate
      </button>
      <button
        onClick={() => {
          rotateAngel -= Math.PI / 18
          draw(VSHADER, FSHADER, drawLightCube)
        }}
      >
        rotate back
      </button>
    </p>
  )
}

export default LightCube
