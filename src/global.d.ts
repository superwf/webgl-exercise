declare global {

  interface IWebGLRenderingContext extends WebGLObject {
    bindFramebuffer(target: number, framebuffer: WebGLFramebuffer): void;
  }

  interface Window {
    WebGLRenderingContext: IWebGLRenderingContext
  }
}
