/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
class PistonAnimation extends AnimationComponent {
    public render: PistonRender;

    public rotation: EngineRotation;
    public direction: number;

    constructor(pos: IBlockPos, type: EngineType){
        const render = new PistonRender(type);
        super(pos, render);
    }

    setPosition(pistonPosition: number){
        const move = {
            x: this.rotation === EngineRotation.X ? pistonPosition * this.direction : 0,
            y: this.rotation === EngineRotation.Y ? pistonPosition * -this.direction : 0,
            z: this.rotation === EngineRotation.Z ? pistonPosition * -this.direction : 0
        }// !dont touch -1 or fix root of evil
        // Game.tipMessage(JSON.stringify(move));
        this.animation.setPos(this.coords.x + move.x, this.coords.y + move.y, this.coords.z + move.z);
    }
}