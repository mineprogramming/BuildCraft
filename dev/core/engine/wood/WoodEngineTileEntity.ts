/// <reference path="../PowerMode.ts" />
/// <reference path="../EngineHeat.ts" />

class BCWoodEngineTileEntity extends BCEngineTileEntity {
    private hasSent: boolean = false;

    protected computeEnergyStage(): EngineHeat {
        const energyLevel = this.getEnergyLevel();
        if (energyLevel < 0.33) {
            return EngineHeat.BLUE;
        } else if (energyLevel < 0.66) {
            return EngineHeat.GREEN;
        } else if (energyLevel < 0.75) {
            return EngineHeat.ORANGE;
        }
        return EngineHeat.RED;
    }

    public getCurrentOutputLimit(): number {
        return 10;
    }

    public getPistonSpeed(): number {
        // Debug.m("getPistonSpeed()");
        // if (!worldObj.isRemote) { // ? is it again client-server?
            return Math.max(0.08 * this.getHeatLevel(), 0.01);
        // }

        /*switch (getEnergyStage()) {
            case GREEN:
                return 0.02F;
            case YELLOW:
                return 0.04F;
            case RED:
                return 0.08F;
            default:
                return 0.01F;
        }*/
    }

    public engineUpdate(): void {
        super.engineUpdate();

        if (this.isRedstonePowered) {
            // Debug.m("powered");
            if (World.getThreadTime() % 16 == 0) {
                // Debug.m("added");
                this.addEnergy(10);
            }
        }
    }

    public isBurning(): boolean {
        return this.isRedstonePowered;
    }

    public getMaxEnergy(): number {
        return 1000;
    }

    public getIdealOutput(): number {
        return 10;
    }

    public canConnectEnergy(from: number): boolean {
        return false;
    }

    public getEnergyStored(): number {
        return 0;
    }

    public getMaxEnergyStored(): number {
        return 0;
    }

    protected sendPower(): void {
        if (this.progressPart == 2 && !this.hasSent) {
            this.hasSent = true;

            const tile = this.getEnergyProvider(this.orientation);

            // TODO energyNet integration
            if (tile.canReceiveEnergy(this.getOppositeSide(this.orientation), "RF")) {
                super.sendPower();
            } else {
                this.data.energy = 0;
            }
        } else if (this.progressPart != 2) {
            this.hasSent = false;
        }
    }
}