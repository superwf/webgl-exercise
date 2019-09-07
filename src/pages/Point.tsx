import * as React from 'react'
import { getCanvas, initShaders, clearCanvas } from '../webglUtils'
import { useWebgl } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}`

const FSHADER = `void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`

const draw = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttrib3f(aPositon, 0.0, 0.0, 0.0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 1)
}

const Point = () => {
  useWebgl(VSHADER, FSHADER, draw)
  return <p>drow one point</p>
}

export default Point
