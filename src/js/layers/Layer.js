"use strict";


const DEFAULT_FRAGMENT = `
    void main(void) {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // default debug purple
    }
`;

const DEFAULT_VERTEX = `
    attribute vec3 vertexPos;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    void main(void) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    }
`;


export default class Layer {
    constructor(gl) {
        
        this.gl = gl;

        this.geometry = this.getDefaultGeometry( gl );

        if (this.render === undefined) 
            throw new TypeError("Must override method 'render'.");

        console.log('[Layer] initialized.');

    }

    getDefaultGeometry (gl) {

        var vertexBuffer;
        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var verts = [
             .5,  .5,  0.0,
            -.5,  .5,  0.0,
             .5, -.5,  0.0,
            -.5, -.5,  0.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        var square = {buffer:vertexBuffer, vertSize:3, nVerts:4, primtype:gl.TRIANGLE_STRIP};
        return square;
    }

    getDefaultFragment () { 
        return DEFAULT_FRAGMENT; 
    }
    
    getDefaultVertex () { 
        return DEFAULT_VERTEX; 
    }
    
    createShader (str, type) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error( '[Layer] ', this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    update ( elapsedTime ) {
        console.warn('Implement update() method for', this);
    }
    
    render (  ) {
        console.warn('Implement render() method for', this);
    }
}
