"use strict";

import Stage            from './core/Stage';
import LayerSimpleBall  from './layers/LayerSimpleBall';
import LayerBallTrail   from './layers/LayerBallTrail';
import LayerImage       from './layers/LayerImage';
import Stats            from './vendors/Stats.min';

export default class Game {

    constructor(options) {
        let image = new Image();
        image.onload = () => this.init( image ); 
        image.src = 'assets/img/field.png';

    }

    init (bgImg) {

        Stage.initialize(document.getElementById('canvas'), {
            contain: true
        });

        this.bg = new LayerImage( Stage.getGL(), bgImg );
        Stage.addLayer( this.bg );

        this.ball = new LayerSimpleBall( Stage.getGL() );
        this.ball.radius = 25.0;
        Stage.addLayer( this.ball );

        this.ball2 = new LayerBallTrail( Stage.getGL() );
        this.ball2.radius = 50.0;
        Stage.addLayer( this.ball2 );

        Stage.beforeUpdateHandler( this.update.bind(this) );
        Stage.afterUpdateHandler( null );

        this.lifetime = 0;

        this.stats = new Stats();
        
        let container = document.getElementById( 'container' );
        container.appendChild( this.stats.domElement );
        
        document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );

    }

    onDocumentMouseDown( event ) {

        event.preventDefault();

    }

    update( elapsedTime ) {
    
        this.lifetime += elapsedTime;

        this.ball.x = (Math.sin(this.lifetime*3)+1)/2*.8+.1;
        this.ball.y = (Math.sin(this.lifetime*2.6)+1)/2*.8+.1;

        this.ball2.x = (Math.sin(this.lifetime*4.6)+1)/2*.8+.1;
        this.ball2.y = (Math.sin(this.lifetime*3.9)+1)/2*.8+.1;

        this.stats.update();

    }
}
