class WoodenPipeStorageConnector {
    constructor(public coords: Vector, protected renderer: PipeRenderer, protected texture: PipeTexture) { }

    private side: number = null;// connected side index

    public set connectionSide(value: number) {
        this.side = value;
        this.renderConnections();
    }

    public get connectionSide(): number {
        return this.side;
    }

    public renderConnections(): void {
        const boxes = this.renderer.getBoxes(this.renderer.width);
        const standartModel = this.renderer.standartModel;

        for (let i = 0; i < 6; i++) {
            const box = boxes[i];
            const renderModel = BlockRenderer.createModel();
            const relCoords = World.getRelativeCoords(this.coords.x, this.coords.y, this.coords.z, i);

            if (i == this.connectionSide) {
                const textre = this.texture.containerConnection;
                renderModel.addBox(box.box[0], box.box[1], box.box[2],
                    box.box[3], box.box[4], box.box[5], textre.name, textre.data);
            }
            standartModel.addEntry(renderModel);
        }
        BlockRenderer.mapAtCoords(this.coords.x, this.coords.y, this.coords.z, standartModel);
    }

    public canConnectTo(x: number, y: number, z: number): boolean {
        const container = World.getContainer(x, y, z);
        if (!container) return false;
        // ! container.slots contain not only slots. It containt saverID too.
        // ! container.slots.length = 1 means that container has 0 slots
        if (!container.slots || container.slots.length > 1) return true;
    }

    public destroy(): void {
        BlockRenderer.unmapAtCoords(this.coords.x, this.coords.y, this.coords.z);
    }
}