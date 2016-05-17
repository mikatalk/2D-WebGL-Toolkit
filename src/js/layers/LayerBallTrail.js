"use strict";

import Layer from './Layer';
import Stage from './../core/Stage';

const FRAGMENT_BALL = `

    precision mediump float;

    varying vec2 uv;

    uniform vec4 dot;
    
    void main() {
        vec4 color = vec4(0.0);
        float radius = 1.0 / 512.0 * dot.z;
        float b = ( 1.0 - length( ( dot.xy - uv ) / radius ) );
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

        vec4 colorBall = texture2D(ball, uv);
        vec4 colorPrevious = texture2D(previous, uv);

        gl_FragColor = vec4(0.0);
        gl_FragColor.a = colorBall.a + colorPrevious.a;

        gl_FragColor.r = gl_FragColor.a;
        gl_FragColor.g = gl_FragColor.a*.4;
        gl_FragColor.b = gl_FragColor.a;

    }
`;

function getFragmentPreviousFrame (trail) {
    return `

    precision mediump float;

    varying vec2 uv;

    uniform sampler2D previous;

    const float trail = ${trail}; 
    const float blur = 0.125;
    const float weight = .88;
    
    void main() { 
        
        vec2 onePixel = vec2(1.0, 1.0) / vec2(512., 512.);
        vec4 color = texture2D(previous, uv + onePixel * vec2(-1, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1, -1)) * blur +
        texture2D(previous, uv + onePixel * vec2(-1,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1,  0)) * blur +
        texture2D(previous, uv + onePixel * vec2(-1,  1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 0,  1)) * blur +
        texture2D(previous, uv + onePixel * vec2( 1,  1)) * blur ;
        color *= weight;
        
        gl_FragColor = color;
        gl_FragColor.a -= trail;

        if ( gl_FragColor.a < 0.2 ) gl_FragColor = vec4(0.0);
        // if ( gl_FragColor.a < 0.101 && gl_FragColor.a > 0.1 ) gl_FragColor = vec4(0.101/ gl_FragColor.a, .101/ gl_FragColor.a, .101/ gl_FragColor.a, .101/ gl_FragColor.a);
        // if ( gl_FragColor.a < 0.101 && gl_FragColor.a > 0.1 ) gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;
}

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

        gl.blendEquation( gl.FUNC_ADD );
        gl.blendFunc(gl.ONE, gl.DST_ALPHA);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.geometry.buffer );

        /*     coordinates             >> BallRTT          */
        gl.useProgram( this.programBall );
        gl.vertexAttribPointer( this.pointersBall.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0 );
        gl.uniform4fv( this.pointersBall.dot, this.dot );  
        gl.bindFramebuffer( gl.FRAMEBUFFER, this.ballFrameBuffer );
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays( this.geometry.primtype, 0, this.geometry.nVerts );
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );

        /*     PreviousRTT + BallRTT   >> MergeRTT         */
        gl.bindFramebuffer(gl.FRAMEBUFFER,  this.mergeFrameBuffer );
        
        gl.useProgram(this.programMerge);
        gl.vertexAttribPointer(this.pointersMerge.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniform1i(this.pointersMerge.ball, 0);  // texture unit 0
        gl.uniform1i(this.pointersMerge.previous, 1);  // texture unit 1
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.ballRTT);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.previousRTT);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);
 
        /*     MergeRTT                >> previousRTT      */
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.previousFrameBuffer);        
        gl.useProgram(this.programPreviousFrame);
        gl.vertexAttribPointer(this.pointersPreviousFrame.vertexPosition, this.geometry.vertSize, gl.FLOAT, false, 0, 0);
        gl.uniform1i(this.pointersPreviousFrame.previous, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.mergeRTT);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays( this.geometry.primtype, 0, this.geometry.nVerts );

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        /*     MergeRTT                >> SCREEN           */
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.drawArrays(this.geometry.primtype, 0, this.geometry.nVerts);

    }

    set x(x) { this.dot[0] = x; }
    get x() { return this.dot[0]; }
    
    set y(y) { this.dot[1] = y; }
    get y() { return this.dot[1]; }

    set radius(radius) { this.dot[2] = radius; }
    
    set trail(trail) { this.dot[3] = trail; }
}
