/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />

// test
IDRegistry.genBlockID("WIRE");
Block.createBlock("WIRE",
    [{name: "WIRE", texture: [["stone", 0]], inCreative: true}]);
RF.registerWire(BlockID["WIRE"]);
class BCEngineTileEntity {
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
    get meta(){
        if(!this.data.meta){
            this.data.meta = this.getConnectionSide();
        }
        return this.data.meta;
    }

    set meta(value){
        this.data.meta = value;
        this.engineAnimation.connectionSide = value;
    }

    protected init(){
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.data.heatStage, this.texture);
        this.engineAnimation.connectionSide = this.meta = this.getConnectionSide();
    }

    protected tick(){
        if (this.lastTick < 4)this.lastTick++;

        /* if (checkRedstonePower) { // from PC
            checkRedstonePower();
        }
        if (worldObj.isRemote) { // ? is it for client-server?
            if (progressPart != 0) {
                progress += getPistonSpeed();

                if (progress > 1) {
                    progressPart = 0;
                    progress = 0;
                }
            } else if (this.isPumping) {
                progressPart = 1;
            }

            return;
        }*/

        this.updateHeat();

        if (this.getEnergyStage() === EngineHeat.BLACK) {
            this.data.energy = Math.max(this.data.energy - 50, 0);
            return;
        }

        this.engineUpdate();

        /* Object tile = getEnergyProvider(orientation);

        if (progressPart != 0) {
            progress += getPistonSpeed();

            if (progress > 0.5 && progressPart == 1) {
                progressPart = 2;
            } else if (progress >= 1) {
                progress = 0;
                progressPart = 0;
            }
        } else if (isRedstonePowered && isActive()) {
            if (isPoweredTile(tile, orientation)) {
                progressPart = 1;
                setPumping(true);
                if (getPowerToExtract() > 0) {
                    progressPart = 1;
                    setPumping(true);
                } else {
                    setPumping(false);
                }
            } else {
                setPumping(false);
            }
        } else {
            setPumping(false);
        }

        burn();

        if (!isRedstonePowered) {
            currentOutput = 0;
        } else if (isRedstonePowered && isActive()) {
            sendPower();
        } */



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
    public getMaxEnergy(): number { return null}

    public getEnergyLevel(): number {
        return this.data.energy / this.getMaxEnergy();
    }

    destroy(){ // TileEntity event
        this.engineAnimation.destroy();
    }
}