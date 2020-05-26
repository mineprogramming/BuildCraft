/// <reference path="../PowerMode.ts" />
class BCCreativeEngineTileEntity extends BCEngineTileEntity {
    //  private PowerMode powerMode = PowerMode.M2; // ! its from PC
    private powerMode: PowerMode = PowerMode.M2;

    protected computeEnergyStage(): EngineHeat {
        return EngineHeat.BLACK;
    }

    public updateHeat(): void {}

    public getPistonSpeed(): number {
       // return 0.02 * (powerMode.ordinal() + 1); // ORIGINAL
       return 0.02 * (PowerModeOrder[this.powerMode] + 1); // Maybe shit...
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
        return this.powerMode;
    }
}