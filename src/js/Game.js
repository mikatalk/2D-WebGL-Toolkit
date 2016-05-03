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

        this.balls = [];
        for ( var i=0,l=1; i<l; i++ ) {
            let ball = new LayerBallTrail( Stage.getGL(), 20, .01 );
            ball.speedX = 2;
            ball.speedY = 3;
            Stage.addLayer( ball );
            this.balls.push( ball );
        }
        
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

        for ( let ball of this.balls ) {
            ball.x = (Math.sin(this.lifetime*ball.speedX)+1)/2*.8+.1;
            ball.y = (Math.sin(this.lifetime*ball.speedY)+1)/2*.8+.1;
        }

        this.stats.update();

    }
}
