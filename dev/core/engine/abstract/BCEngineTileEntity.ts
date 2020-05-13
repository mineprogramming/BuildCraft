/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />

// test
IDRegistry.genBlockID("WIRE");
Block.createBlock("WIRE",
    [{name: "WIRE", texture: [["stone", 0]], inCreative: true}]);
RF.registerWire(BlockID["WIRE"]);
abstract class BCEngineTileEntity {
    public readonly MIN_HEAT = 20;
    public readonly IDEAL_HEAT = 100;
    public readonly MAX_HEAT = 250;

    public currentOutput = 0;
    public isRedstonePowered = false;
    public energyStage = EngineHeat.BLUE;

    protected progressPart = 0;

    private isPumping = false; // Used for SMP synch // ?WTF is SMP
    // How many ticks ago it gave out power, capped to 4.
    private lastTick = 0;

    constructor(public readonly maxHeat: number, protected texture: EngineTexture){}
    protected data = {// it will be rewriten during runtime
        meta: null, // this.orientation in PC version
        energy: 0, // this.energy in PC version
        heat: this.MIN_HEAT, // this.heat in PC version
        progress: 0,

        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }
    protected defaultValues = {
        meta: null, // this.orientation in PC version
        energy: 0, // this.energy in PC version
        heat: this.MIN_HEAT, // this.heat in PC version
        progress: 0,

        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }


    x: number; y: number; z: number;

    engineAnimation = null;
    get orientation(){
        if(!this.data.meta){
            this.data.meta = this.getConnectionSide();
        }
        return this.data.meta;
    }

    set orientation(value){
        this.data.meta = value;
        this.engineAnimation.connectionSide = value;
    }

    protected init(){
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.data.heatStage, this.texture);
        this.engineAnimation.connectionSide = this.orientation = this.getConnectionSide();
        this.checkRedstonePower();
    }

    protected tick(){
        if (this.lastTick < 4) this.lastTick++;

        // from PC
        this.checkRedstonePower();
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

        if (this.getEnergyStage() === EngineHeat.BLACK) {
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

        /* // old backup
        this.engineAnimation.update(this.data.power, this.data.heatStage);
        this.updatePower();

        this.data.heatStage = HeatOrder[Math.min(3, Math.max(0, this.getHeatStage() || 0))];

        this.setPower(this.getHeatStage() + .4);

        this.data.heat = Math.min(Math.max(this.data.heat, this.maxHeat), 100);
        if (this.engineAnimation.isReadyToGoBack()){
            this.engineAnimation.goBack();
            this.deployEnergyToTarget();
        }*/
    }

    getConnectionSide(){
        for(let i = 0; i < 6; i++){
            const relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            const block = World.getBlock(relCoords.x, relCoords.y, relCoords.z);
            if(EnergyTypeRegistry.isWire(block.id, "RF")){
                return i;
            }
        }
        return 2;
    }

    getHeatStage(){
        return Math.floor(this.data.heat / this.maxHeat * 3);
    }

    updatePower(){// LEGACY
        const change = .04;
        let add = this.data.targetPower - this.data.power;
        if (add > change){
            add = change;
        }
        if (add < -change){
            add = -change;
        }
        this.data.power += add;
    }

    setPower(power){
        this.data.targetPower = power;
    }

    deployEnergyToTarget(){
        // TODO deploy
    }

    public getEnergyStage(): EngineHeat {
        // if (!worldObj.isRemote) { //? client-server
            if (this.energyStage === EngineHeat.BLACK) return this.energyStage;


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

            // TODO integrate with energyNet
            /* if (tile instanceof IEngine) {
                IEngine engine = (IEngine) tile;
                int neededRF = engine.receiveEnergyFromEngine(orientation.getOpposite(), extracted, false);

                extractEnergy(neededRF, true);
            } else if (tile instanceof IEnergyReceiver) {
                IEnergyReceiver handler = (IEnergyReceiver) tile;
                int neededRF = handler.receiveEnergy(orientation.getOpposite(), extracted, false);

                extractEnergy(neededRF, true);
            }*/
        }
    }

    // ? why we need it? ask PC author about it. Maybe it should be overrided in future
    protected burn(): void {}

    private getPowerToExtract(): number {
        const tile = this.getEnergyProvider(this.orientation);

        // TODO integrate with energyNet
        /* if (tile instanceof IEngine) {
            IEngine engine = (IEngine) tile;

            int maxEnergy = engine.receiveEnergyFromEngine(orientation.getOpposite(), this.energy, true);
            return extractEnergy(maxEnergy, false);
        } else if (tile instanceof IEnergyReceiver) {
            IEnergyReceiver handler = (IEnergyReceiver) tile;

            int maxEnergy = handler.receiveEnergy(orientation.getOpposite(), this.energy, true);
            return extractEnergy(maxEnergy, false);
        }*/
        return 0;
    }

    // TODO make setter for setPumping()
    protected setPumping(isActive: boolean): void {
        if (this.isPumping == isActive) return;

        this.isPumping = isActive;
        this.lastTick = 0;
        // this.sendNetworkUpdate(); // ? is sendNetworkUpdate() for client-server?
    }

    public getEnergyProvider(orientation): TileEntity {
        const coords = World.getRelativeCoords(this.x, this.y, this.z, orientation);
        return World.getTileEntity(coords.x, coords.y, coords.z);
    }

    public checkRedstonePower(): void {
        // checkRedstonePower = false;
        // this.isRedstonePowered = worldObj.isBlockIndirectlyGettingPowered(pos) > 0;
        // TODO nake redstone powering
        this.isRedstonePowered = true;
    }

    public isActive(): boolean { // ? why we need it? Ask PC author... I dont know
        return true;
    }
    // TODO integrate to energyNet
    public isPoweredTile(tile: TileEntity, side: number): boolean {
        if(!tile) return false;

        /* if (tile instanceof IEngine) {
            return ((IEngine) tile).canReceiveFromEngine(side.getOpposite());
        } else if (tile instanceof IEnergyHandler || tile instanceof IEnergyReceiver) {
            return ((IEnergyConnection) tile).canConnectEnergy(side.getOpposite());
        }*/
        return false;
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
        } else {
            return EngineHeat.BLACK;
        }
    }

    public getPistonSpeed(): number {
        return Math.max(0.16 * this.getHeatLevel(), 0.01);
        // some code removed instead of pc version
    }

    public getHeatLevel(): number {
        return (this.data.heat - this.MIN_HEAT) / (this.MAX_HEAT - this.MIN_HEAT);
    }

    public overheat(): void {
        this.isPumping = false;
        // TODO make some explode!
    }

    protected engineUpdate(): void {
        // if (!isRedstonePowered) {// TODO make redstone check
            if (this.data.energy >= 10) {
                this.data.energy -= 10;
            } else if (this.data.energy < 10) {
                this.data.energy = 0;
            }
        // }
    }

    public updateHeat(): void {
        this.data.heat = ((this.MAX_HEAT - this.MIN_HEAT) * this.getEnergyLevel()) + this.MIN_HEAT;
    }

    // abstract
    public abstract getMaxEnergy(): number

    public getEnergyLevel(): number {
        return this.data.energy / this.getMaxEnergy();
    }

    destroy(){ // TileEntity event
        this.engineAnimation.destroy();
    }
}