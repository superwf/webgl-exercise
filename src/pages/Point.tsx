import * as React from 'react'
import foo from '../App'
import { getCanvas, initShaders, clearCanvas } from '../webglUtils'

const VSHADER = `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}`

const FSHADER = `void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}`


const Point = () => {
  React.useEffect(() => {
    const canvas = getCanvas()
    const gl = canvas.getContext('webgl') as WebGLRenderingContext
    const program = initShaders(gl, VSHADER, FSHADER)
    const aPositon = gl.getAttribLocation(program, 'a_Position')
    gl.vertexAttrib3f(aPositon, 0.0, 0.0, 0.0)

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)

    return () => clearCanvas(gl)
  }, [])
  return <p>drow one point</p>
}

export default Point
