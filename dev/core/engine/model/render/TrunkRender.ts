/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class TrunkRender extends EngineRender{
    constructor(type){
        super(new ModelTexture(TexturesOffset.trunk["BLUE"]))
    }

    protected getModelData(){
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: -6,
                    y: 24,
                    z: 8 + .01,
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