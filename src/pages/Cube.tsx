import * as React from 'react'
import { clearCanvas } from '../webglUtils'
import { mat4, vec3 } from 'gl-matrix'

import { useWebgl, draw } from '../hooks'

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 u_MvpMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = u_MvpMatrix * a_Position;
        v_Color = a_Color;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

/* eslint-disable */
const cubicAll36Vertexs = new Float32Array([
  1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, //v0 v1 v2
  1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, //v0 v2 v3
  1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, //v0 v3 v4
  1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, //v0 v4 v5
  1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, //v5 v6 v7
  1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, //v5 v7 v4
  -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, //v1 v2 v6
  -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, //v6 v2 v7
  1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, //v0 v6 v5
  1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, //v0 v1 v6
  1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, //v3 v7 v4
  1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0 //v3 v3 v7
])
const pointCount = cubicAll36Vertexs.length / 3

const vertexDataAndColors = new Float32Array([
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, //v0 white
  -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, //v1 品红
  -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, //v2 红色
  1.0, -1.0, 1.0, 1.0, 1.0, 0.0, //v3 黄色
  1.0, -1.0, -1.0, 0.0, 1.0, 0.0, //v4
  1.0, 1.0, -1.0, 0.0, 1.0, 1.0, //v5
  -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, //v6
  -1.0, -1.0, -1.0, 0.0, 0.0, 0.0 //v7 
])

const indices = new Uint8Array([
  0, 1, 2, 0, 2, 3, //front
  0, 3, 4, 0, 4, 5, //right
  0, 5, 6, 0, 6, 1, //up
  1, 6, 7, 1, 7, 2, //left
  7, 4, 3, 7, 3, 2, //bottom
  4, 7, 6, 4, 6, 5 //behind
])
/* eslint-enable */

const drawCube = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, cubicAll36Vertexs, gl.STATIC_DRAW)
  const a_Position = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  // 传入颜色
  const vertexColorBuffer = gl.createBuffer()
  const indicesBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexDataAndColors, gl.STATIC_DRAW)

  const FSIZE = vertexDataAndColors.BYTES_PER_ELEMENT
  const a_Color = gl.getAttribLocation(program, 'a_Color')
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_Color)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
}
