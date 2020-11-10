/// <reference path="WoodenPipeStorageConnector.ts" />
/// <reference path="WoodenPipeItemEjector.ts" />
/// <reference path="WoodenPipeClient.ts" />
class WoodenPipeTileEntity implements TileEntity.TileEntityPrototype {
    private clientFactory: ClientFactory = new ClientFactory(WoodenPipeClient);

    // * it will be rewriten during runtime
    protected data: any = {}

    public defaultValues: any = {// * it will be rewriten during runtime
        // ? I use -1 because we cant put null into java.int in SyncedData
        connectionSide: -1,
        energy: 0
    }

    // private storageConnector: WoodenPipeStorageConnector;
    private itemEjector: WoodenPipeItemEjector;

    public x: number;
    public y: number;
    public z: number;

    public blockSource: BlockSource;
    public networkData: SyncedNetworkData;

    private ticksSincePull: number = 0;

    public client: WoodenPipeClient;

    constructor(protected renderer: PipeRenderer, protected texture: PipeTexture) {
        this.client = this.clientFactory.instantiate(renderer, texture);
    }

    private changeOrientation() {
        this.itemEjector.connectionSide = this.data.connectionSide;
        // ? if connection side is null put < 0 to syncData
        this.networkData.putInt("orientation", this.data.connectionSide);
        this.networkData.sendChanges();
    }

    // !TileEntity event
    public tick(): void {
        this.ticksSincePull++;

        if (this.shouldTick()) {
            const maxExtractable = this.maxExtractable();
            const targets = this.itemEjector.getExtractionTargetsCount(maxExtractable);
            if (targets > 0) {
                // * EXTRACT
                this.itemEjector.extractItems(this.maxExtractable());
            }

            this.data.energy = 0;
            this.ticksSincePull = 0;
        }
    }

    // !TileEntity event
    public init(): void {
        this.itemEjector = new WoodenPipeItemEjector(this.blockSource, this.x, this.y, this.z);
        this.checkConnection();
    }

    // !TileEntity event
    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;

        this.updateConnectionSide(true);
        return true;
    }

    // !EnergyNet event
    public energyReceive(type, amount, voltage): number {
        const storage = this.getMaxEnergyStored();
        const readyToReceive = Math.min(storage - amount, this.getMaxEnergyReceive());
        const received = Math.min(readyToReceive, amount);
        this.data.energy += received;
        return received;
    }

    private shouldTick(): boolean {
        if (this.ticksSincePull < 8) {
            return false;
        } else if (this.ticksSincePull < 16) {
            // !Check if we have just enough energy for the next stack.
            if (this.data.connectionSide <= 5) {
                const stackSize = this.itemEjector.getExtractionTargetsCount(this.maxExtractable());

                if (stackSize > 0 && this.data.energy >= stackSize * 10) {
                    return true;
                }
            }
        }
        return this.ticksSincePull >= 16 && this.data.energy >= 10;
    }

    public updateConnectionSide(findNext: boolean = false): void {
        this.data.connectionSide = this.getConnectionSide(findNext);
        this.changeOrientation();
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
            const { x, y, z } = World.getRelativeCoords(this.x, this.y, this.z, i);
            if (this.canConnectTo(x, y, z, this.blockSource)) return i;
        }
        // default value
        return -1;
    }

    public checkConnection(): void {
        if (this.data.connectionSide < 0){
            this.updateConnectionSide();
        } else {
            const { x, y, z } = World.getRelativeCoords(this.x, this.y, this.z, this.data.connectionSide);
            if (!this.canConnectTo(x, y, z, this.blockSource)) {
                this.updateConnectionSide();
            } else {
                this.changeOrientation();
            }
        }
    }

    public canConnectTo(x: number, y: number, z: number, region: BlockSource): boolean {
        const container = World.getContainer(x, y, z, region) as UI.Container;
        if (!container) return false;

        // ? if NativeTileEntity is NullObject
        if (container.getSlot(0) == null) return false;

        // ! container.slots contain not only slots. It containt saverID too.
        // ! container.slots.length = 1 means that container has 0 slots
        if (!container.slots || container.slots.length > 1) return true;
    }

    private maxExtractable(): number {
        return Math.floor(this.data.energy / 10);
    }

    public canConnectRedstoneEngine(): boolean {
        return true
    }

    public getMaxEnergyStored(): number {
        return 2560;
    }

    public getMaxEnergyReceive(): number {
        return 80;
    }
}