"use strict";

import Stage            from './core/Stage';
import LayerSimpleBall  from './layers/LayerSimpleBall';
import LayerBallTrail   from './layers/LayerBallTrail';
import LayerImage       from './layers/LayerImage';
import ParticleSystem   from './layers/ParticleSystem';
import Stats            from './vendors/Stats.min';

export default class Game {

    constructor(options) {
    //     let image = new Image();
    //     image.onload = () => this.init( image ); 
    //     image.src = 'assets/img/field.png';

    // }

    // init (bgImg) {

        Stage.initialize(document.getElementById('canvas'), {
            contain: true
        });

        // this.bg = new LayerImage( Stage.getGL(), bgImg );
        // Stage.addLayer( this.bg );

        this.particleSystem = new ParticleSystem( Stage.getGL(), 1000, { 
            velocity: { 
                x:0.4, 
                y:1
            }, 
            attenuation: 30,
            size: 40,
            rgba: [1,1,1,1]
        });
        Stage.addLayer( this.particleSystem );

        this.ball = new LayerSimpleBall( Stage.getGL() );
        this.ball.radius = 25.0;
        Stage.addLayer( this.ball );

        this.trailBall = new LayerBallTrail( Stage.getGL(), 20, .01 );
        this.trailBall.speedX = 2;
        this.trailBall.speedY = 3;
        Stage.addLayer( this.trailBall );

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

        this.trailBall.x = (Math.sin(this.lifetime*this.trailBall.speedX)+1)/2*.8+.1;
        this.trailBall.y = (Math.sin(this.lifetime*this.trailBall.speedY)+1)/2*.8+.1;

        this.particleSystem.spawn( 
            this.ball.x - .005 + Math.random()*0.01,
            this.ball.y - .005 + Math.random()*0.01,
            30 * Math.random(),
            Math.random(), Math.random(), Math.random(), Math.random()
        );

        this.particleSystem.spawn( 
            this.trailBall.x - .05 + Math.random()*0.1,
            this.trailBall.y - .05 + Math.random()*0.1,
            60 * Math.random(),
            Math.random(), Math.random(), Math.random(), Math.random()
        );

        this.stats.update();

    }
}
