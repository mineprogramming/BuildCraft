/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />
/// <reference path="../interface/IHeatable.ts" />
/// <reference path="../interface/IEngine.ts" />
/**
 * !WARNING
 * this code adapted from JAVA source of PC mod
 * this structure created not by me
 * dont punch me pls
 */
abstract class BCEngineTileEntity implements TileEntity.TileEntityPrototype, IHeatable, IEngine {
    public readonly MIN_HEAT: number = 20;
    public readonly IDEAL_HEAT: number = 100;
    public readonly MAX_HEAT: number = 250;

    public currentOutput: number = 0;
    public isRedstonePowered: boolean = false;
    public energyStage = EngineHeat.BLUE;

    protected progressPart: number = 0;

    protected isPumping: boolean = false; // Used for SMP synch // ?WTF is SMP
    public checkOrientation: boolean = false;
    // How many ticks ago it gave out power, capped to 4.
    private lastTick: number = 0;

    constructor(protected texture: EngineTexture) { }
    protected data: any = {// * it will be rewriten during runtime
        meta: null, // * this.orientation in PC version
        energy: 0, // * this.energy in PC version
        heat: this.MIN_HEAT, // * this.heat in PC version
        progress: 0
    }
    public defaultValues: any = {
        meta: null, // * this.orientation in PC version //? maybe we can use it instead of save value?
        energy: 0, // * this.energy in PC version
        heat: this.MIN_HEAT, // * this.heat in PC version
        progress: 0
    }

    public x: number;
    public y: number;
    public z: number;

    public blockSource: BlockSource;
    public networkData: SyncedNetworkData;

    public readonly isEngine: boolean = true;

    public engineAnimation: EngineAnimation = null;

    /*
     ! I use old get set methods because Core Engine has special errors in runtime
     ! during I use new get set methods
     */

    public getOrientation(): number {
        return this.blockSource.getBlockData(this.x, this.y, this.z);
    }

    public setOrientation(value: number) {
        if (typeof (value) == "number") {
            const { x, y, z } = this;
            this.blockSource.setBlock(x, y, z, this.blockSource.getBlockId(x, y, z), value);
            this.updateClientOrientation();
        }
    }

    private updateClientOrientation() {
        this.networkData.putInt("orientation", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.networkData.sendChanges();
    }

    private setProgress(value: number) {
        this.data.progress = value;
        this.networkData.putFloat("progress", value);
    }

    private getProgress(): number {
        return this.data.progress;
    }

    private setProgressPart(value: number) {
        this.progressPart = value;
    }

    private getProgressPart(): number {
        return this.progressPart;
    }

    private setEnergyStage(value: EngineHeat) {
        this.energyStage = value;
        this.networkData.putInt("energyStageIndex", HeatOrder.indexOf(this.energyStage));
        this.networkData.sendChanges();
    }

    public getPumping(): boolean {
        return this.isPumping;
    }

    public setPumping(value: boolean) {
        if (this.isPumping == value) return;
        this.isPumping = value;
        this.lastTick = 0;
        this.networkData.putBoolean("isPumping", value);
        this.networkData.sendChanges();
    }

    public client = {
        orientation: null,
        energyStage: null,
        isPumping: false,
        progress: 0,
        progressPart: 0,

        engineAnimation: null,

        // !TileEntity event
        load() {
            this.orientation = this.networkData.getInt("orientation");
            this.energyStage = HeatOrder[this.networkData.getInt("energyStageIndex")];
            this.isPumping = this.networkData.getBoolean("isPumping");
            this.progress = this.networkData.getFloat("progress");

            this.engineAnimation = new EngineAnimation(this, this.getTrunkTexture(this.energyStage, this.progress), this.getEngineTexture());
            this.engineAnimation.ConnectionSide = this.orientation;
            this.networkData.addOnDataChangedListener((networkData, isExternalChange) => {
                this.orientation = networkData.getInt("orientation");
                this.energyStage = HeatOrder[networkData.getInt("energyStageIndex")];
                this.isPumping = this.networkData.getBoolean("isPumping");
                this.engineAnimation.ConnectionSide = this.orientation;
            });
        },

        // !TileEntity event
        unload() {
            this.engineAnimation.destroy();
        },

        // !TileEntity event
        tick() {
            if (!this.engineAnimation) return;
            if (this.progressPart != 0) {
                this.progress += this.getPistonSpeed(this.energyStage);
                if (this.progress > 1) {
                    this.progressPart = 0;
                    this.progress = 0;
                }
            }
            else if (this.isPumping) {
                this.progressPart = 1;
            }
            this.engineAnimation.update(this.progress, this.getTrunkTexture(this.energyStage, this.progress));
        },

        // ? please override in derived class
        getEngineTexture(stage: EngineHeat) {
            return null;
        },

        getTrunkTexture(stage: EngineHeat, progress: number): EngineHeat {
            return stage;
        },

        getPistonSpeed(energyStage: EngineHeat): number {
            switch (energyStage) {
                case EngineHeat.BLUE:
                    return 0.02;
                case EngineHeat.GREEN:
                    return 0.04;
                case EngineHeat.ORANGE:
                    return 0.08;
                case EngineHeat.RED:
                    return 0.16;
                default:
                    return 0;
            }
        }
    }

    // !TileEntity event
    public init() {
        this.checkOrientation = true;
    }

    // !TileEntity event
    public redstone(params) {
        this.isRedstonePowered = params.signal > 0;
    }

    // !TileEntity event
    public tick() {
        if (this.checkOrientation) this.updateConnectionSide();
        if (this.lastTick < 4) this.lastTick++;

        this.updateHeat();
        this.getEnergyStage();

        if (this.getEnergyStage() === EngineHeat.OVERHEAT) {
            this.data.energy = Math.max(this.data.energy - 50, 0);
            return;
        }

        this.engineUpdate();

        const tile = this.getEnergyProvider(this.getOrientation());

        if (this.getProgressPart() != 0) {
            this.setProgress(this.getProgress() + this.getPistonSpeed());
            if (this.getProgress() > 0.5 && this.getProgressPart() == 1) {
                this.setProgressPart(2);
            } else if (this.getProgress() >= 1) {
                this.setProgress(0);
                this.setProgressPart(0);
            }
        } else if (this.isRedstonePowered && this.isActive()) {
            if (this.isPoweredTile(tile, this.getOrientation())) {
                this.setProgressPart(1);
                this.setPumping(true);
                if (this.getPowerToExtract() > 0) {
                    this.setProgressPart(1);
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

    public click(id, count, data) {
        if (id != ItemID.bc_wrench) return false;
        if (this.getEnergyStage() == EngineHeat.OVERHEAT) {
            this.setEnergyStage(this.computeEnergyStage());
        }
        this.setOrientation(this.getConnectionSide(true));
        return true;
    }

    public isActive(): boolean { // ? why we need it? Ask PC author... I dont know
        return true;
    }

    // ! @MineExplorer PLEASE make EnergyTileRegistry BlockSource support
    // TODO move to blockSource getConnectionSide
    /** @param findNext - use true value if you want to rerotate engine like a wrench */
    protected getConnectionSide(findNext: boolean = false) {
        // * In common situation ends when i gets max in 5 index
        // * But if fhis function calling by wrench index can go beyound
        // * I think this code is poor, but maybe i fix it in future
        const orientation = this.getOrientation();
        for (let t = 0; t < 12; t++) {
            const i = t % 6;
            if (findNext) {
                if (orientation == t) findNext = false;
                continue;
            }
            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            // * ?. is new ESNext feature. Its amazing!
            const energyTypes = EnergyTileRegistry.accessMachineAtCoords(relCoords.x, relCoords.y, relCoords.z)?.__energyTypes;
            if (energyTypes?.RF) return i;
        }
        return null;
    }

    public updateConnectionSide(): void {
        this.checkOrientation = false;
        const orientation = this.getOrientation();
        if (!this.isPoweredTile(this.getEnergyProvider(orientation), orientation)) {
            const side = this.getConnectionSide();
            if (typeof (side) == "number") {
                this.setOrientation(side);
            } else this.updateClientOrientation();
        } else this.updateClientOrientation();
    }

    // ! @MineExplorer PLEASE make EnergyTileRegistry BlockSource support
    // TODO move to blockSource getEnergyProvider
    public getEnergyProvider(orientation: number): any {
        const coords = World.getRelativeCoords(this.x, this.y, this.z, orientation);
        return EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
    }

    protected sendPower(): void {
        const tile = this.getEnergyProvider(this.getOrientation());
        if (this.isPoweredTile(tile, this.getOrientation())) {
            const extracted = this.getPowerToExtract();
            if (extracted <= 0) {
                this.setPumping(false);
                return;
            }

            this.setPumping(true);
            const oppositeSide = World.getInverseBlockSide(this.getOrientation());

            if (tile.isEngine) {
                const neededRF = tile.receiveEnergyFromEngine(oppositeSide, extracted, false);
                this.extractEnergy(neededRF, true);
            } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
                const neededRF = tile.energyReceive("RF", extracted, this.data.energy);
                this.extractEnergy(neededRF, true);
            }
        }
    }

    private getPowerToExtract(): number {
        const tile = this.getEnergyProvider(this.getOrientation());
        if (!tile) return 0;

        const oppositeSide = World.getInverseBlockSide(this.getOrientation());

        const canExtract = Math.min(this.getCurrentOutputLimit(), this.data.energy);

        if (tile.isEngine) {
            const maxEnergy = tile.receiveEnergyFromEngine(oppositeSide, canExtract, true);
            return this.extractEnergy(maxEnergy, false);
        } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            const maxEnergy = Math.min(this.getCurrentOutputLimit(), tile.getMaxEnergyStored() - tile.data.energy);
            return this.extractEnergy(maxEnergy, false);
        }
        return 0;
    }

    public isPoweredTile(tile: any, side: number): boolean {
        if (!tile) return false;
        const oppositeSide = World.getInverseBlockSide(this.getOrientation());

        if (tile.isEngine) {
            return tile.canReceiveFromEngine(oppositeSide);
        } else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            // return ((IEnergyConnection) tile).canConnectEnergy(side.getOpposite()); // ? is next line correct
            return tile.canReceiveEnergy(oppositeSide, "RF");
        }
        return false;
    }

    public getPistonSpeed(): number {
        return Math.max(0.16 * this.getHeatLevel(), 0.01);
    }

    public getEnergyStage(): EngineHeat {
        if (this.energyStage == EngineHeat.OVERHEAT) return this.energyStage;

        const newStage = this.computeEnergyStage();
        if (this.energyStage !== newStage) {
            this.setEnergyStage(newStage);
            if (newStage == EngineHeat.OVERHEAT) this.overheat();
        }
        return this.energyStage;
    }

    public addEnergy(addition: number): void {
        if (this.getEnergyStage() == EngineHeat.OVERHEAT) return;

        this.data.energy += addition;
        if (this.data.energy > this.getMaxEnergy()) {
            this.data.energy = this.getMaxEnergy();
        }
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
        return EngineHeat.OVERHEAT;
    }

    public getEnergyStored(): number {
        return this.data.energy;
    }

    public getMaxEnergyStored(): number {
        return this.getMaxEnergy();
    }

    public canConnectEnergy(from: number): boolean {
        return from == this.getOrientation();
    }

    public getEnergyLevel(): number {
        return this.data.energy / this.getMaxEnergy();
    }

    public extractEnergy(energyMax: number, doExtract: boolean): number {
        const max = Math.min(energyMax, this.getCurrentOutputLimit());

        let extracted;
        const energy = this.data.energy;

        if (energy >= max) {
            extracted = max;
            if (doExtract) {
                this.data.energy -= max;
            }
        } else {
            extracted = energy;
            if (doExtract) {
                this.data.energy = 0;
            }
        }

        return extracted;
    }

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

    public getHeatLevel(): number {
        return (this.data.heat - this.MIN_HEAT) / (this.MAX_HEAT - this.MIN_HEAT);
    }

    public updateHeat(): void {
        this.data.heat = ((this.MAX_HEAT - this.MIN_HEAT) * this.getEnergyLevel()) + this.MIN_HEAT;
    }

    public overheat(): void {
        this.isPumping = false;
        this.blockSource.explode(this.x, this.y, this.z, 3, true);
    }

    // ? why we need it? ask PC author about it. Maybe it should be overrided in future
    protected burn(): void { }

    // abstract methods
    public abstract isBurning(): boolean

    public abstract getIdealOutput(): number

    public abstract getMaxEnergy(): number

    // IEngine
    public canReceiveFromEngine(side: number): boolean {
        return side == World.getInverseBlockSide(this.getOrientation());
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