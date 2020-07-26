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
        alert(`side updated ${value}`);
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
            /* if (transport.getNumberOfStacks() < PipeTransportItems.MAX_PIPE_STACKS) {
                extractItems(maxExtractable());
            }
            */
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
        Debug.m(this.data.connectionSide);
        var relCoords = World.getRelativeCoords(this.x, this.y, this.z, this.data.connectionSide);
        var container = World.getContainer(relCoords.x, relCoords.y, relCoords.z);
        // Debug.m(`type ${typeof()}`)
        // this.itemEjector.getNumberOfStacks();
        // Debug.m(this.x);
        return true;
    }

    // !EnergyNet event
    public energyReceive(type, amount, voltage): number {
        const received = Math.min(amount, this.getMaxEnergyReceive());
        this.data.energy += received;
        Debug.m(`energy getted ${received}`);
        return received;
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
                /* EnumFacing side = EnumFacing.getFront(meta);
                TileEntity tile = container.getTile(side);
                IItemHandler handler = InvUtils.getItemHandler(tile, side.getOpposite());

                if (handler != null) {
                    int stackSize = 0;
                    int maxItems = maxExtractable();
                    int[] extracted = getExtractionTargets(handler, maxItems);
                    if (extracted != null) {
                        for (int s : extracted) {
                            stackSize += handler.getStackInSlot(s).stackSize;
                        }
                    }

                    stackSize = Math.min(maxItems, stackSize);

                    if (battery.getEnergyStored() >= stackSize * 10) {
                        return true;
                    }
                }*/
            }
        }
        return this.ticksSincePull >= 16 && this.data.energy >= 10;
    }

    private maxExtractable(): number {
        return Math.floor(this.data.energy / 10);
    }

    public updateConnectionSide(findNext: boolean = false): void {
        Debug.m(this.data.connectionSide);
        Debug.m(`update connection from ${this.data.connectionSide}  ${findNext}`);
        this.changeOrientation(this.getConnectionSide(findNext));
        Debug.m(`new ${this.data.connectionSide}`);
    }

    /** @param findNext - use true value if you want to rerotate pipe like a wrench */
    protected getConnectionSide(findNext: boolean = false): number | null {
        // * In common situation ends when i gets max in 5 index
        // * But if fhis function calling by wrench index can go beyound
        // * I think this code is poor, but maybe i fix it in future
        for (let t = 0; t < 12; t++) {
            const i = t % 6;

            if (findNext) {
                if (this.data.connectionSide == t) findNext = false;
                continue;
            }

            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            if (this.storageConnector.canConnectTo(relCoords.x, relCoords.y, relCoords.z, i, 1)) return i;
        }
        // default value
        return null;
    }
}