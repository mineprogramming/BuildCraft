/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />
/// <reference path="../interface/IHeatable.ts" />
/// <reference path="../interface/IEngine.ts" />
abstract class BCEngineTileEntity implements IHeatable, IEngine {
    public readonly MIN_HEAT: number = 20;
    public readonly IDEAL_HEAT: number = 100;
    public readonly MAX_HEAT: number = 250;

    public currentOutput: number = 0;
    public isRedstonePowered: boolean = false;
    public energyStage = EngineHeat.BLUE;

    protected progressPart: number = 0;

    private isPumping: boolean = false; // Used for SMP synch // ?WTF is SMP
    // How many ticks ago it gave out power, capped to 4.
    private lastTick: number = 0;

    // TODO remove constructor
    constructor(protected texture: EngineTexture){}
    protected data = {// it will be rewriten during runtime
        meta: null, // this.orientation in PC version
        energy: 0, // this.energy in PC version
        heat: this.MIN_HEAT, // this.heat in PC version
        progress: 0
    }
    protected defaultValues = {
        meta: null, // this.orientation in PC version //? maybe we can use it instead of save value?
        energy: 0, // this.energy in PC version
        heat: this.MIN_HEAT, // this.heat in PC version
        progress: 0
    }

    public x: number;
    public y: number;
    public z: number;

    public readonly isEngine: boolean = true;

    public engineAnimation: EngineAnimation = null;
    get orientation(){
        if(!this.data.meta){
            this.data.meta = this.getConnectionSide();
        }
        return this.data.meta;
    }

    set orientation(value: number){
        this.data.meta = value;
        this.engineAnimation.connectionSide = value;
    }

    public init(){ // !TileEntity event
        this.engineAnimation = new EngineAnimation(this, this.getEnergyStage(), this.texture);
        this.engineAnimation.connectionSide = this.orientation = this.getConnectionSide();
    }

    public redstone(params){
        this.isRedstonePowered = params.signal > 0;
    }

    protected tick(){
        if (this.lastTick < 4) this.lastTick++;

        this.engineAnimation.update(this.data.progress, this.getEnergyStage());

        // from PC
        /* if (worldObj.isRemote) { // ? is it for client-server?
            if (this.progressPart != 0) {
                this.data.progress += this.getPistonSpeed();

                if (this.data.progress > 1) {
                    this.progressPart = 0;
                    this.data.progress = 0;
                }
            } else if (this.isPumping) {
                this.progressPart = 1;
            }

            return;
        }*/

        this.updateHeat();

        if (this.getEnergyStage() === EngineHeat.BLACK){
            this.data.energy = Math.max(this.data.energy - 50, 0);
            return;
        }

        this.engineUpdate();

        const tile = this.getEnergyProvider(this.orientation);

        if (this.progressPart != 0) {
            this.data.progress += this.getPistonSpeed();
            if (this.data.progress > 0.5 && this.progressPart == 1) {
                this.progressPart = 2;
            } else if (this.data.progress >= 1) {
                this.data.progress = 0;
                this.progressPart = 0;
            }
        } else if (this.isRedstonePowered && this.isActive()) {
            if (this.isPoweredTile(tile, this.orientation)) {
                this.progressPart = 1;
                this.setPumping(true);
                if (this.getPowerToExtract() > 0) {
                    this.progressPart = 1;
                    this.setPumping(true);
                } else {
                    this.setPumping(false);
                }
            } else {
                this.setPumping(false);
            }
        } else {
            this.setPumping(false);
        }

        this.burn();

        if (!this.isRedstonePowered) {
            this.currentOutput = 0;
        } else if (this.isRedstonePowered && this.isActive()) {
            this.sendPower();
        }
    }

    protected getConnectionSide(){
        for(let i = 0; i < 6; i++){
            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            const block = World.getBlock(relCoords.x, relCoords.y, relCoords.z);
            // TODO make it for only RF
            const machine = EnergyTileRegistry.accessMachineAtCoords(relCoords.x, relCoords.y, relCoords.z);
            if(machine){
                return i;
            }
        }
        return 2;
    }

    public getEnergyStage(): EngineHeat {
        // if (!worldObj.isRemote) { //? client-server
            if (this.energyStage == EngineHeat.BLACK) return this.energyStage;

            const newStage = this.computeEnergyStage();
            if (this.energyStage !== newStage) {
                this.energyStage = newStage;
                if (this.energyStage === EngineHeat.BLACK) this.overheat();
                // sendNetworkUpdate(); //? client-server
            }
        // }
        return this.energyStage;
    }

    protected sendPower(): void {
        const tile = this.getEnergyProvider(this.orientation);
        if (this.isPoweredTile(tile, this.orientation)) {
            const extracted = this.getPowerToExtract();
            if (extracted <= 0) {
                this.setPumping(false);
                return;
            }

            this.setPumping(true);

            const oppositeSide = this.getOppositeSide(this.orientation);

            if (tile.isEngine) {
                const neededRF = tile.receiveEnergyFromEngine(oppositeSide, extracted, false);
                this.extractEnergy(neededRF, true);
            } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
                const neededRF = tile.energyReceive("RF", this.data.energy, this.data.energy);
                this.extractEnergy(neededRF, true);
            }
        }
    }

    // ? why we need it? ask PC author about it. Maybe it should be overrided in future
    protected burn(): void {}

    private getPowerToExtract(): number {
        const tile = this.getEnergyProvider(this.orientation);
        if(!tile) return 0;

        const oppositeSide = this.getOppositeSide(this.orientation);

        if (tile.isEngine) {
            const maxEnergy = tile.receiveEnergyFromEngine(oppositeSide, this.data.energy, true);
            return this.extractEnergy(maxEnergy, false);
        } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            const maxEnergy = tile.energyReceive("RF", this.data.energy, this.data.energy);
            return this.extractEnergy(maxEnergy, false);
        }
        return 0;
    }

    // TODO make setter for setPumping()
    protected setPumping(isActive: boolean): void {
        if (this.isPumping == isActive) return;

        this.isPumping = isActive;
        this.lastTick = 0;
        // this.sendNetworkUpdate(); // ? is sendNetworkUpdate() for client-server?
    }

    public getEnergyProvider(orientation: number): any {
        const coords = World.getRelativeCoords(this.x, this.y, this.z, orientation);
        return EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
    }

    public isActive(): boolean { // ? why we need it? Ask PC author... I dont know
        return true;
    }

    public isPoweredTile(tile: any, side: number): boolean {
        if(!tile) return false;
        const oppositeSide = this.getOppositeSide(this.orientation);

        if (tile.isEngine) {
            return tile.canReceiveFromEngine(oppositeSide);
        } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            // return ((IEnergyConnection) tile).canConnectEnergy(side.getOpposite()); // ? is next line correct
            return tile.canReceiveEnergy(oppositeSide, "RF");
        }
        return false;
    }

    public getHeatLevel(): number {
        return (this.data.heat - this.MIN_HEAT) / (this.MAX_HEAT - this.MIN_HEAT);
    }

    protected computeEnergyStage(): EngineHeat {
        const energyLevel = this.getHeatLevel();
        if (energyLevel < 0.25) {
            return EngineHeat.BLUE;
        } else if (energyLevel < 0.5) {
            return EngineHeat.GREEN;
        } else if (energyLevel < 0.75) {
            return EngineHeat.ORANGE;
        } else if (energyLevel < 1) {
            return EngineHeat.RED;
        }
        return EngineHeat.BLACK;
    }

    public getPistonSpeed(): number {
        return Math.max(0.16 * this.getHeatLevel(), 0.01);
        // ? for client-server
        /*if (!worldObj.isRemote) {
            return Math.max(0.16f * getHeatLevel(), 0.01f);
        }
        switch (getEnergyStage()) {
            case BLUE:
                return 0.02F;
            case GREEN:
                return 0.04F;
            case YELLOW:
                return 0.08F;
            case RED:
                return 0.16F;
            default:
                return 0;
        }*/
    }

    public addEnergy(addition: number): void {
        if (this.getEnergyStage() == EngineHeat.BLACK) return;

        this.data.energy += addition;
        if (this.data.energy > this.getMaxEnergy()) {
            this.data.energy = this.getMaxEnergy();
        }
    }

    public getEnergyStored(): number {
        return this.data.energy;
    }

    public getMaxEnergyStored(): number {
        return this.getMaxEnergy();
    }

    public extractEnergy(energyMax: number, doExtract: boolean): number {
        const max = Math.min(energyMax, this.getCurrentOutputLimit());

        let extracted;
        let energy = this.data.energy;

        if (energy >= max) {
            extracted = max;
            if (doExtract) {
                energy -= max;
            }
        } else {
            extracted = energy;
            if (doExtract) {
                energy = 0;
            }
        }

        return extracted;
    }
    public canConnectEnergy(from: number): boolean {
        return from == this.orientation;
    }

    public overheat(): void {
        this.isPumping = false;
        // TODO make some explode!
    }

    public abstract isBurning(): boolean

    public abstract getIdealOutput(): number

    public getCurrentOutputLimit(): number {
        return Number.MAX_VALUE;
    }

    protected engineUpdate(): void {
        if (!this.isRedstonePowered) {
            if (this.data.energy >= 10) {
                this.data.energy -= 10;
            } else if (this.data.energy < 10) {
                this.data.energy = 0;
            }
        }
    }

    public updateHeat(): void {
        this.data.heat = ((this.MAX_HEAT - this.MIN_HEAT) * this.getEnergyLevel()) + this.MIN_HEAT;
    }

    public abstract getMaxEnergy(): number

    public getEnergyLevel(): number {
        return this.data.energy / this.getMaxEnergy();
    }

    public destroy(){ // !TileEntity event
        this.engineAnimation.destroy();
    }

    protected getOppositeSide(side: number): number {
        switch(side){
            case 0:
                return 1;
            case 1:
                return 0;
            case 2:
                return 3;
            case 3:
                return 2;
            case 4:
                return 5;
            case 5:
                return 4;
        }
    }

    // IEngine
    public canReceiveFromEngine(side: number): boolean {
        return side == this.getOppositeSide(this.orientation);
    }

    public receiveEnergyFromEngine(side: number, amount: number, simulate: boolean): number {
        if (this.canReceiveFromEngine(side)) {
            const targetEnergy = Math.min(this.getMaxEnergy() - this.data.energy, amount);
            if (!simulate) {
                this.data.energy += targetEnergy;
            }
            return targetEnergy;
        }
        return 0;
    }

    // IHeatable
    public getMinHeatValue(): number {
        return this.MIN_HEAT;
    }
    public getIdealHeatValue(): number {
        return this.IDEAL_HEAT;
    }

    public getMaxHeatValue(): number {
        return this.MAX_HEAT;
    }

    public getCurrentHeatValue(): number {
        return this.data.heat;
    }
}