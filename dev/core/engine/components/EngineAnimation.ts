/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/TrunkRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="animation/AnimationComponent.ts" />
/// <reference path="animation/PistonAnimation.ts" />
class EngineAnimation {
    private readonly base: AnimationComponent;
    private readonly trunk: AnimationComponent;
    private readonly piston: PistonAnimation;

    private pistonPosition: number = 0;
    private pushingMultiplier: number = 1;

    constructor(public readonly coords: IBlockPos, private readonly type: EngineType, private heatStage: EngineHeat){
        this.base = new AnimationComponent(coords, new BaseRender(this.type));
        this.trunk = new AnimationComponent(coords, new TrunkRender(this.heatStage));
        this.piston = new PistonAnimation(coords, this.type);
    }

    public update(power: number, heat: EngineHeat): void{
        if(this.heatStage !== heat){
            this.trunk.updateRender(new TrunkRender(heat));
            this.heatStage = heat;
        }

        this.pushingMultiplier = this.pistonPosition < 0 ? 1 : this.pushingMultiplier;
        this.pistonPosition += power * this.pushingMultiplier / 64; // 64 is magical multiplier

        this.piston.setPosition(this.pistonPosition);
    }

    isReadyToGoBack(): boolean {
        return this.pistonPosition > .5
    }

    goBack(): void{
        this.pushingMultiplier = -1;
    }

    destroy(): void{
        this.base.destroy();
        this.trunk.destroy();
        this.piston.destroy();
    }
}