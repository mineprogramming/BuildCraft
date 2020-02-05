var ENGINE_TYPE_CREATIVE = "Creative";

// Creative Engine
IDRegistry.genItemID("engineCreative");
Item.createItem("engineCreative", "Creative Engine", {name: "engine_creative"});


Item.registerUseFunction("engineCreative", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_CREATIVE);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineCreative0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineCreative1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineCreative2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 96}, {width: 512, height: 512}));


ENGINE_TYPE_DATA[ENGINE_TYPE_CREATIVE] = {
    defaultValues: {
        generation: 20
    },

    getGuiScreen: function(){
        return null;
    },

    getItemDrop: function(){
        return [[ItemID.engineCreative, 1, 0]];
    },

    engineTick: function(){
        if (this.data.redstone){
            this.setPower(0.4);
        }
        else{
            this.setPower(0);
            this.data.pistonDelay = 0;
        }
    },

    energyDeploy: function(params){
        return this.data.generation;
    },

    energyTick: function(type, src){
    },

    click: function(id, count, data){
        if (id == ItemID.bcWrench){
            this.data.generation *= 2;
            if(this.data.generation > 1280){
                this.data.generation = 20;
            }
            Game.message("Switched to " + this.data.generation + " RF/t limit");
        }
    },
};
