/// <reference path="../PowerMode.ts" />
class BCCreativeEngineTileEntity extends BCEngineTileEntity {
    //  private PowerMode powerMode = PowerMode.M2; // ! its from PC
    public energyStage = EngineHeat.BLACK;

    constructor(protected texture: EngineTexture){
        super(texture);
        this.defaultValues.powerMode = PowerMode.M2;
    }

    // !TileEntity event
    public init(){
        super.init();
        Debug.m(Object.keys(this));
    }

    public click(id: number, count: number, data: number) {
        if(id != ItemID.bcWrench) return false;

        if(Entity.getSneaking(Player.get())){
            this.data.energy = 0;
            Debug.m(`current mode ${this.data.powerMode}`);
            let currentModeIndex = PowerModeOrder.indexOf(this.data.powerMode);
            this.data.powerMode = PowerModeOrder[++currentModeIndex % PowerModeOrder.length];
            Debug.m(`new mode ${this.data.powerMode} and speed ${this.getPistonSpeed()}`);
            return true;
        }
        this.engineAnimation.connectionSide = this.orientation = this.getConnectionSide(true);
        Debug.m("not sneaking");
        Debug.m(`${this.data.progress}`);
        return false;
    }

    protected computeEnergyStage(): EngineHeat {
        return EngineHeat.BLACK;
    }

    public updateHeat(): void {}

    public getPistonSpeed(): number {
       // return 0.02 * (powerMode.ordinal() + 1); // ORIGINAL
       return 0.02 * (PowerModeOrder.indexOf(this.data.powerMode) + 1); // Maybe shit...
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
        // return powerMode.maxPower; //ORIGINAL
        return this.data.powerMode;
    }
}