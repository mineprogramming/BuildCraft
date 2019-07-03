IDRegistry.genBlockID("bcTank");
Block.createBlock("bcTank", [
 {name: "Tank", texture: [["tank", 1], ["tank", 1], ["tank", 0]], inCreative: true}], BLOCK_TYPE_LIQUID_PIPE);
Block.setBlockShape(BlockID.bcTank, {x: 2/16 + 0.001, y: 0.001, z: 2/16 + 0.001}, {x: 14/16 - 0.001, y: 0.999, z: 14/16 - 0.001});

Recipes.addShaped({id: BlockID.bcTank, count: 1, data: 0}, [
    "ggg",
    "g g",
    "ggg"
], ["g", 20, 0]);

//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_ANY, BlockID.tank);

//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_STONE, BlockID.tank);
//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_COBBLE, BlockID.tank);

var tankUI = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Tank"}},
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
    }
});


TileEntity.registerPrototype(BlockID.bcTank, {
    init: function() {
        this.animation = new Animation.Base(this.x + 3 / 16, this.y, this.z + 13 / 16);
        this.animation.load();
        this.liquidStorage.setLimit(null, 16);
        this.updateModel();
    },

    updateModel: function() {
        var storage = this.liquidStorage;
        //alert("model");
        var liquid = storage.getLiquidStored() ? storage.getLiquidStored() : "water";
        var amount = storage.getAmount(liquid) ? storage.getAmount(liquid) : 0;
        var width = amount?10:0;
        
        this.animation.describe(LiquidModels.getModelData(liquid, width, amount, width));
        this.animation.refresh();
    },

    getGuiScreen: function() {
        return tank_interface ? tankUI : null;
    },
    getTransportLiquid:function(){
        return {input: ["water","lava","milk"],output:["water","lava","milk"]};
    },

    tick: function() { 
        if(World.getThreadTime()%40==0) this.updateModel();
        
        var storage = this.liquidStorage;
        var liquid = this.liquidStorage.getLiquidStored();
        var slot1 = this.container.getSlot("liquidSlot1");
        var slot2 = this.container.getSlot("liquidSlot2");
        var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
        var fullItem = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquid);
        
        if(empty && (!liquid || empty.liquid == liquid)){
            if(storage.getAmount(empty.liquid) <= 15 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
                storage.addLiquid(empty.liquid, 1);
                slot1.count--;
                slot2.id = empty.id;
                slot2.data = empty.data;
                slot2.count++;
                this.container.validateAll();
            }
        }
        if(liquid){
            var full = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquid);
            if(full && storage.getAmount(liquid) >= 1 && (slot2.id == full.id && slot2.data == full.data && slot2.count < Item.getMaxStack(full.id) || slot2.id == 0)){
                storage.getLiquid(liquid, 1);
                slot1.count--;
                slot2.id = full.id;
                slot2.data = full.data;
                slot2.count++;
                this.container.validateAll();
            }
        }
        
        if (this.container.isOpened()) {
            this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
            this.container.setText("textInfo1", "Liquid: " + (+this.liquidStorage.getAmount(this.liquidStorage.getLiquidStored()).toFixed(3)) * 1000 + "/16000");
        }

        var targetId = World.getBlockID(this.x, this.y - 1, this.z);
        if (targetId == BlockID.bcTank) {
            var other_storage = World.getTileEntity(this.x, this.y - 1, this.z).liquidStorage;
            var amount = this.liquidStorage.getLiquid(liquid, 1);
            if (amount > 0) {
                var returned_amount = other_storage.addLiquid(liquid, amount);
                this.liquidStorage.addLiquid(liquid, returned_amount);
                this.updateModel();
            }
        }
    },

    click: function() {
        if (!tank_interface) {
            var item = Player.getCarriedItem();
            var emptyItem = LiquidRegistry.getEmptyItem(item.id, item.data);
            var liquidStored = this.liquidStorage.getLiquidStored();
            if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)) {
                if (this.liquidStorage.addLiquid(emptyItem.liquid, 1, true) < 1) {
                    Player.decreaseCarriedItem(1);
                    Player.addItemToInventory(emptyItem.id, 1, emptyItem.data);
                    this.updateModel();
                }
            }
        } else {
            return false;
        }
    },
    destroyBlock: function() {
        if (this.animation) this.animation.destroy();
    }
});