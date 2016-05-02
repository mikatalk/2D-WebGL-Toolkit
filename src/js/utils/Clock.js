export default class Clock {

    constructor () {
        this.timeBefore = Date.now();
        this.lifeTime = 0;
        this.elapsedTime = 0;
    }

    tick () {
        this.elapsedTime = Date.now() - this.timeBefore;
        this.timeBefore = Date.now();
        this.lifeTime += this.elapsedTime;
        return this.elapsedTime / 1000;
    }
}
