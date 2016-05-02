# 2D-WebGL-Toolkit

A lightweight foundation for your next WebGL based project.

[Run Demo](https://mikatalk.github.io/2D-WebGL-Toolkit/)


### Installation

```
npm install
```

### Start Dev Server 

```
npm run dev
```

### Build Prod Version

```
npm run build
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
```

### Workflow:

* ES6 Support via [babel-loader](https://github.com/babel/babel-loader)
* SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
* Linting via [eslint-loader](https://github.com/MoOx/eslint-loader)
* Hot Module Replacement

When you run `npm run build` we use the [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) to move the css to a separate file and included in the head of your `index.html`, so that the styles are applied before any javascript gets loaded. We disabled this function for the dev version, because the loader doesn't support hot module replacement.
