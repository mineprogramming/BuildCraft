var ENGINE_TYPE_IRON = "Iron";

// ICE Engine
IDRegistry.genItemID("engineIron");
Item.createItem("engineIron", "ICE", {name: "engine_iron"});

Recipes.addShaped({id: ItemID.engineIron, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 265, 0, 'b', 20, -1, 'o', ItemID.gearIron, 0]);


Item.registerUseFunction("engineIron", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_IRON);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineIron0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 64}, {width: 512, height: 512}));


var guiIronEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "ICE"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 550, y: 30, bitmap: "liquid_scale_40x8_background", scale: 4}
    ],
    
    elements: {
        "liquidScale": {type: "scale", x: 554, y: 34, direction: 1, value: 0.5, bitmap: "liquid_scale_40x8_empty", overlay: "liquid_scale_40x8_overlay", scale: 4},
        "liquidSlot1": {type: "slot", x: 421, y: 54, size: 80},
        "liquidSlot2": {type: "slot", x: 421, y: 254, size: 80},
        "textInfo1": {type: "text", x: 685, y: 150, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 685, y: 200, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});

var ENGINE_IRON_FUEL_DATA = {
    "lava": 2500,
    "oil": 7500,
    "fuel": 12500,
    "biofuel": 12500
};

ENGINE_TYPE_DATA[ENGINE_TYPE_IRON] = {
    defaultValues: {
        overheat: 0
    },
    
    getGuiScreen: function(){
        return guiIronEngine;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineIron, 1, 0]];
    },
    
    energyDeploy: function(){
        return 128;
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 1200;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        if (this.data.overheat > 0){
            return 3;
        }
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 1200;
        var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
        
        var liquidStored = this.liquidStorage.getLiquidStored();
        var fuelTicks = ENGINE_IRON_FUEL_DATA[liquidStored];
        
        if (this.data.overheat > 0){
            this.data.overheat--;
            this.data.heat -= .2;
            this.setPower(0);
        }
        else if (this.data.redstone && fuelTicks && this.liquidStorage.getLiquid(liquidStored, 1.0 / fuelTicks, true)){
            this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
            if (this.isPushingForward()){
                this.data.heat += 1.21 * heatRatio;
            }
            else{
                this.data.heat -= .4 * heatRatio;
            }
        }
        else{
            this.setPower(0);
            this.data.heat -= .2;
        }
        
        var slot1 = this.container.getSlot("liquidSlot1");
        var slot2 = this.container.getSlot("liquidSlot2");
        var emptyItem = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
        this.liquidStorage.setLimit(null, 8);
        
        if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)){
            if (this.liquidStorage.addLiquid(emptyItem.liquid, 1, true) < 1){
                if (slot2.id == emptyItem.id && slot2.data == emptyItem.data && slot2.count < Item.getMaxStack(emptyItem.id) || slot2.id == 0){
                    slot1.count--;
                    slot2.id = emptyItem.id;
                    slot2.data = emptyItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        
        this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
        this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (!fuelTicks ? ": NO FUEL" : "")));
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
        if (this.data.heat == MAX_HEAT){
            this.data.overheat = 3600; // 180 secs
        }
    }
};