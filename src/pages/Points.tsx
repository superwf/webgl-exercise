import * as React from 'react'
import { getCanvas, initShaders, clearCanvas } from '../webglUtils'
import { useWebgl } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}`

const FSHADER = `void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`

const pointData = new Float32Array([0.0, 0.5, 3.0, -0.5, -0.5, 6.0, 0.5, -0.5, 9.0])

const draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  const FSIZE = pointData.BYTES_PER_ELEMENT
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPositon, 2, gl.FLOAT, false, FSIZE * 3, 0)
  gl.enableVertexAttribArray(aPositon)

  const aPointSize = gl.getAttribLocation(program, 'a_PointSize')
  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
  gl.enableVertexAttribArray(aPointSize)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 3)
}

const Point = () => {
  useWebgl(VSHADER, FSHADER, draw)
  return <p>drow three point</p>
}

export default Point
