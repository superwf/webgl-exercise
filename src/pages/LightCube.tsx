import * as React from 'react'
import { clearCanvas } from '../webglUtils'
import { mat4, vec3 } from 'gl-matrix'

import { useWebgl, draw } from '../hooks'
import { initIndexBuffer, initArrayBuffer, vertexData, indicesData, colorData, colorData_ALLWHITE } from './Cube'

const VSHADER = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_VpMatrix; //view and range mat
  uniform mat4 u_ModelMatrix; //model mat
  uniform mat4 u_ReverseModelMat; //模型矩阵的逆转置
  attribute vec4 a_Normal; //法向量
  varying vec4 v_Color;
  varying vec3 v_Nomral;
  varying vec4 v_Position;
  void main() {
      gl_Position = u_VpMatrix * u_ModelMatrix * a_Position;

      //漫反射光颜色
      //法向量进行归一化
      v_Nomral = normalize(vec3(u_ReverseModelMat * a_Normal));
      //变化后的坐标 -> 世界坐标
      v_Position = u_ModelMatrix * a_Position;

      v_Color = a_Color;
  }
`

const FSHADER = `
  precision mediump float;
  uniform vec3 u_LightColor; //光颜色强度
  uniform vec3 u_LightPosition; //光源位置
  uniform vec3 u_AmbientLight; // 环境光
  varying vec3 v_Nomral;
  varying vec4 v_Position;
  varying vec4 v_Color;
  void main() {
      //光线方向并归一化
      vec3 lightDirection = normalize(u_LightPosition - vec3(v_Position));
      //计算cos入射角 当角度大于90 说明光照在背面 赋值为0
      float nDotLight = max(dot(lightDirection, v_Nomral), 0.0);
      //计算反射光颜色
      vec3 diffuse = u_LightColor * v_Color.rgb * nDotLight;
      // 环境反射光颜色
      vec3 ambient = u_AmbientLight * v_Color.rgb;

      gl_FragColor = vec4(diffuse + ambient, v_Color.a);
  }
`

let rotateAngel = 0

const drawLightCube = (gl: WebGLRenderingContext, program: WebGLProgram) => {
  const viewMat = mat4.lookAt(mat4.create(), [3, 3, 7], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])
  const modelMat = mat4.fromRotation(mat4.create(), rotateAngel, [0, 1, 0])

  const fov = Math.PI / 3
  const aspect = 1.0
  const near = 1.0
  const far = 100.0
  const projMatrix = mat4.perspective(mat4.create(), fov, aspect, near, far)

  const vpMat = mat4.multiply(mat4.create(), projMatrix, viewMat)

  const u_VpMatrix = gl.getUniformLocation(program, 'u_VpMatrix')
  gl.uniformMatrix4fv(u_VpMatrix, false, vpMat)

  const u_ModelMatrix = gl.getUniformLocation(program, 'u_ModelMatrix')
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMat)

  // model逆转置，计算光线角度
  let reverseModelMat = mat4.invert(mat4.create(), modelMat)
  reverseModelMat = mat4.transpose(mat4.create(), reverseModelMat!)
  const u_ReverseModelMat = gl.getUniformLocation(program, 'u_ReverseModelMat')
  gl.uniformMatrix4fv(u_ReverseModelMat, false, reverseModelMat)

  initArrayBuffer(gl, program, vertexData, 'a_Position', 3, gl.FLOAT)
  initArrayBuffer(gl, program, colorData_ALLWHITE, 'a_Color', 3, gl.FLOAT)
  initIndexBuffer(gl, indicesData)
  const n = indicesData.length

  //设置光照颜色
  const u_LightColor = gl.getUniformLocation(program, 'u_LightColor')
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0)

  //设置点光源位置
  const u_LightPosition = gl.getUniformLocation(program, 'u_LightPosition')
  gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0)

  //通过设置顶点的法向量 确定面的法向量
  /* eslint-disable */
  const normalData = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
  ])
  /* eslint-enable */
  initArrayBuffer(gl, program, normalData, 'a_Normal', 3, gl.FLOAT)

  //设置环境光
  const u_AmbientLight = gl.getUniformLocation(program, 'u_AmbientLight')
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)

  // let tempMatrix = mat4.identity(mat4.create())
  // mat4.multiply(tempMatrix, tempMatrix, projMatrix)
  // mat4.multiply(tempMatrix, tempMatrix, viewMat)
  // const tick = () => {
  //   const mat = animateRotate(gl, 3)
  //   const mvpMat = mat4.multiply(mat4.create(), tempMatrix, mat)
  //   gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMat)
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  //   gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
  //   requestAnimationFrame(tick)
  // }
  // requestAnimationFrame(tick)
}

let CURRENT_MODEL_MATRIX = mat4.create()
let CURRENT_TIMESTAMP = Date.now()
function animateRotate(webgl: WebGLRenderingContext, speed: number) {
  const now = Date.now()
  const interval = now - CURRENT_TIMESTAMP
  CURRENT_TIMESTAMP = now
  const angle = (interval * speed) / 1000
  //之所以不累加是因为
  mat4.rotate(CURRENT_MODEL_MATRIX, CURRENT_MODEL_MATRIX, angle, vec3.fromValues(0, -1, 0))
  // CURRENT_MODEL_MATRIX.setRotate(angle, 0, -1, 0)
  return CURRENT_MODEL_MATRIX
}

const LightCube = () => {
  useWebgl(VSHADER, FSHADER, drawLightCube)

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
          draw(VSHADER, FSHADER, drawLightCube)
        }}
      >
        rotate
      </button>
      <button
        onClick={() => {
          rotateAngel -= Math.PI / 18
          draw(VSHADER, FSHADER, drawLightCube)
        }}
      >
        rotate back
      </button>
    </p>
  )
}

export default LightCube
