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

    constructor(public readonly coords: IBlockPos, private readonly type: EngineType){
        Debug.m("constructor EngineAnimation");
        this.baseAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        this.trunkAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        this.pistonAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);

        Debug.m(this.type);

        this.baseRender = new BaseRender("creative");
        this.trunkRender = new TrunkRender("creative");
        this.pistonRender = new PistonRender("creative");

        this.initAnimations();
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

    public update(): void{
        
    }
}