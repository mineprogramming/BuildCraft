/// <reference path="EngineRender.ts" />
class BaseRender extends EngineRender {
    protected boxes = [{
        type: "box",// base
        uv: null,
        coords: null,
        size: null
    },
    {
        type: "box",// trunk
        uv: null,
        coords: null,
        size: null
    }];

    public set baseCoords(value: Vector) {
        this.boxes[0].coords = value;
    }

    public set baseUV(value: Vector2) {
        this.boxes[0].uv = value;
    }

    public set baseSize(value: Vector) {
        this.boxes[0].size = value;
    }

    public set trunkCoords(value: Vector) {
        this.boxes[1].coords = value;
    }

    public set trunkSize(value: Vector) {
        this.boxes[1].size = value;
    }

    public set trunkUV(value: Vector2) {
        this.boxes[1].uv = value;
    }

    protected getModelData(): PartObject[] {
        return this.boxes;
    }
}