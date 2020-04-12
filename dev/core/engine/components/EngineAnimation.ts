/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/TrunkRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />


class EngineAnimation {
    private readonly baseAnimation;
    private readonly trunkAnimation;
    private readonly pistonAnimation;

    private readonly baseRender: BaseRender;
    private readonly trunkRender: TrunkRender;
    private readonly pistonRender: PistonRender;

    private pistonPosition: number = 0;//TODO add getter and setter

    private pushingMultiplier: number = 1;
    public readonly coords: IBlockPos;

    constructor(pos: IBlockPos, private readonly type: EngineType, private heatStage: EngineHeat){
        this.coords = {x: pos.x + .5, y: pos.y +.5, z: pos.z + .5};
        this.baseAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.trunkAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.pistonAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);

        this.pistonAnimation.setInterpolationEnabled(true);

        this.baseRender = new BaseRender("creative");
        this.trunkRender = new TrunkRender(this.heatStage);
        this.pistonRender = new PistonRender("creative");

        this.initAnimations();
    }

    public isReadyToDeployEnergy(): Boolean {
        return this.pistonPosition > 24
    }

    private initAnimations(){
        this.baseAnimation.describe({render: this.baseRender.getID()});
        this.baseAnimation.load();

        this.trunkAnimation.describe({render: this.trunkRender.getID()});
        this.trunkAnimation.load();

        this.pistonAnimation.describe({render: this.pistonRender.getID()});
        this.pistonAnimation.load();

        //this.baseAnimation.render.transform.rotate(Math.PI/3, Math.PI/2 , Math.PI/4);
        //this.baseRender.rebuild();
    }

    public update(power: number): void{
        this.pushingMultiplier = this.pistonPosition < 0 ? 1 : this.pushingMultiplier;

        this.pistonPosition += power * this.pushingMultiplier;
        this.pistonAnimation.setPos(this.coords.x + this.pistonPosition / 50, this.coords.y, this.coords.z);
    }

    public goBack(): void{
        this.pushingMultiplier = -1;
    }
}