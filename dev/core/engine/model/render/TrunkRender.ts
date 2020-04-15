/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class TrunkRender extends EngineRender {
    protected getGroupPrefix(): string {
        return "TrunkRender"
    }

    protected getTextureOffset(): object {
        return TexturesOffset.trunk[this.type];
    }

    protected getModelData(){
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
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