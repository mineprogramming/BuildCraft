class WoodenPipeStorageConnector {
    constructor(public coords: Vector, protected renderer: PipeRenderer, protected texture: PipeTexture) { }

    private side: number = null;// connected side index

    public set connectionSide(value: number) {
        alert(`connected to ${value}`);
        this.side = value;
        this.renderConnections();
    }

    public get connectionSide(): number {
        return this.side;
    }

    private renderConnections(): void {
        const boxes = this.renderer.getBoxes(this.renderer.width);
        const standartModel = this.renderer.standartModel;

        for (let i = 0; i < 5; i++) {
            alert(`checking ${i} side`);
            const box = boxes[i];
            const renderModel = BlockRenderer.createModel();
            const relCoords = World.getRelativeCoords(this.coords.x, this.coords.y, this.coords.z, i);
            const container = World.getContainer(relCoords.x, relCoords.y, relCoords.z);

            if (i == this.connectionSide) {
                // render SUPER PIPE
                const textre = this.texture.containerConnection;
                renderModel.addBox(box.box[0], box.box[1], box.box[2],
                    box.box[3], box.box[4], box.box[5], textre.name, textre.data);
                alert(` ${i} side is super container side`);
            } else if (container) {
                // render common PIPE
                alert(` ${i} side is simple container side`);
                renderModel.addBox(box.box[0], box.box[1], box.box[2],
                    box.box[3], box.box[4], box.box[5], this.texture.connection.name, this.texture.connection.data);
            }
            standartModel.addEntry(renderModel);
        }
        BlockRenderer.mapAtCoords(this.coords.x, this.coords.y, this.coords.z, standartModel);
        Debug.m("mapped!");
    }
}