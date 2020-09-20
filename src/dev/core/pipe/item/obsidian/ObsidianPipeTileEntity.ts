/// <reference path="ObsidianPipeTargetConnector.ts" />
/// <reference path="ObsidianPipeItemEjector.ts" />
class ObsidianPipeTileEntity {
    constructor(protected pipeConnector: PipeConnector) { }

    // * it will be rewriten during runtime
    protected data: any = {}

    protected defaultValues: any = {// * it will be rewriten during runtime
        connectionSide: null,
        energy: 0
    }

    public x: number;
    public y: number;
    public z: number;

    private targetConnector: ObsidianPipeTargetConnector;
    private ejector: ObsidianPipeItemEjector;

    // !TileEntity event
    public init(): void {
        this.targetConnector = new ObsidianPipeTargetConnector(this, this.pipeConnector);
        this.ejector = new ObsidianPipeItemEjector(this);
        if (this.data.connectionSide) {
            this.updateConnection();
        }
    }

    // !TileEntity event
    public tick(): void {
        if (!(this.ejector && this.data.connectionSide)) return;
        this.ejector.collectEntities(this.maxEntitiesToCollect());
    }

    // !TileEntity event
    public destroy() {
        this.ejector = null;
    }

    // !EnergyNet event
    public energyReceive(type, amount, voltage): number {
        const storage = this.getMaxEnergyStored();
        const readyToReceive = Math.min(storage - amount, this.getMaxEnergyReceive());
        const received = Math.min(readyToReceive, amount);
        this.data.energy += received;
        return received;
    }

    private maxEntitiesToCollect(): number {
        return 64;
    }

    private maxEntitiesToPull(): number {
        return Math.floor(this.data.energy / 10);
    }

    public canConnectRedstoneEngine(): boolean {
        return true
    }

    public getMaxEnergyStored(): number {
        return 2560;
    }

    public getMaxEnergyReceive(): number {
        return 640;
    }

    public updateConnection(): void {
        this.data.connectionSide = this.targetConnector.getTargetSide();
        this.ejector.ConnectionSide = this.data.connectionSide;
    }
}