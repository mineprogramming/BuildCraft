class BCEngineTileEntity {
    constructor(public maxHeat, public type){}//all members should be public
    protected data = {// it will be rewriten during runtime
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }
    protected defaultValues = {
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }

    engineAnimation = null

    protected init(){
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.type);
    }

    protected tick(){
        this.engineAnimation.update(this.data.power);
        this.updatePower();

        this.data.heatStage = HeatOrder[Math.min(3, Math.max(0, this.getHeatStage() || 0))];

        this.setPower(this.getHeatStage() + .4);

        this.data.heat = Math.min(Math.max(this.data.heat, this.maxHeat), 100);
        if (this.engineAnimation.isReadyToDeployEnergy()){
            this.engineAnimation.goBack();
            this.deployEnergyToTarget();
        }
    }

    getHeatStage(){
        var index = Math.floor(this.data.heat / this.maxHeat * 3);
        return index;
    }

    updatePower(){//LEGACY
        var change = .04;
        var add = this.data.targetPower - this.data.power;
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
        //TODO deploy
    }
}