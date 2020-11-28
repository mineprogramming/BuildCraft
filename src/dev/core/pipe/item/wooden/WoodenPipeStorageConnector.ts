class WoodenPipeStorageConnector {
    constructor(public coords: Vector, protected renderer: PipeRenderer, protected texture: PipeTexture) { }

    private side: number = null;// connected side index

    public set ConnectionSide(value: number) {
        this.side = value;
        this.renderConnections();
    }

    public get ConnectionSide(): number {
        return this.side;
    }

    public renderConnections(): void {
        const boxes = this.renderer.getBoxes(this.renderer.width);
        const standartModel = this.renderer.standartModel;
        if (this.ConnectionSide > 0) {
            for (let i = 0; i < 6; i++) {
                const box = boxes[i];
                const renderModel = BlockRenderer.createModel();

                if (i == this.ConnectionSide) {
                    const textre = this.texture.containerConnection;
                    renderModel.addBox(box.box[0], box.box[1], box.box[2],
                        box.box[3], box.box[4], box.box[5], textre.name, textre.data);
                }
                standartModel.addEntry(renderModel);
            }
        }

        BlockRenderer.mapAtCoords(this.coords.x, this.coords.y, this.coords.z, standartModel);
    }

    public destroy(): void {
        BlockRenderer.unmapAtCoords(this.coords.x, this.coords.y, this.coords.z);
    }
}