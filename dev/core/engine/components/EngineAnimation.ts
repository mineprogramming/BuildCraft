/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/TrunkRender.ts" />

class EngineAnimation {
    private readonly base;
    private readonly trunk;
    private readonly piston;

    private readonly baseRender: BaseRender;
    private readonly trunkRender: TrunkRender;

    constructor(public readonly coords: IBlockPos, private readonly type: EngineType){
        Debug.m("constructor EngineAnimation");
        this.base = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        this.trunk = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);

        Debug.m(this.type);

        this.baseRender = new BaseRender("creative");
        this.trunkRender = new TrunkRender("creative");

        this.initAnimations();
    }

    private initAnimations(){
        this.base.describe({render: this.baseRender.getID()});
        this.base.load();

        this.trunk.describe({render: this.trunkRender.getID()});
        this.trunk.load();
        //this.base.render.transform.rotate(Math.PI, Math.PI , Math.PI);
        //this.base.render.rebuild();
    }

    public update(): void{

    }
}