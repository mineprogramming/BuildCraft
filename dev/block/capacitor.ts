/// <reference path="../core/energy.ts" />

IDRegistry.genBlockID("Capacitor");
Block.createBlock("Capacitor",
    [{name: "Capacitor", texture: [["stone", 0]], inCreative: true}]);
TileEntity.registerPrototype(BlockID["Capacitor"], {
    defaultValues: {
        progress: 0
    },
    energyReceive: function(type, amount, voltage) {
        this.data.progress += amount;
        //Debug.m(`energy received ${amount}`);
        return amount;
    },
    tick: function(){
        if(this.data.progress >= 10000){
            this.data.progress -= 10000;
            World.drop(this.x, this.y +1, this.z, 264, 1, 0);
        }
    }
})
EnergyTileRegistry.addEnergyTypeForId(BlockID["Capacitor"], RF);