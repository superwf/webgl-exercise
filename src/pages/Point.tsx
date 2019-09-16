import * as React from 'react'
import { useWebgl, draw } from '../hooks'
import { clearCanvas } from '../webglUtils'

const VSHADER = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}`

const FSHADER = `void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`

const drawPoint = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  clearCanvas(gl)
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttrib3f(aPositon, 0.0, 0.0, 0.0)

  gl.drawArrays(gl.POINTS, 0, 1)
}

const drawMovePoint = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  clearCanvas(gl)
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttrib3f(aPositon, 0.3, 0.0, 0.0)

  gl.drawArrays(gl.POINTS, 0, 1)
}

const Point = () => {
  useWebgl(VSHADER, FSHADER, drawPoint)
  return (
    <p>
      <button onClick={() => draw(VSHADER, FSHADER, drawMovePoint)}>move to right</button>
      <button onClick={() => draw(VSHADER, FSHADER, drawPoint)}>restore</button>
    </p>
  )
}

export default Point
