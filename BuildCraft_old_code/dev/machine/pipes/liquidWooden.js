// Wooden Fluid Pipe
IDRegistry.genBlockID("pipeFluidWooden");
Block.createBlock("pipeFluidWooden", [
    {name: "Wooden Fluid Pipe", texture: [["pipe_fluid_wood", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

Block.setBlockShape(BlockID.pipeFluidWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Recipes.addShapeless({id: BlockID.pipeFluidWooden, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemWooden, data: 0}]);
setupWoodenFluidPipeRender(BlockID.pipeFluidWooden, {name: "pipe_fluid_wood", data: 0}, FLUID_PIPE_CONNECTION_ANY);
//OVERRIDE


TileEntity.registerPrototype(BlockID.pipeFluidWooden, {
    defaultValues: {
        storageIndex: 0,
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
                    var liquid = this.getLiquidFrom(storageData.liquidStorage, amount * 0.01);
                    if (liquid) {
                        for (var pos in pipes[dir]) {
                            pipes[dir][pos] += this[pos];
                        }
                        LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);

                    } else {
                        this.data.storageIndex++;
                    }
                }
            }
        }
    },

    findLiquidStorage: function() {
        var directions = LiquidTransportHelper.findNearbyLiquidStorages(this);
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

    getLiquidFrom: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        if (liquidStored) {
            return {
                id: liquidStored,
                amount: storage.getLiquid(liquidStored, amount)
            };
        }
    }
});
