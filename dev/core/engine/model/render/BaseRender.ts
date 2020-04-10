/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class BaseRender extends EngineRender{
    constructor(type){
        super(new ModelTexture(TexturesOffset.engine.base[type]))
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
            }
        ]
    }
}