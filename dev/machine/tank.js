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
        this.data.frame = 0;
    },

    updateModel: function() {
        var storage = this.liquidStorage;
        var liquid = storage.getLiquidStored();
        if (liquid) {
            var amount = storage.getAmount(liquid);
            this.animation.describe(LiquidModels.getModelData(liquid, 10, amount, 10));
            this.animation.refresh();
        }
    },

    getGuiScreen: function() {
        return tank_interface ? tankUI : null;
    },
    getTransportLiquid:function(){
        return {input: ["water","lava"],output:["water","lava"]};
    },

    tick: function() {
        this.updateModel();

        this.data.frame++;

        var liquidStored = this.liquidStorage.getLiquidStored();
        var slot1 = this.container.getSlot("liquidSlot1");
        var slot2 = this.container.getSlot("liquidSlot2");
        var emptyItem = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
        var fullItem = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquidStored);
        this.liquidStorage.setLimit(null, 16);

        if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)) {
            if (this.liquidStorage.addLiquid(emptyItem.liquid, 1) <= 1) {
                if (slot2.id == emptyItem.id && slot2.data == emptyItem.data && slot2.count < Item.getMaxStack(emptyItem.id) || slot2.id == 0) {
                    slot1.count--;
                    slot2.id = emptyItem.id;
                    slot2.data = emptyItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        if (fullItem) {
            if (this.liquidStorage.getAmount(liquidStored, 1) >= 1) {
                if (slot2.id == fullItem.id && slot2.data == fullItem.data && slot2.count < Item.getMaxStack(fullItem.id) || slot2.id == 0) {
                    this.liquidStorage.getLiquid(liquidStored, 1, true);
                    slot1.count--;
                    slot2.id = fullItem.id;
                    slot2.data = fullItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        if (this.container.isOpened()) {
            this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
            this.container.setText("textInfo1", "Liquid: " + (+this.liquidStorage.getAmount(this.liquidStorage.getLiquidStored()).toFixed(3)) * 1000 + "/16000");
        }

        var targetId = World.getBlockID(this.x, this.y - 1, this.z);
        if (targetId == BlockID.bcTank) {
            var other_storage = World.getTileEntity(this.x, this.y - 1, this.z).liquidStorage;
            var amount = this.liquidStorage.getLiquid(liquidStored, 1);
            if (amount > 0) {
                var returned_amount = other_storage.addLiquid(liquidStored, amount);
                this.liquidStorage.addLiquid(liquidStored, returned_amount);
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
                }
            }
        } else {
            return false;
        }
    },

    addLiquidFromPipe: function(liquid, amount) {
        var liquidStored = this.liquidStorage.getLiquidStored();
        if (liquidStored == liquid || !liquidStored) {
            return this.liquidStorage.addLiquid(liquid, amount);
        }
    },

    destroyBlock: function() {
        if (this.animation) this.animation.destroy();
    }
});