var ENGINE_TYPE_ELECTRIC = "Electric";

// Electric Engine
IDRegistry.genItemID("engineElectric");
Item.createItem("engineElectric", "Electric Engine", {name: "engine_electric"}, {isTech: true});

Callback.addCallback("BC-ICore", function(ICore){
    Recipes.addShaped({id: ItemID.engineElectric, count: 1, data: 0}, [
        "aaa",
        " b ",
        "oxo"
    ], ['x', 33, -1, 'a', ItemID.ingotTin, 0, 'b', 20, -1, 'o', ItemID.gearTin, 0]);
});


Item.registerUseFunction("engineElectric", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_ELECTRIC);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineElectric0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineElectric1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineElectric2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 96}, {width: 512, height: 512}));


var guiElectricEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Electric Engine"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 400, y: 30, bitmap: "electric_scale_background", scale: 10.0 / 3.0}
    ],
    
    elements: {
        "energyScale": {type: "scale", x: 400, y: 30, direction: 1, value: 0.5, bitmap: "electric_scale", scale: 10.0 / 3.0},
        "textInfo1": {type: "text", x: 535, y: 150, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 535, y: 200, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});


ENGINE_TYPE_DATA[ENGINE_TYPE_ELECTRIC] = {
    defaultValues: {
        energyStored: 0,
        pistonDelay: 0,
    },
    
    getGuiScreen: function(){
        return guiElectricEngine;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineElectric, 1, 0]];
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 200;
        var index = parseInt(this.data.heat / MAX_HEAT * 3.5);
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 200;
        if (this.data.redstone && this.data.energyStored > 0){
            this.setPower(this.getHeatStage() + .4);
            if (this.isPushingForward()){
                this.data.heat += .2;
            }
            else{
                this.data.heat -= .1;
            }
            this.data.pistonDelay ++;
        }
        else{
            this.setPower(0);
            this.data.heat -= .1;
            this.data.pistonDelay = 0;
        }
        
        this.container.setScale("energyScale", this.data.energyStored / 50);
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C   " + (this.data.redstone ? parseInt(this.data.energyInfo * 100 || 0) / 100 + " MJ/t": ""));
        this.container.setText("textInfo2", (this.data.redstone && this.data.energyStored > 0 ? "ON" : "OFF") + (this.data.energyStored > 0 ? "" : ": NO ENERGY"));
        // this.container.setTextColor("textInfo2", this.data.redstone && this.data.energyStored > 0 ? android.graphics.Color.GREEN : android.graphics.Color.RED);
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
    },
    
    energyDeploy: function(params){
        var energy = this.data.energyStored;
        this.data.energyStored = 0;
        this.data.energyInfo = energy / this.data.pistonDelay;
        this.data.pistonDelay = 0;
        return energy;
    },
    
    energyTick: function(type, src){
        
        var energy = Math.floor(src.get(20)) / 2.5;
        this.data.energyStored += energy;
    }
};
