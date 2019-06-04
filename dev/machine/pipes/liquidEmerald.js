// Emerald Fluid Pipe
IDRegistry.genBlockID("pipeFluidEmerald");
Block.createBlock("pipeFluidEmerald", [
    {name: "Emerald Fluid Pipe", texture: [["pipe_fluid_emerald", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

Block.setBlockShape(BlockID.pipeFluidEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Recipes.addShapeless({id: BlockID.pipeFluidEmerald, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemEmerald, data: 0}]);
setupFluidPipeRender(BlockID.pipeFluidEmerald, {name: "pipe_fluid_emerald", data: 0}, FLUID_PIPE_CONNECTION_ANY);


TileEntity.registerPrototype(BlockID.pipeFluidEmerald, {
    defaultValues: {
        containerIndex: 0,
        inverseMode: false
    },

    /* callbacks */
    getGuiScreen: function() {
        return emeraldPipeUI;
    },

    tick: function() {
        if (this.container.isOpened()) {
            this.reloadFilter();
            this.container.setText("modeSwitch", this.data.inverseMode ? "Ignore" : "Filter");
        }
    },

    getTransportSlots: function() {
        return {};
    },

    MJEnergyDeploy: function(amount, generator, params) {
        var storageData = this.findLiquidStorage();
        if (storageData && storageData.liquidStorage) {
            var pipes = LiquidTransportHelper.locateLiquidPipes(this.x, this.y, this.z);
            if (pipes.length > 0) {
                for (var dir in pipes) {
                    var liquid = this.getLiquidFrom(storageData.liquidStorage, amount * 0.05);
                    if (liquid) {
                        LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);
                    } else {
                        this.data.storageIndex++;
                    }
                }
            }
        }
    },

    findLiquidStorages: function() {
        var directions = LiquidTransportHelper.findNearbyLiquidDtorages(this);
        var dir = directions[this.data.storageIndex % directions.length];

        if (dir) {
            var liquidStorage = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z).liquidStorage;
            return {
                liquidStorage: liquidStorage,
                direction: dir,
                position: {
                    x: this.x + dir.x,
                    y: this.y + dir.y,
                    z: this.z + dir.z
                }
            };
        }
    },

    /* logic */
    reloadFilter: function() {
        this.filter = {
            all: true
        };
        this.container.validateAll();
        for (var i = 0; i < 9; i++) {
            var slot = this.container.getSlot("slot" + i);
            var liquid = LiquidRegistry.getItemLiquid(slot.id, slot.data)
            if (liquid) {
                this.filter[liquid] = true;
                this.filter.all = false;
            }
        }
    },

    checkLiquid: function(id) {
        if (this.filter) {
            if (this.data.inverseMode) {
                return this.filter.all || !this.filter[id];
            } else {
                return this.filter.all || this.filter[id];
            }
        } else {
            return true;
        }
    },

    getLiquidFrom: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        if (liquidStored && checkLiquid(liquid)) {
            return {
                id: liquidStored,
                amount: storage.getLiquid(liquidStored, amount)
            };
        }
    }
});