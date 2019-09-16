import { useEffect } from 'react'

import { getCanvasContextAndProgram, initShaders, clearCanvas } from './webglUtils'

type RunGl = (gl: WebGLRenderingContext, program: WebGLProgram) => void

export const draw = (VSHADER: string, FSHADER: string, drawFunc: RunGl) => {
  const { gl, program } = getCanvasContextAndProgram()
  initShaders(gl, program, VSHADER, FSHADER)
  clearCanvas(gl)
  drawFunc(gl, program)
  return {
    gl,
    program,
  }
}

export const useWebgl = (VSHADER: string, FSHADER: string, cb: RunGl) => {
  useEffect(() => {
    const { gl, program } = draw(VSHADER, FSHADER, cb)
    // const { canvas, gl, program } = getCanvasContextAndProgram()
    // initShaders(gl, program, VSHADER, FSHADER)
    // clearCanvas(gl)

    // cb(gl, program)

    return () => {
      clearCanvas(gl)
      const shaders = gl.getAttachedShaders(program)
      gl.deleteProgram(program)
      if (shaders) {
        shaders.forEach(shader => {
          gl.deleteShader(shader)
        })
      }
    }
  }, [VSHADER, FSHADER, cb])
}
