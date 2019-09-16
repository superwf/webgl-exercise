import * as React from 'react'
import { clearCanvas } from '../webglUtils'
import { mat4, vec3 } from 'gl-matrix'

import { useWebgl, draw } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjMatrix;
uniform mat4 u_rotate;
varying vec4 v_Color;

void main() {
  gl_Position = u_rotate * u_ProjMatrix * u_ViewMatrix * a_Position;
  gl_PointSize = 1.0;
  v_Color = a_Color;
}`

const FSHADER = `
precision mediump float;
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}`

/* eslint-disable */
const vertexData = new Float32Array([
    //顶点坐标颜色
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
    -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
    -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    0, -0.6, -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
    -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    0.5, -0.5, 0.0, 1.0, 0.4, 0.4
]);
/* eslint-enable */

const pointCount = 9
const FSIZE = vertexData.BYTES_PER_ELEMENT

let rotateAngel = 0

const drawPerspectiveProjection = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  clearCanvas(gl)
  const aPosition = gl.getAttribLocation(program, 'a_Position')
  const aColor = gl.getAttribLocation(program, 'a_Color')

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(aPosition)
  gl.enableVertexAttribArray(aColor)

  // 旋转矩阵
  const rotateMat = mat4.create()
  const rotate = vec3.create()
  mat4.fromRotation(rotateMat, rotateAngel, vec3.fromValues(0, 1, 0))
  const uRotate = gl.getUniformLocation(program, 'u_rotate')
  gl.uniformMatrix4fv(uRotate, false, rotateMat)

  //设置视点
  const ex = 0.0,
    ey = 0.0,
    ez = 3.0
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, [ex, ey, ez], [0.0, 0.0, -1], [0.0, 1.0, 0.0])
  const uViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix')
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix)

  // 设置投影
  const uProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix')

  const fov = 30,
    aspect = 1.0
  const near = 1.0,
    far = 100.0
  const projMatrix = mat4.create()
  mat4.perspective(projMatrix, fov, aspect, near, far)
  gl.uniformMatrix4fv(uProjMatrix, false, projMatrix)

  gl.enable(gl.DEPTH_TEST)

  gl.drawArrays(gl.TRIANGLES, 0, pointCount)
}

const OrthographicProjection = () => {
  useWebgl(VSHADER, FSHADER, drawPerspectiveProjection)

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
          draw(VSHADER, FSHADER, drawPerspectiveProjection)
        }}
      >
        rotate by Y axis
      </button>
      <button
        onClick={() => {
          rotateAngel -= Math.PI / 18
          draw(VSHADER, FSHADER, drawPerspectiveProjection)
        }}
      >
        rotate back
      </button>
    </p>
  )
}

export default OrthographicProjection
