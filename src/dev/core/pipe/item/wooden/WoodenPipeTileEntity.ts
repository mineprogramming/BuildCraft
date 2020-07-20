/// <reference path="WoodenPipeStorageConnector.ts" />
class WoodenPipeTileEntity {
    // * it will be rewriten during runtime
    protected data: any = {}

    protected defaultValues: any = {// * it will be rewriten during runtime
        connectionSide: null
    }

    private storageConnector: WoodenPipeStorageConnector;

    public x: number;
    public y: number;
    public z: number;

    get orientation() {
        if (!this.data.connectionSide) {
            this.data.connectionSide = this.getConnectionSide();
        }
        return this.data.connectionSide;
    }

    set orientation(value: number) {
        this.data.meta = value;
        this.storageConnector.connectionSide = value;
    }

    // !TileEntity event
    public tick() {
        Game.tipMessage("tick");
    }

    // !TileEntity event
    public init() {
        this.storageConnector = new WoodenPipeStorageConnector();
        this.storageConnector.connectionSide = this.orientation = this.getConnectionSide();
        alert(this.orientation);
    }

    /** @param findNext - use true value if you want to rerotate pipe like a wrench */
    protected getConnectionSide(findNext: boolean = false) {
        // * In common situation ends when i gets max in 5 index
        // * But if fhis function calling by wrench index can go beyound
        // * I think this code is poor, but maybe i fix it in future
        for (let t = 0; t < 12; t++) {
            const i = t % 6;
            if (findNext) {
                if (this.orientation == t) findNext = false;
                continue;
            }
            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            const container = World.getContainer(relCoords.x, relCoords.y, relCoords.z);
            if (container) return i;
        }
        // default value
        return null;
    }
}