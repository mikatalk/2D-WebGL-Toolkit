"use strict";

import Layer from './Layer';
import Stage from './../core/Stage';

const FRAGMENT_BALL = `

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
        color.g = b*.4;
        color.b = b;
        color.a = b;
        gl_FragColor = color;
    }
`;

const FRAGMENT_MERGE = `

    precision mediump float;

    varying vec2 uv;

    uniform sampler2D ball;
    uniform sampler2D previous;

    void main() { 
        vec4 color = vec4(0.0);
        color.a = texture2D(ball, uv).a + texture2D(previous, uv).a;
        float b = color.a;
        color.r = b;
        color.g = b*.4;
        color.b = b;
        color.a = b;
        gl_FragColor = color;


        if ( gl_FragColor.a < 0.1 ) gl_FragColor = vec4(0.0);

    }
`;

function getFragmentPreviousFrame (trail) {
    return `

    precision mediump float;

    varying vec2 uv;

    uniform sampler2D previous;

    const float trail = ${trail}; 

    void main() { 
        // vec4 color = texture2D(previous, uv);

        vec2 onePixel = vec2(1.0, 1.0) / 512.0;
        float blur = 0.333;
        float kernelWeight = .4;
        vec4 color = texture2D(previous, uv + onePixel * vec2(-1, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2(-1,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2(-1,  1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0,  1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1,  1)) * blur ;
        color *= kernelWeight;
        color.a -= trail;
        color.r = color.a;
        color.g = color.a*.4;
        color.b = color.a;
        color.a = color.a;
        gl_FragColor = color;

    }
`;
}

const VERTEX = `
    
    precision mediump float;

    attribute vec3 vertexPosition;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec2 uv;

    void main(void) {
        uv = vertexPosition.xy+.5;
        // uv.y = (uv.y-1.0) * -1.0; // make top left the origin
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
    }
`;


export default class LayerSimpleBall extends Layer {

    constructor (gl, radius, trail) {
        
        super(gl);

        this.lifetime = 0;

        this.dot = new Float32Array([0.5, 0.5, radius, trail]); // x, y, radius, trail

        /** Render pipeline *********************************
          *     coordinates             >> BallRTT          *
          *     PreviousRTT + BallRTT   >> MergeRTT         *
          *     MergeRTT                >> previousRTT      *
          *     MergeRTT                >> SCREEN           *
          ***************************************************/

        /** Buffers **/
        this.initTextureBuffers( gl );

        /** Ball **/
        this.pointersBall = this.initShaderBall( gl );        

        /** Merge **/
        this.pointersMerge = this.initShaderMerge( gl );       
        
        /** Previous **/
        this.pointersPreviousFrame = this.initShaderPreviousFrame( gl );       
        
    }

    initTextureBuffers (gl) {

        this.ballRTT = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.ballRTT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.ballFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ballFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ballRTT, 0);
        this.ballFrameBuffer.width = 512;
        this.ballFrameBuffer.height = 512;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);


        this.previousRTT = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.previousRTT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.previousFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.previousFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.previousRTT, 0);
        this.previousFrameBuffer.width = 512;
        this.previousFrameBuffer.height = 512;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);



        this.mergeRTT = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.mergeRTT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texImage2D(this.gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this.mergeFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.mergeFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.mergeRTT, 0);
        this.mergeFrameBuffer.width = 512;
        this.mergeFrameBuffer.height = 512;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    }

    initShaderBall (gl) {

        // load and compile the fragment and vertex shader
        let fragmentShader = super.createShader( FRAGMENT_BALL, gl.FRAGMENT_SHADER);
        let vertexShader = super.createShader( VERTEX, gl.VERTEX_SHADER);

        this.programBall = gl.createProgram();
        gl.attachShader(this.programBall, vertexShader);
        gl.attachShader(this.programBall, fragmentShader);
        gl.linkProgram(this.programBall);

        // get pointers to the shader params
        let pointers = {
            'vertexPosition': gl.getAttribLocation(this.programBall, 'vertexPosition'),
            'projectionMatrix': gl.getUniformLocation(this.programBall, 'projectionMatrix'),
            'modelViewMatrix': gl.getUniformLocation(this.programBall, 'modelViewMatrix'),
            'dot': gl.getUniformLocation(this.programBall, 'dot'),
        };

        gl.enableVertexAttribArray(pointers.vertexPosition);
        
        this.validateProgram( this.programBall );

        return pointers;
    }

    initShaderMerge (gl) {
        // load and compile the fragment and vertex shader
        let fragmentShader = super.createShader( FRAGMENT_MERGE, gl.FRAGMENT_SHADER);
        let vertexShader = super.createShader( VERTEX, gl.VERTEX_SHADER);

        this.programMerge = gl.createProgram();
        gl.attachShader(this.programMerge, vertexShader);
        gl.attachShader(this.programMerge, fragmentShader);
        gl.linkProgram(this.programMerge);

        // get pointers to the shader params
        let pointers = {
            'vertexPosition': gl.getAttribLocation(this.programMerge, 'vertexPosition'),
            'projectionMatrix': gl.getUniformLocation(this.programMerge, 'projectionMatrix'),
            'modelViewMatrix': gl.getUniformLocation(this.programMerge, 'modelViewMatrix'),
            'ball': gl.getUniformLocation(this.programMerge, 'ball'),
            'previous': gl.getUniformLocation(this.programMerge, 'previous')
        };

        gl.enableVertexAttribArray(pointers.vertexPosition);
           
        this.validateProgram( this.programMerge );

        return pointers;
    }
        
    initShaderPreviousFrame (gl) {

        // load and compile the fragment and vertex shader
        let fragmentShader = super.createShader( getFragmentPreviousFrame(this.dot[3].toFixed(2)), gl.FRAGMENT_SHADER);
        let vertexShader = super.createShader( VERTEX, gl.VERTEX_SHADER);

        this.programPreviousFrame = gl.createProgram();
        gl.attachShader(this.programPreviousFrame, vertexShader);
        gl.attachShader(this.programPreviousFrame, fragmentShader);
        gl.linkProgram(this.programPreviousFrame);


        // get pointers to the shader params
        let pointers = {
            'vertexPosition': gl.getAttribLocation(this.programPreviousFrame, 'vertexPosition'),
            'projectionMatrix': gl.getUniformLocation(this.programPreviousFrame, 'projectionMatrix'),
            'modelViewMatrix': gl.getUniformLocation(this.programPreviousFrame, 'modelViewMatrix'),
            'previous': gl.getUniformLocation(this.programPreviousFrame, 'previous')
        };

        gl.enableVertexAttribArray(pointers.vertexPosition);
           
        this.validateProgram( this.programPreviousFrame );

        return pointers;
    }

    validateProgram ( program ) {
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error( '[LayerBall] Could not initialize shaders' );
        }
    }
    
    render ( elapsedTime ) {
   
        this.lifetime += elapsedTime;
   
        let gl = this.gl;

        // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.DEST_ALPHA);
        this.gl.blendFunc(this.gl.SRC_ALPHA_SATURATE, this.gl.ONE_MINUS_SRC_ALPHA);

        /*     coordinates             >> BallRTT          */
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.ballFrameBuffer );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer );
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.programBall);
        gl.vertexAttribPointer(this.pointersBall.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(this.pointersBall.projectionMatrix, false, Stage.getRenderer().projectionMatrix);
        gl.uniformMatrix4fv(this.pointersBall.modelViewMatrix, false, Stage.getRenderer().modelViewMatrix);
        gl.uniform4fv(this.pointersBall.dot, this.dot);  
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        


        /*     PreviousRTT + BallRTT   >> MergeRTT         */
        gl.bindFramebuffer(gl.FRAMEBUFFER,  this.mergeFrameBuffer );
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.programMerge);
        gl.vertexAttribPointer(this.pointersMerge.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(this.pointersMerge.projectionMatrix, false, Stage.getRenderer().projectionMatrix);
        gl.uniformMatrix4fv(this.pointersMerge.modelViewMatrix, false, Stage.getRenderer().modelViewMatrix);
        gl.uniform1i(this.pointersMerge.ball, 0);  // texture unit 0
        gl.uniform1i(this.pointersMerge.previous, 1);  // texture unit 1
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.ballRTT);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.previousRTT);
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

        
        /*     MergeRTT                >> previousRTT      */
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.previousFrameBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.buffer);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(this.programPreviousFrame);
        gl.vertexAttribPointer(this.pointersPreviousFrame.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(this.pointersPreviousFrame.projectionMatrix, false, Stage.getRenderer().projectionMatrix);
        gl.uniformMatrix4fv(this.pointersPreviousFrame.modelViewMatrix, false, Stage.getRenderer().modelViewMatrix);
        gl.uniform1i(this.pointersPreviousFrame.previous, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.mergeRTT);
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

        /*     MergeRTT                >> SCREEN           */
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

    }

    set x(x) { this.dot[0] = x; }
    set y(y) { this.dot[1] = y; }
    set radius(radius) { this.dot[2] = radius; }
    set trail(trail) { this.dot[3] = trail; }
}
