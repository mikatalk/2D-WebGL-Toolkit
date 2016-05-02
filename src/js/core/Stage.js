"use strict";

import Renderer      from './Renderer';
import Clock         from '../utils/Clock';

const singletonEnforcer = Symbol();
let instance = Symbol();

export default class Stage {

    static initialize ( canvas, options ) {
        
        if (this[instance]) {
            throw '[Stage] Already initialized.';
        }

        this[instance] = new Stage(singletonEnforcer, canvas, options);
        return this[instance];

    }
    
    static getInstance () {

        if (!this[instance]) {
           throw '[Stage] Must first call `Stage.initialize(canvas, options)`.';
        }
        return this[instance];

    }

    static getRenderer () {
        return Stage.getInstance().renderer;
    }

    static getGL () {
        return Stage.getInstance().renderer.gl;
    }

    static addLayer ( layer ) { 
        Stage.getInstance().addLayer( layer ); 
    }

    static removeLayer ( layer ) { 
        Stage.getInstance().removeLayer( layer ); 
    }
    
    static setLayerIndex ( layer, index ) {
        Stage.getInstance().setLayerIndex( layer, index );         
    }

    static beforeUpdateHandler ( callback ) {
        Stage.getInstance().beforeUpdateHandler = callback;   
    }

    static afterUpdateHandler ( callback ) {
        Stage.getInstance().afterUpdateHandler = callback;   
    }

    constructor (enforcer, canvas, options) {

        if (enforcer !== singletonEnforcer) {
            throw '[Stage] Singleton class, use `Stage.getInstance()` instead.';
        }

        this.clock = new Clock();

        this.layers = [];

        this.renderer = new Renderer( canvas, options );

        this.update();

        console.log('[Stage] initialized.');

    }
    
    update() {    
        
        window.requestAnimationFrame( this.update.bind(this) );

        let elapsedTime = this.clock.tick();

        if ( this.beforeUpdateHandler ) this.beforeUpdateHandler( elapsedTime );

        this.renderer.clear();

        for ( let layer of this.layers ) layer.render(elapsedTime);

        if ( this.afterUpdateHandler ) this.afterUpdateHandler( elapsedTime );
    }

    addLayer ( layer ) {
        this.layers.push( layer );
    }

    removeLayer ( layer ) { 
        console.log('[Stage] TO DO: implement removeLayer.');
    }

    setLayerIndex ( layer, index ) { 
        console.log('[Stage] TO DO: implement setLayerIndex.');
    }
}

