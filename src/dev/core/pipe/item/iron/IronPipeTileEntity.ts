class IronPipeTileEntity {
    constructor(protected renderer: PipeRenderer, protected pipeConnector: PipeConnector, protected texture: PipeTexture) { }
    protected data: any = {}

    protected defaultValues: any = {// * it will be rewriten during runtime
        connectionSide: null,
        energy: 0
    }

    private connector: IronPipeRenderConnector;

    public x: number;
    public y: number;
    public z: number;

    private changeOrientation(value: number) {
        this.data.connectionSide = value;
        this.connector.ConnectedSide = value;
    }

    // !TileEntity event
    public init(): void {
        this.connector = new IronPipeRenderConnector(this, this.renderer, this.pipeConnector, this.texture);
        this.updateConnectionSide();
    }

    // !TileEntity event
    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;

        this.updateConnectionSide(true);
        return true;
    }

    public updateConnectionSide(findNext: boolean = false): void {
        const side = this.getConnectionSide(findNext);
        this.changeOrientation(side);
    }

    public canItemGoToSide(item: ItemInstance, index: number): boolean {
        return index == this.connector.ConnectedSide;
    }

    /** @param findNext - use true value if you want to rerotate pipe like a wrench */
    protected getConnectionSide(findNext: boolean = false): number | null {
        // * In common situation ends when i gets max in 5 index
        // * But if fhis function calling by wrench index can go beyound
        // * I think this code is poor, but maybe i fix it in future
        for (let t = 0; t < 12; t++) {
            const i = t % 6;

            if (findNext) {

                if (this.data.connectionSide == t) {
                    findNext = false
                }

                continue;
            }

            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);

            if (this.connector.canConnectTo(relCoords)) {
                return i;
            }
        }
        // default value
        return null;
    }
}