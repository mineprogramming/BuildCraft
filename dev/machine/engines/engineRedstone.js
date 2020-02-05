var ENGINE_TYPE_WOOD = "Wood";

// Redstone Engine
IDRegistry.genItemID("engineWooden");
Item.createItem("engineWooden", "Redstone Engine", {name: "engine_wooden"});

Recipes.addShaped({id: ItemID.engineWooden, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 5, -1, 'b', 20, -1, 'o', ItemID.gearWood, 0]);


Item.registerUseFunction("engineWooden", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_WOOD);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineWood0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 0}, {width: 512, height: 512}));


ENGINE_TYPE_DATA[ENGINE_TYPE_WOOD] = {
    getGuiScreen: function(){
        return null;
    },

    getItemDrop: function(){
        return [[ItemID.engineWooden, 1, 0]];
    },

    getHeatStage: function(){
        var MAX_HEAT = 100;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        return index;
    },

    engineTick: function(){
        var MAX_HEAT = 100;
        if (this.data.redstone){
            this.setPower(this.getHeatStage() + .4);
            if (this.isPushingForward()){
                this.data.heat += .2;
            }
            else{
                this.data.heat -= .1;
            }
        }
        else{
            this.setPower(0);
            this.data.heat -= .1;
        }
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
    },

    energyDeploy: function(params){
        if (params.directDeploy){
            return 1;
        }
        return 0;
    }
};