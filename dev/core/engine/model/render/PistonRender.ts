/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class PistonRender extends EngineRender{
    constructor(type){
        super(new ModelTexture(TexturesOffset.engine.base["creative"]))
    }

    protected getModelData(){
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: -2,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 4,
                    y: 16,
                    z: 16
                }
            }
        ]
    }
}