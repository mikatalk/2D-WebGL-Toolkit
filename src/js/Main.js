'use strict';

import '../sass/main.scss';

import Detector from './vendors/Detector';

import Game from './Game';

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

window.addEventListener('load', function () {
    let game = new Game({});
});
