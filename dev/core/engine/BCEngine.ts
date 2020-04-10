/// <reference path="components/EngineBlock.ts" />
/// <reference path="components/EngineItem.ts" />
/// <reference path="components/EngineAnimation.ts" />
/// <reference path="EngineHeat.ts" />
/// <reference path="EngineType.ts" />
/// <reference path="../Coords.ts" />
class BCEngineTileEntity {
    constructor(public maxHeat, public type){}//all members should be public
    data = {// it will be rewriten during runtime
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }
    defaultValues = {
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0,
        heatStage: EngineHeat.BLUE
    }

    engineAnimation = null

    init(){
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.type);
    }

    tick(){
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
abstract class BCEngine {
    protected block: EngineBlock;
    protected item: EngineItem;

    protected maxHeat: number = 100;

    constructor(public readonly type: EngineType){
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);

        TileEntity.registerPrototype(this.block.id, new BCEngineTileEntity(this.maxHeat, this.type));

        let self = this;
        Item.registerUseFunction(this.item.stringId, function(coords, item, block){
            Debug.m(coords.relative);
            self.setBlock(coords.relative);
        });
    }

    private setBlock(coords: IBlockPos): void {
        World.setBlock(coords.x, coords.y, coords.z, this.block.id, 0);
        World.addTileEntity(coords.x, coords.y, coords.z);
    }
}