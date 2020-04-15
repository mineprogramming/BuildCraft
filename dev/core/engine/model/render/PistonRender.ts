/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class PistonRender extends EngineRender {
    protected getGroupPrefix(): string {
        return "PistonRender"
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