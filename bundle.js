!function(e){function t(i){if(r[i])return r[i].exports;var n=r[i]={exports:{},id:i,loaded:!1};return e[i].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){e.exports=r(5)},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=r(6),l=i(a),u=r(10),s=i(u),f=Symbol(),c=Symbol(),d=function(){function e(t,r,i){if(n(this,e),t!==f)throw"[Stage] Singleton class, use `Stage.getInstance()` instead.";this.clock=new s["default"],this.layers=[],this.renderer=new l["default"](r,i),this.update(),console.log("[Stage] initialized.")}return o(e,null,[{key:"initialize",value:function(t,r){if(this[c])throw"[Stage] Already initialized.";return this[c]=new e(f,t,r),this[c]}},{key:"getInstance",value:function(){if(!this[c])throw"[Stage] Must first call `Stage.initialize(canvas, options)`.";return this[c]}},{key:"getRenderer",value:function(){return e.getInstance().renderer}},{key:"getGL",value:function(){return e.getInstance().renderer.gl}},{key:"addLayer",value:function(t){e.getInstance().addLayer(t)}},{key:"removeLayer",value:function(t){e.getInstance().removeLayer(t)}},{key:"setLayerIndex",value:function(t,r){e.getInstance().setLayerIndex(t,r)}},{key:"beforeUpdateHandler",value:function(t){e.getInstance().beforeUpdateHandler=t}},{key:"afterUpdateHandler",value:function(t){e.getInstance().afterUpdateHandler=t}}]),o(e,[{key:"update",value:function(){window.requestAnimationFrame(this.update.bind(this));var e=this.clock.tick();this.beforeUpdateHandler&&this.beforeUpdateHandler(e),this.renderer.clear();var t=!0,r=!1,i=void 0;try{for(var n,o=this.layers[Symbol.iterator]();!(t=(n=o.next()).done);t=!0){var a=n.value;a.render(e)}}catch(l){r=!0,i=l}finally{try{!t&&o["return"]&&o["return"]()}finally{if(r)throw i}}this.afterUpdateHandler&&this.afterUpdateHandler(e)}},{key:"addLayer",value:function(e){this.layers.push(e)}},{key:"removeLayer",value:function(e){console.log("[Stage] TO DO: implement removeLayer.")}},{key:"setLayerIndex",value:function(e,t){console.log("[Stage] TO DO: implement setLayerIndex.")}}]),e}();t["default"]=d},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n="\n    void main(void) {\n        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // default debug purple\n    }\n",o="\n    attribute vec3 vertexPos;\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n    void main(void) {\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);\n    }\n",a=function(){function e(t){if(r(this,e),this.gl=t,this.geometry=this.getDefaultGeometry(t),void 0===this.render)throw new TypeError("Must override method 'render'.");console.log("[Layer] initialized.")}return i(e,[{key:"getDefaultGeometry",value:function(e){var t;t=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,t);var r=[.5,.5,0,-.5,.5,0,.5,-.5,0,-.5,-.5,0];e.bufferData(e.ARRAY_BUFFER,new Float32Array(r),e.STATIC_DRAW);var i={buffer:t,vertSize:3,nVerts:4,primtype:e.TRIANGLE_STRIP};return i}},{key:"getDefaultFragment",value:function(){return n}},{key:"getDefaultVertex",value:function(){return o}},{key:"createShader",value:function(e,t){var r=this.gl.createShader(t);return this.gl.shaderSource(r,e),this.gl.compileShader(r),this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS)?r:(console.error("[Layer] ",this.gl.getShaderInfoLog(r)),null)}},{key:"update",value:function(e){console.warn("Implement update() method for",this)}},{key:"render",value:function(){console.warn("Implement render() method for",this)}}]),e}();t["default"]=a},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=r(1),l=i(a),u=r(9),s=i(u),f=r(7),c=i(f),d=r(8),h=i(d),m=r(12),p=i(m),g=function(){function e(t){var r=this;n(this,e);var i=new Image;i.onload=function(){return r.init(i)},i.src="assets/img/field.png"}return o(e,[{key:"init",value:function(e){l["default"].initialize(document.getElementById("canvas"),{contain:!0}),this.bg=new h["default"](l["default"].getGL(),e),l["default"].addLayer(this.bg),this.ball=new s["default"](l["default"].getGL()),this.ball.radius=25,l["default"].addLayer(this.ball),this.ball2=new c["default"](l["default"].getGL()),this.ball2.radius=50,l["default"].addLayer(this.ball2),l["default"].beforeUpdateHandler(this.update.bind(this)),l["default"].afterUpdateHandler(null),this.lifetime=0,this.stats=new p["default"];var t=document.getElementById("container");t.appendChild(this.stats.domElement),document.addEventListener("mousedown",this.onDocumentMouseDown.bind(this),!1)}},{key:"onDocumentMouseDown",value:function(e){e.preventDefault()}},{key:"update",value:function(e){this.lifetime+=e,this.ball.x=(Math.sin(3*this.lifetime)+1)/2*.8+.1,this.ball.y=(Math.sin(2.6*this.lifetime)+1)/2*.8+.1,this.ball2.x=(Math.sin(4.6*this.lifetime)+1)/2*.8+.1,this.ball2.y=(Math.sin(3.9*this.lifetime)+1)/2*.8+.1,this.stats.update()}}]),e}();t["default"]=g},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}r(13);var n=r(11),o=i(n),a=r(4),l=i(a);o["default"].webgl||o["default"].addGetWebGLMessage(),window.addEventListener("load",function(){new l["default"]({})})},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(t,i){r(this,e),this.canvas=t,i=i||{},this.contain=i.hasOwnProperty("contain")?i.contain:!0,this.gl=this.initWebGL(t),this.initViewport(this.gl,t),this.initMatrices(),window.addEventListener("resize",this.onWindowResize.bind(this),!1),this.onWindowResize(),console.log("[Renderer] initialized.")}return i(e,[{key:"initWebGL",value:function(e){var t=void 0;try{t=this.canvas.getContext("webgl",{alpha:!0,antialias:!0,preserveDrawingBuffer:!0})}catch(r){var i="Error creating WebGL Context!: "+r.toString();throw alert(i),Error(i)}return t}},{key:"initViewport",value:function(e,t){e.viewport(0,0,t.width,t.height)}},{key:"initMatrices",value:function(){this.modelViewMatrix=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,-1.2,1]),this.projectionMatrix=new Float32Array([2.41421,0,0,0,0,2.41421,0,0,0,0,-1.002002,-1,0,0,-.2002002,0])}},{key:"clear",value:function(){this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.enable(this.gl.BLEND),this.gl.disable(this.gl.DEPTH_TEST),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE)}},{key:"onWindowResize",value:function(){var e=1/(this.contain?Math.max:Math.min)(this.canvas.width/window.innerWidth,this.canvas.height/window.innerHeight);canvas.style.transformOrigin="top left",canvas.style.left=((window.innerWidth-this.canvas.width*e)/2).toFixed(2)+"px",canvas.style.top=((window.innerHeight-this.canvas.height*e)/2).toFixed(2)+"px",canvas.style.transform="scale("+e.toFixed(2)+")"}}]),e}();t["default"]=n},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),u=function b(e,t,r){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var n=Object.getPrototypeOf(e);return null===n?void 0:b(n,t,r)}if("value"in i)return i.value;var o=i.get;if(void 0!==o)return o.call(r)},s=r(2),f=i(s),c=r(1),d=i(c),h="\n\n    precision mediump float;\n\n    varying vec2 uv;\n\n    uniform vec4 dot;\n    \n    void main() {\n        vec4 color = vec4(0.0);\n        float radius = dot.z; // get the radius from dot[2]\n        vec2 pixelRatio = vec2(1.0, 1.0) / vec2(512.0, 512.0) * radius;\n        float b = ( 1.0 - length( ( dot.xy - uv ) / pixelRatio ) );\n        if ( b < .1 ) b = .0; \n        color.r = b;\n        color.g = b*.4;\n        color.b = b;\n        color.a = b;\n        gl_FragColor = color;\n    }\n",m="\n\n    precision mediump float;\n\n    varying vec2 uv;\n\n    uniform sampler2D ball;\n    uniform sampler2D previous;\n\n    void main() { \n        vec4 color = vec4(0.0);\n        color.a = texture2D(ball, uv).a + texture2D(previous, uv).a;\n        float b = color.a;\n        color.r = b;\n        color.g = b*.4;\n        color.b = b;\n        color.a = b;\n        gl_FragColor = color;\n\n\n        if ( gl_FragColor.a < 0.1 ) gl_FragColor = vec4(0.0);\n\n\n        // gl_FragColor = vec4(0.0);\n        // gl_FragColor = mix(texture2D(ball, uv), texture2D(previous, uv), .5);\n\n\n        // gl_FragColor += texture2D(ball, uv);\n        // gl_FragColor += texture2D(previous, uv);\n        // gl_FragColor = clamp( gl_FragColor + texture2D(previous, uv - vec4(.2)), 0.0, 1.0);\n        \n        // gl_FragColor -= vec4(.6);\n        // gl_FragColor = vec4(1.0);\n    }\n",p="\n\n    precision mediump float;\n\n    varying vec2 uv;\n\n    uniform sampler2D previous;\n\n    void main() { \n        gl_FragColor = texture2D(previous, uv);\n        gl_FragColor.a -= 0.01;\n        if ( gl_FragColor.a < 0.1 ) gl_FragColor = vec4(0.0);\n    }\n",g="\n    \n    precision mediump float;\n\n    attribute vec3 vertexPosition;\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n\n    varying vec2 uv;\n\n    void main(void) {\n        uv = vertexPosition.xy+.5;\n        // uv.y = (uv.y-1.0) * -1.0; // make top left the origin\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);\n    }\n",v=function(e){function t(e){n(this,t);var r=o(this,Object.getPrototypeOf(t).call(this,e));return r.initTextureBuffers(e),r.pointersBall=r.initShaderBall(e),r.pointersMerge=r.initShaderMerge(e),r.pointersPreviousFrame=r.initShaderPreviousFrame(e),r.lifetime=0,r.dot=new Float32Array([.5,.5,30,.5]),r}return a(t,e),l(t,[{key:"initTextureBuffers",value:function(e){this.ballRTT=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.ballRTT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_NEAREST),e.texImage2D(this.gl.TEXTURE_2D,0,e.RGBA,512,512,0,e.RGBA,e.UNSIGNED_BYTE,null),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null),this.ballFrameBuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.ballFrameBuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.ballRTT,0),this.ballFrameBuffer.width=512,this.ballFrameBuffer.height=512,e.bindFramebuffer(e.FRAMEBUFFER,null),this.previousRTT=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.previousRTT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_NEAREST),e.texImage2D(this.gl.TEXTURE_2D,0,e.RGBA,512,512,0,e.RGBA,e.UNSIGNED_BYTE,null),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null),this.previousFrameBuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.previousFrameBuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.previousRTT,0),this.previousFrameBuffer.width=512,this.previousFrameBuffer.height=512,e.bindFramebuffer(e.FRAMEBUFFER,null),this.mergeRTT=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.mergeRTT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_NEAREST),e.texImage2D(this.gl.TEXTURE_2D,0,e.RGBA,512,512,0,e.RGBA,e.UNSIGNED_BYTE,null),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null),this.mergeFrameBuffer=e.createFramebuffer(),e.bindFramebuffer(e.FRAMEBUFFER,this.mergeFrameBuffer),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.mergeRTT,0),this.mergeFrameBuffer.width=512,this.mergeFrameBuffer.height=512,e.bindFramebuffer(e.FRAMEBUFFER,null)}},{key:"initShaderBall",value:function(e){var r=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,h,e.FRAGMENT_SHADER),i=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,g,e.VERTEX_SHADER);this.programBall=e.createProgram(),e.attachShader(this.programBall,i),e.attachShader(this.programBall,r),e.linkProgram(this.programBall);var n={vertexPosition:e.getAttribLocation(this.programBall,"vertexPosition"),projectionMatrix:e.getUniformLocation(this.programBall,"projectionMatrix"),modelViewMatrix:e.getUniformLocation(this.programBall,"modelViewMatrix"),dot:e.getUniformLocation(this.programBall,"dot")};return e.enableVertexAttribArray(n.vertexPosition),this.validateProgram(this.programBall),n}},{key:"initShaderMerge",value:function(e){var r=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,m,e.FRAGMENT_SHADER),i=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,g,e.VERTEX_SHADER);this.programMerge=e.createProgram(),e.attachShader(this.programMerge,i),e.attachShader(this.programMerge,r),e.linkProgram(this.programMerge);var n={vertexPosition:e.getAttribLocation(this.programMerge,"vertexPosition"),projectionMatrix:e.getUniformLocation(this.programMerge,"projectionMatrix"),modelViewMatrix:e.getUniformLocation(this.programMerge,"modelViewMatrix"),ball:e.getUniformLocation(this.programMerge,"ball"),previous:e.getUniformLocation(this.programMerge,"previous")};return e.enableVertexAttribArray(n.vertexPosition),this.validateProgram(this.programMerge),n}},{key:"initShaderPreviousFrame",value:function(e){var r=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,p,e.FRAGMENT_SHADER),i=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,g,e.VERTEX_SHADER);this.programPreviousFrame=e.createProgram(),e.attachShader(this.programPreviousFrame,i),e.attachShader(this.programPreviousFrame,r),e.linkProgram(this.programPreviousFrame);var n={vertexPosition:e.getAttribLocation(this.programPreviousFrame,"vertexPosition"),projectionMatrix:e.getUniformLocation(this.programPreviousFrame,"projectionMatrix"),modelViewMatrix:e.getUniformLocation(this.programPreviousFrame,"modelViewMatrix"),previous:e.getUniformLocation(this.programPreviousFrame,"previous")};return e.enableVertexAttribArray(n.vertexPosition),this.validateProgram(this.programPreviousFrame),n}},{key:"validateProgram",value:function(e){this.gl.getProgramParameter(e,this.gl.LINK_STATUS)||console.error("[LayerBall] Could not initialize shaders")}},{key:"render",value:function(e){this.lifetime+=e;var t=this.gl;this.gl.blendFunc(this.gl.SRC_ALPHA_SATURATE,this.gl.ONE_MINUS_SRC_ALPHA),t.bindFramebuffer(t.FRAMEBUFFER,this.ballFrameBuffer),t.bindBuffer(t.ARRAY_BUFFER,this.geometry.buffer),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.programBall),t.vertexAttribPointer(this.pointersBall.vertexPosition,this.geometry.vertSize,t.FLOAT,!1,0,0),t.uniformMatrix4fv(this.pointersBall.projectionMatrix,!1,d["default"].getRenderer().projectionMatrix),t.uniformMatrix4fv(this.pointersBall.modelViewMatrix,!1,d["default"].getRenderer().modelViewMatrix),t.uniform4fv(this.pointersBall.dot,this.dot),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindFramebuffer(t.FRAMEBUFFER,this.mergeFrameBuffer),t.bindBuffer(t.ARRAY_BUFFER,this.geometry.buffer),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.programMerge),t.vertexAttribPointer(this.pointersMerge.vertexPosition,this.geometry.vertSize,t.FLOAT,!1,0,0),t.uniformMatrix4fv(this.pointersMerge.projectionMatrix,!1,d["default"].getRenderer().projectionMatrix),t.uniformMatrix4fv(this.pointersMerge.modelViewMatrix,!1,d["default"].getRenderer().modelViewMatrix),t.uniform1i(this.pointersMerge.ball,0),t.uniform1i(this.pointersMerge.previous,1),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.ballRTT),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.previousRTT),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts),t.bindFramebuffer(t.FRAMEBUFFER,this.previousFrameBuffer),t.bindBuffer(t.ARRAY_BUFFER,this.geometry.buffer),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.programPreviousFrame),t.vertexAttribPointer(this.pointersPreviousFrame.vertexPosition,this.geometry.vertSize,t.FLOAT,!1,0,0),t.uniformMatrix4fv(this.pointersPreviousFrame.projectionMatrix,!1,d["default"].getRenderer().projectionMatrix),t.uniformMatrix4fv(this.pointersPreviousFrame.modelViewMatrix,!1,d["default"].getRenderer().modelViewMatrix),t.uniform1i(this.pointersPreviousFrame.previous,0),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.mergeRTT),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts),this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE),t.bindFramebuffer(t.FRAMEBUFFER,null),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts)}},{key:"x",set:function(e){this.dot[0]=e}},{key:"y",set:function(e){this.dot[1]=e}},{key:"radius",set:function(e){this.dot[2]=e}},{key:"trail",set:function(e){this.dot[3]=e}}]),t}(f["default"]);t["default"]=v},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),u=function g(e,t,r){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var n=Object.getPrototypeOf(e);return null===n?void 0:g(n,t,r)}if("value"in i)return i.value;var o=i.get;if(void 0!==o)return o.call(r)},s=r(2),f=i(s),c=r(1),d=i(c),h="\n\n    precision mediump float;\n\n    varying vec2 uv;\n    \n    uniform sampler2D image;\n\n    void main() { \n        gl_FragColor = texture2D(image, uv);\n    }\n",m="\n    \n    precision mediump float;\n\n    attribute vec3 vertexPosition;\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n\n    varying vec2 uv;\n\n    void main(void) {\n        uv = vertexPosition.xy+.5;\n        uv.y = (uv.y-1.0) * -1.0; // make top left the origin\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);\n    }\n",p=function(e){function t(e,r){n(this,t);var i=o(this,Object.getPrototypeOf(t).call(this,e));return i.texture=e.createTexture(),i.img=r,i.ready=!0,e.bindTexture(e.TEXTURE_2D,i.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_NEAREST),e.generateMipmap(e.TEXTURE_2D),e.bindTexture(e.TEXTURE_2D,null),i.program=i.initShader(e),i.lifetime=0,i.dot=new Float32Array([.5,.5,30,.5]),i}return a(t,e),l(t,[{key:"initShader",value:function(e){var r=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,h,e.FRAGMENT_SHADER),i=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,m,e.VERTEX_SHADER);return this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,r),e.linkProgram(this.program),this.shaderVertexPositionAttribute=e.getAttribLocation(this.program,"vertexPosition"),e.enableVertexAttribArray(this.shaderVertexPositionAttribute),this.shaderProjectionMatrixUniform=e.getUniformLocation(this.program,"projectionMatrix"),this.shaderModelViewMatrixUniform=e.getUniformLocation(this.program,"modelViewMatrix"),e.getProgramParameter(this.program,e.LINK_STATUS)||console.error("[LayerBall] Could not initialize shaders"),this.program}},{key:"render",value:function(e){var t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.geometry.buffer),t.useProgram(this.program),t.vertexAttribPointer(this.shaderVertexPositionAttribute,this.geometry.vertSize,t.FLOAT,!1,0,0),t.uniformMatrix4fv(this.shaderProjectionMatrixUniform,!1,d["default"].getRenderer().projectionMatrix),t.uniformMatrix4fv(this.shaderModelViewMatrixUniform,!1,d["default"].getRenderer().modelViewMatrix),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.uniform1i(this.program.samplerUniform,0),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts)}}]),t}(f["default"]);t["default"]=p},function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),u=function g(e,t,r){null===e&&(e=Function.prototype);var i=Object.getOwnPropertyDescriptor(e,t);if(void 0===i){var n=Object.getPrototypeOf(e);return null===n?void 0:g(n,t,r)}if("value"in i)return i.value;var o=i.get;if(void 0!==o)return o.call(r)},s=r(2),f=i(s),c=r(1),d=i(c),h="\n\n    precision mediump float;\n\n    varying vec2 uv;\n\n    uniform vec4 dot;\n    \n    void main() {\n        vec4 color = vec4(0.0);\n        float radius = dot.z; // get the radius from dot[2]\n        vec2 pixelRatio = vec2(1.0, 1.0) / vec2(512.0, 512.0) * radius;\n        float b = ( 1.0 - length( ( dot.xy - uv ) / pixelRatio ) );\n        if ( b < .1 ) b = .0; \n        color.r = b;\n        color.g = b;\n        color.b = 0.0;\n        color.a = b;\n        gl_FragColor = color;\n    }\n",m="\n    \n    precision mediump float;\n\n    attribute vec3 vertexPosition;\n    uniform mat4 modelViewMatrix;\n    uniform mat4 projectionMatrix;\n\n    varying vec2 uv;\n\n    void main(void) {\n        uv = vertexPosition.xy+.5;\n        uv.y = (uv.y-1.0) * -1.0; // make top left the origin\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);\n    }\n",p=function(e){function t(e){n(this,t);var r=o(this,Object.getPrototypeOf(t).call(this,e));return r.program=r.initShader(e),r.lifetime=0,r.dot=new Float32Array([.5,.5,30,.5]),r}return a(t,e),l(t,[{key:"initShader",value:function(e){var r=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,h,e.FRAGMENT_SHADER),i=u(Object.getPrototypeOf(t.prototype),"createShader",this).call(this,m,e.VERTEX_SHADER);return this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,r),e.linkProgram(this.program),this.shaderVertexPositionAttribute=e.getAttribLocation(this.program,"vertexPosition"),e.enableVertexAttribArray(this.shaderVertexPositionAttribute),this.shaderProjectionMatrixUniform=e.getUniformLocation(this.program,"projectionMatrix"),this.shaderModelViewMatrixUniform=e.getUniformLocation(this.program,"modelViewMatrix"),e.getProgramParameter(this.program,e.LINK_STATUS)||console.error("[LayerBall] Could not initialize shaders"),this.program}},{key:"render",value:function(e){this.lifetime+=e;var t=this.gl;t.bindBuffer(t.ARRAY_BUFFER,this.geometry.buffer),t.useProgram(this.program),t.vertexAttribPointer(this.shaderVertexPositionAttribute,this.geometry.vertSize,t.FLOAT,!1,0,0),t.uniformMatrix4fv(this.shaderProjectionMatrixUniform,!1,d["default"].getRenderer().projectionMatrix),t.uniformMatrix4fv(this.shaderModelViewMatrixUniform,!1,d["default"].getRenderer().modelViewMatrix),t.uniform4fv(t.getUniformLocation(this.program,"dot"),this.dot),t.drawArrays(this.geometry.primtype,0,this.geometry.nVerts)}},{key:"x",set:function(e){this.dot[0]=e}},{key:"y",set:function(e){this.dot[1]=e}},{key:"radius",set:function(e){this.dot[2]=e}},{key:"trail",set:function(e){this.dot[3]=e}}]),t}(f["default"]);t["default"]=p},function(e,t){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=function(){function e(){r(this,e),this.timeBefore=Date.now(),this.lifeTime=0,this.elapsedTime=0}return i(e,[{key:"tick",value:function(){return this.elapsedTime=Date.now()-this.timeBefore,this.timeBefore=Date.now(),this.lifeTime+=this.elapsedTime,this.elapsedTime/1e3}}]),e}();t["default"]=n},function(e,t,r){(function(e){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},r={canvas:!!window.CanvasRenderingContext2D,webgl:function(){try{var e=document.createElement("canvas");return!(!window.WebGLRenderingContext||!e.getContext("webgl")&&!e.getContext("experimental-webgl"))}catch(t){return!1}}(),workers:!!window.Worker,fileapi:window.File&&window.FileReader&&window.FileList&&window.Blob,getWebGLErrorMessage:function(){var e=document.createElement("div");return e.id="webgl-error-message",e.style.fontFamily="monospace",e.style.fontSize="13px",e.style.fontWeight="normal",e.style.textAlign="center",e.style.background="#fff",e.style.color="#000",e.style.padding="1.5em",e.style.width="400px",e.style.margin="5em auto 0",this.webgl||(e.innerHTML=window.WebGLRenderingContext?['Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />','Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n"):['Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>','Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'].join("\n")),e},addGetWebGLMessage:function(e){var t,i,n;e=e||{},t=void 0!==e.parent?e.parent:document.body,i=void 0!==e.id?e.id:"oldie",n=r.getWebGLErrorMessage(),n.id=i,t.appendChild(n)}};"object"===t(e)&&(e.exports=r)}).call(t,r(3)(e))},function(e,t,r){(function(e){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},r=function(){function e(e,t,r){return e=document.createElement(e),e.id=t,e.style.cssText=r,e}function t(t,r,i){var n=e("div",t,"padding:0 0 3px 3px;text-align:left;background:"+i),o=e("div",t+"Text","font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:"+r);for(o.innerHTML=t.toUpperCase(),n.appendChild(o),t=e("div",t+"Graph","width:74px;height:30px;background:"+r),n.appendChild(t),r=0;74>r;r++)t.appendChild(e("span","","width:1px;height:30px;float:left;opacity:0.9;background:"+i));return n}function r(e){for(var t=s.children,r=0;r<t.length;r++)t[r].style.display=r===e?"block":"none";u=e}function i(e,t){e.appendChild(e.firstChild).style.height=Math.min(30,30-30*t)+"px"}var n=self.performance&&self.performance.now?self.performance.now.bind(performance):Date.now,o=n(),a=o,l=0,u=0,s=e("div","stats","width:80px;opacity:0.9;cursor:pointer");s.addEventListener("mousedown",function(e){e.preventDefault(),r(++u%s.children.length)},!1);var f=0,c=1/0,d=0,h=t("fps","#0ff","#002"),m=h.children[0],p=h.children[1];s.appendChild(h);var g=0,v=1/0,b=0,h=t("ms","#0f0","#020"),y=h.children[0],E=h.children[1];if(s.appendChild(h),self.performance&&self.performance.memory){var x=0,T=1/0,R=0,h=t("mb","#f08","#201"),M=h.children[0],w=h.children[1];s.appendChild(h)}return r(u),{REVISION:14,domElement:s,setMode:r,begin:function(){o=n()},end:function(){var e=n();if(g=e-o,v=Math.min(v,g),b=Math.max(b,g),y.textContent=(0|g)+" MS ("+(0|v)+"-"+(0|b)+")",i(E,g/200),l++,e>a+1e3&&(f=Math.round(1e3*l/(e-a)),c=Math.min(c,f),d=Math.max(d,f),m.textContent=f+" FPS ("+c+"-"+d+")",i(p,f/100),a=e,l=0,void 0!==x)){var t=performance.memory.usedJSHeapSize,r=performance.memory.jsHeapSizeLimit;x=Math.round(9.54e-7*t),T=Math.min(T,x),R=Math.max(R,x),M.textContent=x+" MB ("+T+"-"+R+")",i(w,t/r)}return e},update:function(){o=this.end()}}};"object"===t(e)&&(e.exports=r)}).call(t,r(3)(e))},function(e,t){}]);
//# sourceMappingURL=bundle.js.map