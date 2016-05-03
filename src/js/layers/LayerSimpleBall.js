"use strict";

import Layer from './Layer';
import Stage from './../core/Stage';

const FRAGMENT = `

    precision mediump float;

    varying vec2 uv;

    uniform vec4 dot;
    
    void main() {
        vec4 color = vec4(0.0);
        float radius = dot.z; // get the radius from dot[2]
        vec2 pixelRatio = vec2(1.0, 1.0) / vec2(512.0, 512.0) * radius;
        float b = ( 1.0 - length( ( dot.xy - uv ) / pixelRatio ) );
        if ( b < .1 ) b = .0; 
        color.r = b;
        color.g = b;
        color.b = 0.0;
        color.a = b;
        gl_FragColor = color;
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


export default class LayerSimpleBall extends Layer {

    constructor (gl) {
        
        super(gl);

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
   
        this.lifetime += elapsedTime;
   
        let gl = this.gl;

        // set the vertex buffer to be drawn
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);

        // set the shader
        gl.useProgram(this.program);

        // bind comon attributes and uniforms
        gl.vertexAttribPointer(this.shaderVertexPositionAttribute, this.geometry.vertSize, gl.FLOAT, false, 0, 0);

        // bind updated ball properties
        gl.uniform4fv(gl.getUniformLocation(this.program, "dot"), this.dot);

        // draw
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

    }

    set x(x) { this.dot[0] = x; }
    set y(y) { this.dot[1] = y; }
    set radius(radius) { this.dot[2] = radius; }
    set trail(trail) { this.dot[3] = trail; }
}
