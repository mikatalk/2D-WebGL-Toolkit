"use strict";

import Layer from './Layer';
import Stage from './../core/Stage';

const FRAGMENT = `

    precision mediump float;

    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
        gl_FragColor.a *= 1.0 - smoothstep( 0.45, 0.5, distance( gl_PointCoord, vec2(0.5)));
    }
`;

const VERTEX = `
    
    precision mediump float;

    uniform mat4 transform;

    attribute vec4 uv;
    attribute vec4 color;
    attribute float size;
    
    varying vec4 vColor;

    void main() {
        // Set the size of the point
        gl_PointSize = size;

        // multiply each vertex by a matrix.
        gl_Position = transform * uv;

        // pass the color to the fragment shader
        vColor = color;
    }

`;


export default class ParticleSystem extends Layer {

    constructor (gl, poolSize, settings) {
        
        super(gl);

        this.poolSize = poolSize || 1;
        this.current = 0;

        this.settings = { 
            velocity: {
                x:1, 
                y:0
            }, 
            attenuation: 1,
            size: 10,
            rgba: [1,1,1,1]
        };
        this.settings = Object.assign( this.settings, settings );
        
        this.colors = new Float32Array(this.poolSize*4);
        this.positions = new Float32Array(this.poolSize*2);
        this.sizes = new Float32Array(this.poolSize);

        for ( let i=0, i2=0, i4=0; i<this.poolSize; i++, i2+=2, i4+=4 ) {
            // this.colors[i4]   = this.settings.rgba[0]; // red
            // this.colors[i4+1] = this.settings.rgba[1]; // green
            // this.colors[i4+2] = this.settings.rgba[2]; // blue
            // this.colors[i4+3] = this.settings.rgba[3]; // alpha
            // this.positions[i2] = .5;   // x
            // this.positions[i2+1] = .5; // y
            // this.sizes[i] = this.settings.size;

            this.colors[i4]   = 0; // red
            this.colors[i4+1] = 0; // green
            this.colors[i4+2] = 0; // blue
            this.colors[i4+3] = 0; // alpha
            this.positions[i2] = 0;   // x
            this.positions[i2+1] = 0; // y
            this.sizes[i] = 10;
        }

        this.colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        this.positionsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        
        this.sizesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sizesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.sizes, gl.STATIC_DRAW);

        this.transform = [
          2, 0, 0, 0,
          0, 2, 0, 0,
          0, 0, 1, 0,
          -1,-1, 0, 1
        ];

        this.program = this.initShader( gl );       

        this.lifetime = 0;

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
 
        this.locations = {
            transform: gl.getUniformLocation(this.program, 'transform'),
            color: gl.getAttribLocation(this.program, 'color'),
            uv: gl.getAttribLocation(this.program, 'uv'),
            size: gl.getAttribLocation(this.program, 'size')
        };


        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error( '[LayerBall] Could not initialize shaders' );
        }

        return this.program;
    }

    updateParticles ( elapsedTime ) {
        for ( let i=0, i2=0, i4=0; i<this.poolSize; i++, i2+=2, i4+=4 ) {
            
            this.positions[i2] += elapsedTime * this.settings.velocity.x;
            this.positions[i2+1] += elapsedTime * this.settings.velocity.y;

            this.colors[i4+3] -= elapsedTime * .9;
            this.sizes[i] -= elapsedTime * 15;
        }
        this.needsUpdate = true;
    }

    render ( elapsedTime ) {

        this.lifetime += elapsedTime;
        
        this.updateParticles( elapsedTime );

        let gl = this.gl;

        // set the vertex buffer to be drawn
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);

        // set the shader
        gl.useProgram(this.program);

        // set the transform
        gl.uniformMatrix4fv(this.locations.transform, false, this.transform);

        if ( this.needsUpdate ) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.sizesBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.sizes, gl.STATIC_DRAW);
        }

        // Tell the shader how to get data out of the buffers.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.vertexAttribPointer(this.locations.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.color);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
        gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.uv);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.sizesBuffer);
        gl.vertexAttribPointer(this.locations.size, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.locations.size);

        gl.drawArrays(gl.POINTS, 0, this.poolSize);
    }

    spawn ( x, y, size, r, g, b, a ) {

        this.positions[this.current*2] = x;
        this.positions[this.current*2+1] = y;

        this.colors[this.current*4]   = r;
        this.colors[this.current*4+1] = g;
        this.colors[this.current*4+2] = b;
        this.colors[this.current*4+3] = a;

        this.sizes[this.current] = size;

        this.needsUpdate = true;

        if ( ++this.current > this.poolSize-1 ) this.current = 0;
    }
}
