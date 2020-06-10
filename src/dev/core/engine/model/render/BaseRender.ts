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

    protected chamberBoxes = [{
        type: "box",// chamber
        uv: null,
        coords: null,
        size: null
    }];

    // Base
    public set baseCoords(value: Vector) {
        this.boxes[0].coords = value;
    }

    public set baseUV(value: Vector2) {
        this.boxes[0].uv = value;
    }

    public set baseSize(value: Vector) {
        this.boxes[0].size = value;
    }

    // Trunk
    public set trunkCoords(value: Vector) {
        this.boxes[1].coords = value;
    }

    public set trunkSize(value: Vector) {
        this.boxes[1].size = value;
    }

    public set trunkUV(value: Vector2) {
        this.boxes[1].uv = value;
    }

    // Chamber
    public set chamberCoords(value: Vector) {
        //Debug.m("chamber coords setted");
        this.chamberBoxes[0].coords = value;
    }

    public set chamberSize(value: Vector) {
        //Debug.m("chamber size setted");
        this.chamberBoxes[0].size = value;
    }

    public set chamberUV(value: Vector2) {
       // Debug.m("chamber uv setted");
        this.chamberBoxes[0].uv = value;
    }

    public refreshChamber(): void {
        //Debug.m("chamber refreshed");
        let part = this.render.addPart("head.chamber");
        this.render.setPart("head.chamber", this.chamberBoxes, this.engineTexture.size);
    };

    protected getModelData(): PartObject[] {
        return this.boxes;
    }
}