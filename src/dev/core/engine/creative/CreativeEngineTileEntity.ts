/// <reference path="../PowerMode.ts" />
class BCCreativeEngineTileEntity extends BCEngineTileEntity {
    public energyStage = EngineHeat.BLACK;

    constructor(protected texture: EngineTexture){
        super(texture);
        this.defaultValues.powerMode = PowerMode.M2;
        this.client.getEngineTexture = (stage: EngineHeat) => {
            return EngineTextures.creative;
        };
        this.client.getPistonSpeed = function(energyStage: EngineHeat) {
            // @ts-ignore
            return 0.02 * (this.powerModeIndex+1);
        }
        // @ts-ignore
        this.client._load = this.client.load;
        this.client.load = function(){
            this._load();
            this.powerModeIndex = 0;
            this.networkData.addOnDataChangedListener((networkData, isExternalChange) => {
                // @ts-ignore
                this.powerModeIndex = networkData.getInt("powerModeIndex");
            });
        }
    }

    public init(){
        super.init();
        this.syncPowerMode();
    }

    public click(id: number, count: number, data: number) {
        if(id != ItemID.bc_wrench) return false;

        if(Entity.getSneaking(Player.get())){
            this.data.energy = 0;
            let currentModeIndex = PowerModeOrder.indexOf(this.data.powerMode);
            this.data.powerMode = PowerModeOrder[++currentModeIndex % PowerModeOrder.length];
            this.syncPowerMode();
            Game.tipMessage(`Mode switched to ${this.data.powerMode}RF`);
            return true;
        }
        this.setOrientation(this.getConnectionSide(true));
        return false;
    }

    private syncPowerMode(): void {
        // @ts-ignore
        this.networkData.putInt("powerModeIndex", PowerModeOrder.indexOf(this.data.powerMode));
        // @ts-ignore
        this.networkData.sendChanges();
    }

    protected computeEnergyStage(): EngineHeat {
        return EngineHeat.BLACK;
    }

    public updateHeat(): void {}

    public getPistonSpeed(): number {
       return 0.02 * (PowerModeOrder.indexOf(this.data.powerMode) + 1);
    }

    public engineUpdate(): void {
        super.engineUpdate();

        if (this.isRedstonePowered) {
            this.addEnergy(this.getIdealOutput());
        }
    }

    public isBurning(): boolean {
        return this.isRedstonePowered;
    }

    public getMaxEnergy(): number {
        return this.getIdealOutput();
    }

    public getIdealOutput(): number {
        return this.data.powerMode;
    }
}