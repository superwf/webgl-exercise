import * as React from 'react'
import { useWebgl } from '../hooks'

const VSHADER = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
  gl_Position = a_Position;
  v_TexCoord = a_TexCoord;
}`

const FSHADER = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main() {
  gl_FragColor = texture2D(u_Sampler, v_TexCoord);
}`

/* eslint-disable */
const pointData = new Float32Array([
  -0.5, 0.5, 0.0, 1.0,
  -0.5, -0.5, 0.0, 0.0,
  0.5, 0.5, 1.0, 1.0,
  0.5, -0.5, 1.0, 0.0,
])
/* eslint-disable */

const FSIZE = pointData.BYTES_PER_ELEMENT

function loadImage (url: string): Promise<HTMLImageElement> {
    return new Promise(function(resolve, reject){
        var img = new Image();
        img.onload = () => { resolve(img) };
        img.onerror = (e) => { console.error('Failed to load image!'); reject(e)};
        img.src = url;
    });
}


const draw = async (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW)

  // 点坐标
  const aPositon = gl.getAttribLocation(program, 'a_Position')
  gl.vertexAttribPointer(aPositon, 2, gl.FLOAT, false, FSIZE * 4, 0)
  gl.enableVertexAttribArray(aPositon)

  // 纹理坐标
  const aTexCoord = gl.getAttribLocation(program, 'a_TexCoord')
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2)
  gl.enableVertexAttribArray(aTexCoord)

  // 创建纹理
  const texture = gl.createTexture()
  const uSampler = gl.getUniformLocation(program, 'u_Sampler')

  // const image = await loadImage('sky.jpg')
  const image = await loadImage('/logo192.png')
  // Y轴反转
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

  /* 当图片分辨率不是2的倍数时的解决
   https://blog.csdn.net/qq_30100043/article/details/77885107
   */
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_SHORT_4_4_4_4, image)
  gl.uniform1i(uSampler, 0)

  // gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

const Sampler = () => {
  useWebgl(VSHADER, FSHADER, draw)
  return <p>drow with sampler</p>
}

export default Sampler
