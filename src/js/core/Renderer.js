"use strict";

export default class Renderer {

    constructor ( canvas, options ) {

        this.canvas = canvas;

        options = options || {};
        this.contain = options.hasOwnProperty('contain') ? options.contain : true;

        this.gl = this.initWebGL( canvas );
        this.initViewport( this.gl, canvas );

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
