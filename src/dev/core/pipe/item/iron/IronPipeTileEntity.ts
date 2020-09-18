class IronPipeTileEntity {
    constructor(protected renderer: PipeRenderer, protected pipeConnector: PipeConnector, protected texture: PipeTexture) { }
    protected data: any = {}

    public defaultValues: any = {
        side: null
    }

    private connector: IronPipeRenderConnector;

    public x: number;
    public y: number;
    public z: number;

    private changeOrientation(value: number) {
        this.data.side = value;
        this.connector.ConnectedSide = value;
    }

    // !TileEntity event
    public init(): void {
        this.connector = new IronPipeRenderConnector(this, this.renderer, this.pipeConnector, this.texture);
        if (this.checkConnection()) this.connector.updateConnections();
    }

    /**
     * @returns {boolean} need to update render
     */
    public checkConnection(): boolean {
        if (!this.data.side){
            this.updateConnectionSide();
            return false;
        }

        const coords = World.getRelativeCoords(this.x, this.y, this.z, this.data.side);
        if (!this.connector.canConnectTo(coords)) {
            this.updateConnectionSide();
            return false;
        }

        this.connector.ConnectedSide = this.data.side;
        return true;
    }

    // !TileEntity event
    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;

        this.updateConnectionSide(true);
        return true;
    }

    private updateConnectionSide(findNext: boolean = false): void {
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

                if (this.connector.ConnectedSide == t) {
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