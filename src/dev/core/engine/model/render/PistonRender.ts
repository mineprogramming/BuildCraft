/// <reference path="EngineRender.ts" />
class PistonRender extends EngineRender {
    protected boxes = [{
        type: "box",
        uv: null,
        coords: null,
        size: null
    }];

    public set pistonCoords(value: Vector) {
        this.boxes[0].coords = value;
    }

    public set pistonUV(value: Vector2) {
        this.boxes[0].uv = value;
    }

    public set pistonSize(value: Vector) {
        this.boxes[0].size = value;
    }

    protected getModelData(): Render.PartElement[] {
        return this.boxes;
    }
}