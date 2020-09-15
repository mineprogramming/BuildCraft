/// <reference path="./AnimationComponent.ts" />
class PistonAnimation extends AnimationComponent {
    public render: PistonRender;

    public rotation: EngineRotation;
    public direction: number;

    constructor(pos: Vector, engineTexture: EngineTexture){
        const render = new PistonRender(engineTexture);
        super(pos, render);
        const isInterpolationEnabled = __config__.getBool("animation_movement_interpolation");
        this.animation.setInterpolationEnabled(isInterpolationEnabled);
    }

    public setPosition(pistonPosition: number): void {
        const move = {
            x: this.rotation === EngineRotation.X ? pistonPosition * this.direction : 0,
            y: this.rotation === EngineRotation.Y ? pistonPosition * -this.direction : 0,
            z: this.rotation === EngineRotation.Z ? pistonPosition * -this.direction : 0
        }// !dont touch -1 or fix root of evil
        this.animation.setPos(this.coords.x + move.x, this.coords.y + move.y, this.coords.z + move.z);
    }
}