"use strict";

import Layer from './Layer';
import Stage from './../core/Stage';

const FRAGMENT = `

    precision mediump float;

    varying vec2 uv;
    
    uniform sampler2D image;

    void main() { 
        gl_FragColor = texture2D(image, uv);
    }
`;

const VERTEX = `
    
    precision mediump float;

    const vec2 mid=vec2(0.5,0.5);
    attribute vec2 vertexPosition;
    varying vec2 uv;
    
    void main() {
       uv = vertexPosition.xy * mid + mid; // scale vertex attribute to [0-1] range
       gl_Position = vec4(vertexPosition.xy,0.0,1.0);
    }
    
`;


export default class LayerImage extends Layer {

    constructor (gl, img) {

        
        super(gl);

        this.texture = gl.createTexture();
        this.img = img;
        this.ready = true;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.program = this.initShader( gl );       

        this.lifetime = 0;

        this.dot = new Float32Array([0.5, 0.5, 30.0, .5]); // x, y, radius, trail
    }

    initShader (gl) {

        // load and compile the fragment and vertex shader
        let fragmentShader = super.createShader( FRAGMENT, gl.FRAGMENT_SHADER);
        let vertexShader = super.createShader( VERTEX, gl.VERTEX_SHADER);

        // link them together into a new program
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        // get pointers to the shader params
        this.shaderVertexPositionAttribute = gl.getAttribLocation(this.program, 'vertexPosition');
        gl.enableVertexAttribArray(this.shaderVertexPositionAttribute);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error( '[LayerBall] Could not initialize shaders' );
        }

        return this.program;
    }

    render ( elapsedTime ) {
      
        let gl = this.gl;

        // set the vertex buffer to be drawn
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);

        // set the shader
        gl.useProgram(this.program);

        // bind comon attributes and uniforms
        gl.vertexAttribPointer(this.shaderVertexPositionAttribute, this.geometry.vertSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.program.samplerUniform, 0);
    
        // draw
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

    }
}
