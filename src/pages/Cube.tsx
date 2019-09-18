import * as React from 'react'
import { clearCanvas } from '../webglUtils'
import { mat4, vec3 } from 'gl-matrix'

import { useWebgl, draw } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vec4 v_Color;
void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
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

/* eslint-disable */
export const vertexData = new Float32Array([
  1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, //front面 v0-4
  1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, //right v0345
  1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, //up v0561
  -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, //left 
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, //down
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0 //back
]);

export const colorData = new Float32Array([
  0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
  0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //right
  1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //up
  1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
  1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, //btm
  0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 //back
]);

export const colorData_ALLWHITE = new Float32Array([
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 
]);

export const indicesData = new Uint8Array([
  0, 1, 2, 0, 2, 3,
  4, 5, 6, 4, 6, 7,
  8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19,
  20, 21, 22, 20, 22, 23
]);

/* eslint-enable */

// 初始化顶点缓冲区
// 坐标值 或者 颜色值
export function initArrayBuffer(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  data: Float32Array,
  name: string,
  num: number,
  type: number,
) {
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  const vertexLoction = gl.getAttribLocation(program, name)
  gl.vertexAttribPointer(vertexLoction, num, type, false, 0, 0)
  gl.enableVertexAttribArray(vertexLoction)
}

export function initIndexBuffer(gl: WebGLRenderingContext, indexData: ArrayBuffer) {
  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW)
}

const drawCube = (gl: WebGLRenderingContext, program: WebGLProgram) => {
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
  initArrayBuffer(gl, program, colorData, 'a_Color', 3, gl.FLOAT)
  initIndexBuffer(gl, indicesData)
  const n = indicesData.length

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  // gl.drawArrays(gl.TRIANGLES, 0, n);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
}

const Cube = () => {
  useWebgl(VSHADER, FSHADER, drawCube)

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
          draw(VSHADER, FSHADER, drawCube)
        }}
      >
        rotate
      </button>
      <button
        onClick={() => {
          rotateAngel -= Math.PI / 18
          draw(VSHADER, FSHADER, drawCube)
        }}
      >
        rotate back
      </button>
    </p>
  )
}

export default Cube
