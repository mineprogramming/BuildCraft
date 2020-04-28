/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
class BaseRender extends EngineRender {

    protected readonly texture = new ModelTexture(this.getTextureOffset());
    protected boxes = [{
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
    },
    {
        type: "box",
        uv: TexturesOffset.trunk.BLUE,
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
    }];

    public set baseCoords(value: Vector) {
        this.boxes[0].coords = value;
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

    constructor(type: string, protected heat: EngineHeat){
        super(type);
        this.updateHeatStage(heat);
    }

    protected getGroupPrefix(): string {
        return "BaseRender"
    }

    updateHeatStage(heat: EngineHeat){
        this.boxes[1].uv = TexturesOffset.trunk[heat];
        this.heat = heat;
        this.refresh();
    }


    protected getModelData(): PartObject[]{
        return this.boxes;

        let coordsOffset = {
            x: 0,
            y: 0,
            z: 0
        };

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
            },
            {
                type: "box",
                uv: TexturesOffset.trunk[this.heat],
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