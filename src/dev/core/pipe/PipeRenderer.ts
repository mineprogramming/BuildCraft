/// <reference path="connector/IPipeConnector.ts" />
class PipeRenderer {
    constructor(private connector: IPipeConnector, private texture: PipeTexture, private renderGroup: ICRenderGroup){}

    public get standartICrender(){
        const render = new ICRender.Model();
        return render;
    }

    public getICrenderAtCoords(coords: Vector){

    }

    public getBoxes(width: number): any[] {
        return [
            {side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
            {side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
            {side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
            {side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
            {side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
            {side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]},
        ]
    }

    public getStandartModel(): ICRender.Model {
        const render = new ICRender.Model();
        const boxes = this.getBoxes(.5);
        for (const box of boxes) {
            const model = BlockRenderer.createModel();
            const texture = this.texture.connection;
            const condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], this.renderGroup, false);

            model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, texture.data);
            render.addEntry(model).setCondition(condition);
        }
        return render;
    }
}
