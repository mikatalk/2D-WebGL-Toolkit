"use strict";

export default class Renderer {

    constructor ( canvas, options ) {

        this.canvas = canvas;

        options = options || {};
        this.contain = options.hasOwnProperty('contain') ? options.contain : true;

        this.gl = this.initWebGL( canvas );
        this.initViewport( this.gl, canvas );
        this.initMatrices();

        window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
        this.onWindowResize();
        
        console.log('[Renderer] initialized.');

    }

    initWebGL (canvas) {
        let gl;
        try {
            gl = this.canvas.getContext('webgl', {
                alpha: true,
                // depth: true,
                // stencil:true,
                antialias: true,
                // premultipliedAlpha: true,
                preserveDrawingBuffer: true ,
                // failIfMajorPerformanceCaveat: true 
            });
        } catch (e) {
            var msg = "Error creating WebGL Context!: " + e.toString();
            alert(msg);
            throw Error(msg);
        }
        return gl;        
    }

    initViewport (gl, canvas) {
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    initMatrices () {

        // The transform matrix for the square - translate back in Z for the camera
        this.modelViewMatrix = new Float32Array(
               [1, 0, 0, 0,
                0, 1, 0, 0, 
                0, 0, 1, 0, 
                0, 0, -1.2, 1]);
       
        // The projection matrix (for a 45 degree field of view)
        this.projectionMatrix = new Float32Array(
               [2.41421, 0, 0, 0,
                0, 2.41421, 0, 0,
                0, 0, -1.002002, -1, 
                0, 0, -0.2002002, 0]);
    }

    clear () {

        this.gl.bindTexture( this.gl.TEXTURE_2D, null );
        this.gl.bindRenderbuffer( this.gl.RENDERBUFFER, null );
        this.gl.bindFramebuffer( this.gl.FRAMEBUFFER, null );

        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

    }

    onWindowResize() {

        let scale = 1/(this.contain?Math.max:Math.min)( this.canvas.width/window.innerWidth, this.canvas.height/window.innerHeight );
        canvas.style.transformOrigin = 'top left';
        canvas.style.left = ( ( window.innerWidth - this.canvas.width*scale) / 2 ).toFixed(2) + 'px';
        canvas.style.top = ( ( window.innerHeight - this.canvas.height*scale) / 2 ).toFixed(2) + 'px';
        canvas.style.transform = 'scale('+scale.toFixed(2)+')';

    }
}
