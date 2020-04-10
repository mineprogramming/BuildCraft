/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/RenderManager.ts" />
var textureOffset = {
    engine: {
        creative: {x: 320, y: 96},
        iron : "iron",
        redstone : "redstone",
        stirling : "stirling",
        custom : "custom"
    },
    trunk: {
        BLUE : {x: 64, y: 0},
        GREEN : {x: 64, y: 32},
        ORANGE : {x: 64, y: 64},
        RED: {x: 64, y: 96},
        BLACK: {x: 64, y: 128}
    }
}
class EngineAnimation {
    private readonly base;
    private readonly some;

    private readonly baseTexture: ModelTexture;
    private readonly trunkTexture: ModelTexture;

    constructor(public readonly coords: IBlockPos,private readonly type: EngineType){
        Debug.m("constructor EngineAnimation");
        this.base = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        Debug.m(this.type);
        this.baseTexture = new ModelTexture(textureOffset.engine["creative"]);
        this.trunkTexture = new ModelTexture(textureOffset.trunk["BLUE"])
        this.initAnim();
    }
    private initAnim(){
        this.base.describe(this.getDescription());
        this.base.load();
        //this.base.render.transform.rotate(Math.PI / 3, Math.PI / 3 , Math.PI / 3);
    }
    public update(): void{

    }
    private getDescription(): object {
        return {
            render: this.getRender().getId()
        };
    }
    private getRender(){
        Debug.m("getRender");
        Debug.m("model/" + this.baseTexture.getTexture()+"  "+this.baseTexture.getSize());
        var render = new Render({skin: "model/" + this.baseTexture.getTexture()});
        render.setPart("body", this.getModelData(), this.baseTexture.getSize());
        return render;
    }
    private getModelData(){
        Debug.m("getModelData ");
        Debug.m(this.baseTexture.getUV());
        return [{
            type: "box",
            uv: this.baseTexture.getUV(),
            coords: {
                x: 2,
                y: 32,
                z: -8,
            },
            size: {
                x: 4,
                y: 16,
                z: 16
            }
        },
        {
            type: "box",
            uv: this.trunkTexture.getUV(),
            coords: {
                x: 8 + 1/100,
                y: 32,
                z: -8,
            },
            size: {
                x: 16,
                y: 8,
                z: 8
            }
        }];
    }
}