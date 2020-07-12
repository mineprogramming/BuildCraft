/// <reference path="../core/energy.ts" />

IDRegistry.genBlockID("Capacitor");
Block.createBlock("Capacitor",
    [{name: "Capacitor", texture: [["stone", 0]], inCreative: true}]);
TileEntity.registerPrototype(BlockID["Capacitor"], {
    defaultValues: {
        progress: 0
    },
    energyReceive(type, amount, voltage) {
        this.data.progress += amount;
        return amount;
    },
    tick(){
        if(this.data.progress >= 100){
            this.data.progress -= 100;
            World.drop(this.x, this.y + 1, this.z, 264, 1, 0);
        }
    },
    canConnectRedstoneEngine(){
        return true;
    }
});
EnergyTileRegistry.addEnergyTypeForId(BlockID.Capacitor, RF);
ICRender.getGroup("ItemMachine").add(BlockID.Capacitor, 0);