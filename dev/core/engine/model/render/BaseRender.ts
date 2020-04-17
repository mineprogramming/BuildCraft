/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class BaseRender extends EngineRender {
    protected trunkTextrueUV = TexturesOffset.trunk.BLUE;

    constructor(type: string, heat: EngineHeat){
        super(type)
        this.updateHeatStage(heat);
    }

    protected getGroupPrefix(): string {
        return "BaseRender"
    }

    updateHeatStage(heat: EngineHeat){
        //  Debug.m("Current UV");
        // Debug.m(this.trunkTextrueUV);
        this.trunkTextrueUV = TexturesOffset.trunk[heat];
    }

    protected getModelData(){
        Debug.m(this.trunkTextrueUV);
        Debug.m("BLUE");
        Debug.m(TexturesOffset.trunk.BLUE);
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: -6,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 4,
                    y: 16,
                    z: 16
                }
            },
            {
                type: "box",
                uv: this.trunkTextrueUV,
                coords: {
                    x: .01,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 16,
                    y: 8,
                    z: 8
                }
            }
        ]
    }
}