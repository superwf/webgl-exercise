import * as React from 'react'
import { useWebgl, draw } from '../hooks'
import { mat4, vec3 } from 'gl-matrix'

const VSHADER = `
attribute vec4 a_Position;
attribute float a_PointSize;
attribute vec4 a_Color;
uniform mat4 u_rotate;
varying vec4 v_Color;
void main() {
  gl_Position = u_rotate * a_Position;
  gl_PointSize = a_PointSize;
  v_Color = a_Color;
}`

const FSHADER = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}`

let rotateAngel = 0

/* eslint-disable */
// 每行前两个是坐标x, y，第三个是点大小，后三个是颜色rgb
const pointData = new Float32Array([
  0.0, 0.5, 3.0, 1.0, 0.0, 0.0,
  -0.5, -0.5, 6.0, 0.0, 1.0, 0.0,
  0.5, -0.5, 9.0, 0.0, 0.0, 1.0
])
/* eslint-enable */
const FSIZE = pointData.BYTES_PER_ELEMENT

const drawPoints = (gl: WebGLRenderingContext, program: WebGLProgram) => {
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

  // 旋转矩阵
  const rotateMat = mat4.create()
  const rotate = vec3.create()
  mat4.fromRotation(rotateMat, rotateAngel, vec3.fromValues(0, 0, 1))
  const uRotate = gl.getUniformLocation(program, 'u_rotate')
  gl.uniformMatrix4fv(uRotate, false, rotateMat)

  // 点颜色
  const aColor = gl.getAttribLocation(program, 'a_Color')
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(aColor)

  gl.drawArrays(gl.POINTS, 0, 3)
}

const Point = () => {
  useWebgl(VSHADER, FSHADER, drawPoints)
  // 组件退出时恢复旋转角度
  React.useEffect(() => {
    return () => {
      rotateAngel = 0
    }
  }, [])
  return (
    <p>
      <button
        onClick={() => {
          rotateAngel += Math.PI / 18
          draw(VSHADER, FSHADER, drawPoints)
        }}
      >
        rotate 10 degree
      </button>
    </p>
  )
}

export default Point
