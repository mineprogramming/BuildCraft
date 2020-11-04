class IronPipeRenderConnector {
    constructor(public pipeClass: BCPipe, public coords: Vector, protected renderer: PipeRenderer, protected connector: PipeConnector,
        protected texture: PipeTexture) { }

    private side: number;

    public get ConnectionSide(): number {
        return this.side;
    }

    public set ConnectionSide(value: number) {
        this.side = value;
        this.updateConnections();
    }

    public updateConnections() {
        const width = this.renderer.width;
        const render = new ICRender.Model();
        const boxes = this.renderer.getBoxes(width);

        for (let i = 0; i < 6; i++) {
            const box = boxes[i];
            const renderModel = BlockRenderer.createModel();

            let condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], this.pipeClass.renderGroups.main, false);
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
            let texture: TexturePair;
            if (this.ConnectionSide != i) {
                texture = this.texture.containerConnection;
            } else {
                texture = this.texture.connection;
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
        BlockRenderer.mapAtCoords(this.coords.x, this.coords.y, this.coords.z, render);
    }

    public destroy(): void {
        BlockRenderer.unmapAtCoords(this.coords.x, this.coords.y, this.coords.z);
    }
}
