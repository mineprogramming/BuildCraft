/// <reference path="connector/PipeConnector.ts" />
class PipeRenderer {
    constructor(private connector: PipeConnector, private texture: PipeTexture, private renderGroup: ICRenderGroup){}

    public readonly width = .5;

    public get standartICrender(){
        const render = new ICRender.Model();
        return render;
    }

    public getICrenderAtCoords(coords: Vector){

    }

    public enableRender(id: number, data: number){
        alert(`render enabled for ${id}`);
        const render = this.standartModel;
        BlockRenderer.setStaticICRender(id, data, render);
        BlockRenderer.enableCoordMapping(id, data, render);
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

    public get standartModel(): ICRender.Model {
        const width = this.width;
        const render = new ICRender.Model();
        const boxes = this.getBoxes(width);
        for (const box of boxes) {
            const model = BlockRenderer.createModel();
            const texture = this.texture.connection;
            const condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], this.renderGroup, false);

            model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, texture.data);
            render.addEntry(model).setCondition(condition);

            // Connecting to TileEntities
            const tileConnectionsModel = this.connector.getModifiedModel(box, this.texture);
            const tileConnectionsCondition = this.connector.getModelCondition(box);
            render.addEntry(tileConnectionsModel).setCondition(tileConnectionsCondition);
        }

        // standart box
        const model = BlockRenderer.createModel();
        const p0 = 0.5 - width / 2;
        const p1 = 0.5 + width / 2;
        model.addBox(p0, p0, p0, p1, p1, p1, this.texture.block.name, this.texture.block.data);
        render.addEntry(model);
        return render;
    }
}
