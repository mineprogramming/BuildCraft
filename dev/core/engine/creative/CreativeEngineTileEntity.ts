class BCCreativeEngineTileEntity extends BCEngineTileEntity {
    //  private PowerMode powerMode = PowerMode.M2; // ! its from PC
    protected computeEnergyStage(): EngineHeat {
        return EngineHeat.BLACK;
    }

    public updateHeat(): void {}

    public getPistonSpeed(): number {
       // return 0.02 * (powerMode.ordinal() + 1); // ORIGINAL
       return 0.02 * 1; // Maybe shit...
    }

    public engineUpdate(): void {
        super.engineUpdate();

        if (this.isRedstonePowered) {
            this.data.energy += this.getIdealOutput();
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
        return 20;
    }
}