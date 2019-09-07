import { useEffect } from 'react'

import { getCanvas, initShaders, clearCanvas } from './webglUtils'

type RunGl = (gl: WebGLRenderingContext, program: WebGLProgram) => void

export const useWebgl = (VSHADER: string, FSHADER: string, cb: RunGl) => {
  useEffect(() => {
    const canvas = getCanvas()
    const gl = canvas.getContext('webgl') as WebGLRenderingContext
    const program = initShaders(gl, VSHADER, FSHADER)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)

    cb(gl, program)

    return () => clearCanvas(gl)
  }, [VSHADER, FSHADER, cb])
}
