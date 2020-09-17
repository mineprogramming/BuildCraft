/// <reference path="../abstract/PipeConnector.ts" />
class PipeRenderer {
    constructor(protected connector: PipeConnector, protected texture: PipeTexture, protected renderGroup: ICRenderGroup) { }

    public readonly width = .5;

    public get standartICrender() {
        const render = new ICRender.Model();
        return render;
    }

    public getICrenderAtCoords(coords: Vector) {

    }

    public enableRender(id: number, data: number): void {
        const render = this.standartModel;
        BlockRenderer.setStaticICRender(id, data, render);
        BlockRenderer.enableCoordMapping(id, data, render);
    }

    public getBoxes(width: number): any[] {
        return [
            { side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2] },
            { side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2] },
            { side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2] },
            { side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1] },
            { side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2] },
            { side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2] }
        ]
    }

    public get standartModel(): ICRender.Model {
        const width = this.width;
        const render = new ICRender.Model();
        const boxes = this.getBoxes(width);
        for (const box of boxes) {
            const renderModel = BlockRenderer.createModel();
            const texture = this.texture.connection;

            let condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], this.renderGroup, false);
            const groupRules = this.connector.getConnectionRules();
            for (const rule of groupRules) {
                const newGroup = ICRender.getGroup(rule.name);
                const additionCondition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], newGroup, rule.exclude);
                if (rule.isANDrule) {
                    condition = ICRender.AND(condition, additionCondition);
                } else {
                    condition = ICRender.OR(condition, additionCondition);
                }
            }

            renderModel.addBox(box.box[0], box.box[1], box.box[2], box.box[3],
                box.box[4], box.box[5], texture.name, texture.data);
            render.addEntry(renderModel).setCondition(condition);
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
