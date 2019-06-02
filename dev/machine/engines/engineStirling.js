var ENGINE_TYPE_STONE = "Stone";

// Stirling Engine
IDRegistry.genItemID("engineStone");
Item.createItem("engineStone", "Stirling Engine", {name: "engine_stone"});

Recipes.addShaped({id: ItemID.engineStone, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 4, -1, 'b', 20, -1, 'o', ItemID.gearStone, 0]);


Item.registerUseFunction("engineStone", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_STONE);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


var guiStoneEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Stirling Engine"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 445, y: 120, bitmap: "fire_background", scale: 5}
    ],
    
    elements: {
        "burningScale": {type: "scale", x: 445, y: 120, direction: 1, value: 0.5, bitmap: "fire_scale", scale: 5},
        "slotFuel": {type: "slot", x: 441, y: 212, size: 80},
        "textInfo1": {type: "text", x: 545, y: 180, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 655, y: 180, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});


EngineModelPartRegistry.Add("engineStone0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 32}, {width: 512, height: 512}));


ENGINE_TYPE_DATA[ENGINE_TYPE_STONE] = {
    defaultValues: {
        burn: 0,
        maxBurn: 0,
        overheat: 0
    },
    
    getItemDrop: function(){
        return [[ItemID.engineStone, 1, 0]];
    },
    
    getGuiScreen: function(){
        return guiStoneEngine;
    },
    
    energyDeploy: function(){
        return 32;
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 800;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        if (this.data.overheat > 0){
            return 3;
        }
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 800;
        var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
        
        if (this.data.overheat > 0){
            this.data.overheat--;
            this.data.heat -= .2;
            this.setPower(0);
        }
        
        else if (this.data.redstone && this.data.burn > 0){
            this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
            if (this.isPushingForward()){
                this.data.heat += .8 * heatRatio;
            }
            else{
                this.data.heat -= .4 * heatRatio;
            }
            this.data.burn--;
        }
        else{
            this.setPower(0);
            this.data.heat -= .2;
        }
        
        if (this.data.burn <= 0){
            this.data.burn = this.data.maxBurn = getFuelForStoneEngine(this.container, "slotFuel") * 2;
        }
        
        this.container.setScale("burningScale", this.data.burn / this.data.maxBurn || 0);
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
        this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (this.data.burn <= 0 ? ": NO FUEL" : "")));
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
        if (this.data.heat == MAX_HEAT){
            this.data.overheat = 2400; // 120 secs
        }
    }
};


function getFuelForStoneEngine(container, slotName){
    var fuelSlot = container.getSlot(slotName);
    if (fuelSlot.id > 0){
        var burn = FURNACE_FUEL_MAP[fuelSlot.id];
        if (burn){
            fuelSlot.count--;
            container.validateSlot(slotName);
            return burn;
        }
        if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
            var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
            fuelSlot.id = empty.id;
            fuelSlot.data = empty.data;
            return 20000;
        }
    }
    return 0;
}

