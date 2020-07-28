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

    private ticksSincePull: number = 0;

    private changeOrientation(value: number) {
        this.data.connectionSide = value;
        this.storageConnector.connectionSide = value;
        this.itemEjector.connectionSide = value;
    }

    // !TileEntity event
    public tick(): void {
        /*
        ? Oh, it looks like a client-server
        if (container.getWorld().isRemote) {
            return;
        }
        */
        this.ticksSincePull++;

        if (this.shouldTick()) {
            const maxExtractable = this.maxExtractable();
            const targets = this.itemEjector.getExtractionTargetsCount(maxExtractable);
            // ! DEBUG VALUE
            const maxPipeStack = 16;

            if (targets > 0) {
                Debug.m(`extracted items ${ targets}`);
                // ! EXTRACT
                // this.itemEjector.extractItems(maxExtractable());
            }

            this.data.energy = 0;
            this.ticksSincePull = 0;
            // speedMultiplier = 1.0F;
        }
    }

    // !TileEntity event
    public init(): void {
        this.storageConnector = new WoodenPipeStorageConnector(this, this.renderer, this.texture);
        this.itemEjector = new WoodenPipeItemEjector(this.x, this.y, this.z);
        this.updateConnectionSide();
    }

    // !TileEntity event
    public destroy() {
        this.storageConnector.destroy();
    }

    // !TileEntity event
    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;

        this.updateConnectionSide(true);
        Debug.m(this.itemEjector.getExtractionTargetsCount(this.maxExtractable()));
        return true;
    }

    // !EnergyNet event
    public energyReceive(type, amount, voltage): number {
        const received = Math.min(amount, this.getMaxEnergyReceive());
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

                if (this.data.energy >= stackSize * 10) {
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

            if (this.storageConnector.canConnectTo(relCoords.x, relCoords.y, relCoords.z, i, 1)) {
                return i;
            }
        }
        // default value
        return null;
    }
}