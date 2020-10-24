/// <reference path="IronPipeClient.ts" />
class IronPipeTileEntity {
    private clientFactory: ClientFactory = new ClientFactory(IronPipeClient);

    protected data: any = {}

    public defaultValues: any = {
        connectionSide: -1
    }

    public x: number;
    public y: number;
    public z: number;

    public blockSource: BlockSource;

    public client: IronPipeClient;


    constructor(protected renderer: PipeRenderer, protected pipeConnector: PipeConnector, protected texture: PipeTexture) {
        this.client = this.clientFactory.instantiate(renderer, texture, pipeConnector);
    }

    private changeOrientation() {
        // ? if connection side is null put < 0 to syncData
        // @ts-ignore
        this.networkData.putInt("orientation", this.data.connectionSide);
        // @ts-ignore
        this.networkData.sendChanges();
    }

    // !TileEntity event
    public init(): void {
        this.checkConnection();
    }

    // !TileEntity event
    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;

        this.updateConnectionSide(true);
        return true;
    }

    private updateConnectionSide(findNext: boolean = false): void {
        this.data.connectionSide = this.getConnectionSide(findNext);
        this.changeOrientation();
    }

    public canItemGoToSide(item: ItemInstance, index: number): boolean {
        return index == this.data.connectionSide;
    }

    /** @param findNext - use true value if you want to rerotate pipe like a wrench */
    protected getConnectionSide(findNext: boolean = false): number {
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
            if (this.canConnectTo(relCoords)) return i;
        }
        // default value
        return -1;
    }

    public checkConnection(): void {
        if (this.data.connectionSide < 0){
            this.updateConnectionSide();
        } else {
            const coords = World.getRelativeCoords(this.x, this.y, this.z, this.data.connectionSide);
            if (!this.canConnectTo(coords)) {
                this.updateConnectionSide();
            } else {
                this.changeOrientation();
            }
        }
    }

    private canConnectTo(coords: Vector): boolean {
        const { x, y, z } = coords;
        const blockID = World.getBlockID(x, y, z);
        const relativePipe = PipeIdMap.getClassById(blockID);
        if (relativePipe) {
            return this.pipeConnector.canConnectToPipe(relativePipe)
        }
        const container = World.getContainer(x, y, z, this.blockSource);
        return this.isValidContainer(container);
    }

    private isValidContainer(container): boolean {
        if (!container) return false;

        // ? if NativeTileEntity is NullObject
        if (container.getSlot(0) == null) return false;

        // ! container.slots contain not only slots. It containt saverID too.
        // ! container.slots.length = 1 means that container has 0 slots
        if (!container.slots || container.slots.length > 1) return true;
    }
}
