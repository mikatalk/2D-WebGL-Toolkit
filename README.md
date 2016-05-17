# 2D-WebGL-Toolkit

A lightweight foundation for your next WebGL based project.

[Run Demo](https://mikatalk.github.io/2D-WebGL-Toolkit/)


### Installation

```
npm install
```

### Build Prod Version

```
npm run build
```

### Start Dev Server 

make sure to install/build project before
```
npm run dev
```

### The 'framework' part:

```
// initialize the stage
Stage.initialize(canvas), { contain: true });

// add layer objects to the display list
Stage.addLayer( new LayerImage( Stage.getGL(), bgImg ) );
Stage.addLayer( new LayerSimpleBall( Stage.getGL() ) );
Stage.addLayer( new LayerBallTrail( Stage.getGL() ) );

// hook up with the render loop
Stage.beforeUpdateHandler( this.update.bind(this) );
Stage.afterUpdateHandler( null );

// initialize a particle system
let particleSystem = new ParticleSystem( Stage.getGL(), 100000, { 
  velocity: { 
    x:0.4, 
    y:1
  }, 
  attenuation: 30,
  size: 40,
  rgba: [1,1,1,1]
});
Stage.addLayer( this.particleSystem );
// spawn particle:
particleSystem.spawn( x, y, radius, red, green, blue, alpha );
```
