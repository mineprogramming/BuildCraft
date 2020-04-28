/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class PistonRender extends EngineRender {
    protected boxes = [ {
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
    }];

    protected getGroupPrefix(): string {
        return "PistonRender"
    }

    public set pistonCoords(value: Vector) {
        this.boxes[0].coords = value;
    }

    public set pistonSize(value: Vector) {
        this.boxes[0].size = value;
    }

    protected getModelData(){
        return this.boxes;
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