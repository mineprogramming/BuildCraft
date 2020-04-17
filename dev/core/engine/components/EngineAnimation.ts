/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />
class EngineAnimation {
    private readonly base: BaseAnimation;
    private readonly piston: PistonAnimation;

    private pistonPosition: number = 0;
    private pushingMultiplier: number = 1;

    private meta = 1;// connected side index

    public set connectionSide(value: number){
        alert(`meta setted to ${value}`);
        this.meta = value;
        this.rotateByMeta();
    }

    public get connectionSide(): number {
        return this.meta;
    }

    constructor(public readonly coords: IBlockPos, private readonly type: EngineType, private heatStage: EngineHeat){
        this.piston = new PistonAnimation(coords, this.type);
        this.base = new BaseAnimation(coords, this.type, this.heatStage);
    }

    public update(power: number, heat: EngineHeat): void{
        if(this.heatStage !== heat){
            this.base.updateHeat(heat);
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

    rotateByMeta(){
        alert("rotated "+this.connectionSide);
    }

    destroy(): void{
        this.base.destroy();
        this.piston.destroy();
    }
}