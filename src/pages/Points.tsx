import * as React from 'react'
import { getCanvas, initShaders, clearCanvas } from '../webglUtils'
import { useWebgl } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec4 a_Color;
varying vec4 v_Color;
void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
  v_Color = a_Color;
}`

const FSHADER = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}`

/* eslint-disable */
// 每行前两个是坐标x, y，第三个是点大小，后三个是颜色rgb
const pointData = new Float32Array([
  0.0, 0.5, 3.0, 1.0, 0.0, 0.0,
  -0.5, -0.5, 6.0, 0.0, 1.0, 0.0,
  0.5, -0.5, 9.0, 0.0, 0.0, 1.0
])
/* eslint-enable */

const draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const FSIZE = pointData.BYTES_PER_ELEMENT
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW)

  // 点坐标
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttribPointer(aPositon, 2, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(aPositon)

  // 点尺寸
  const aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2)
  gl.enableVertexAttribArray(aPointSize)

  // 点颜色
  const aColor = gl.getAttribLocation(program, 'a_Color')
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(aColor)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 3)
}

const Point = () => {
  useWebgl(VSHADER, FSHADER, draw)
  return <p>drow three point</p>
}

export default Point
