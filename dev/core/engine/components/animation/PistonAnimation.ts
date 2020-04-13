/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
class PistonAnimation extends AnimationComponent {
    constructor(pos: IBlockPos, type: EngineType){
        super(pos, new PistonRender(type));
    }

    setPosition(pistonPosition: number){
        this.animation.setPos(this.coords.x + pistonPosition, this.coords.y, this.coords.z);
    }
}