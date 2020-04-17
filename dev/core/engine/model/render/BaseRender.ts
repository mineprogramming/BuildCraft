/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class BaseRender extends EngineRender {

    constructor(type: string, protected heat: EngineHeat){
        super(type);
        this.updateHeatStage(heat);
    }

    protected getGroupPrefix(): string {
        return "BaseRender"
    }

    updateHeatStage(heat: EngineHeat){
        this.heat = heat;
        this.render.setPart("head", this.getModelData(), this.texture.getSize());
    }

    protected getModelData(){
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
                uv: TexturesOffset.trunk[this.heat],
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