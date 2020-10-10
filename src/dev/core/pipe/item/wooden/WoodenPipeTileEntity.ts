/// <reference path="WoodenPipeStorageConnector.ts" />
/// <reference path="WoodenPipeItemEjector.ts" />
class WoodenPipeTileEntity {
    constructor(protected renderer: PipeRenderer, protected texture: PipeTexture) { }
    // * it will be rewriten during runtime
    protected data: any = {}

    protected defaultValues: any = {// * it will be rewriten during runtime
        connectionSide: null,
        energy: 0
    }

    private storageConnector: WoodenPipeStorageConnector;
    private itemEjector: WoodenPipeItemEjector;

    public x: number;
    public y: number;
    public z: number;

    public region: BlockSource;

    private ticksSincePull: number = 0;

    public useNetworkItemContainer: true;

    private changeOrientation(value: number) {
        this.data.connectionSide = value;
        this.storageConnector.connectionSide = value;
        this.itemEjector.connectionSide = value;
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
        this.storageConnector = new WoodenPipeStorageConnector(this, this.renderer, this.texture);
        this.itemEjector = new WoodenPipeItemEjector(this.region,this.x, this.y, this.z);
        this.checkConnection()
    }

    // !TileEntity event
    public destroy() {
        this.storageConnector.destroy();
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

    public canConnectRedstoneEngine(): boolean {
        return true
    }

    public getMaxEnergyStored(): number {
        return 2560;
    }

    public getMaxEnergyReceive(): number {
        return 80;
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

    private maxExtractable(): number {
        return Math.floor(this.data.energy / 10);
    }

    public updateConnectionSide(findNext: boolean = false): void {
        const side = this.getConnectionSide(findNext);
        this.changeOrientation(side);
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

            if (this.storageConnector.canConnectTo(relCoords.x, relCoords.y, relCoords.z, this.region)) {
                return i;
            }
        }
        // default value
        return null;
    }

    /**
     * @returns {boolean} need to update render
     */
    public checkConnection(): boolean {
        if (!this.data.connectionSide){
            this.updateConnectionSide();
            return false;
        }

        const { x, y, z } = World.getRelativeCoords(this.x, this.y, this.z, this.data.connectionSide);
        if (!this.storageConnector.canConnectTo(x, y, z, this.region)) {
            this.updateConnectionSide();
            return false;
        }

        this.storageConnector.connectionSide = this.data.connectionSide;
        this.itemEjector.connectionSide = this.data.connectionSide;
        return true;
    }
}