/// <reference path="EngineRender.ts" />
class BaseRender extends EngineRender{
    protected getGroupPrefix(): string {
        return "BaseRender"
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