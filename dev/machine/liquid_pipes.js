




// fluid pipes

IDRegistry.genBlockID("pipeFluidWooden");
Block.createBlock("pipeFluidWooden", [
    {name: "Wooden Fluid Pipe", texture: [["pipe_fluid_wood", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidCobble");
Block.createBlock("pipeFluidCobble", [
    {name: "Cobblestone Fluid Pipe", texture: [["pipe_fluid_cobble", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidStone");
Block.createBlock("pipeFluidStone", [
    {name: "Stone Fluid Pipe", texture: [["pipe_fluid_stone", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidIron");
Block.createBlock("pipeFluidIron", [
    {name: "Iron Fluid Pipe", texture: [["pipe_fluid_iron", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidGolden");
Block.createBlock("pipeFluidGolden", [
    {name: "Golden Fluid Pipe", texture: [["pipe_fluid_gold", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidEmerald");
Block.createBlock("pipeFluidEmerald", [
    {name: "Emerald Fluid Pipe", texture: [["pipe_fluid_emerald", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

Block.setBlockShape(BlockID.pipeFluidWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidCobble, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidStone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidIron, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidGolden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});

Recipes.addShapeless({id: BlockID.pipeFluidWooden, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemWooden, data: 0}]);
Recipes.addShapeless({id: BlockID.pipeFluidCobble, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemCobble, data: 0}]);
Recipes.addShapeless({id: BlockID.pipeFluidStone, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemStone, data: 0}]);
Recipes.addShapeless({id: BlockID.pipeFluidIron, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemIron, data: -1}]);
Recipes.addShapeless({id: BlockID.pipeFluidGolden, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemGolden, data: -1}]);
Recipes.addShapeless({id: BlockID.pipeFluidEmerald, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemEmerald, data: 0}]);

setupFluidPipeRender(BlockID.pipeFluidWooden, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidCobble, FLUID_PIPE_CONNECTION_COBBLE);
setupFluidPipeRender(BlockID.pipeFluidStone, FLUID_PIPE_CONNECTION_STONE);
setupFluidPipeRender(BlockID.pipeFluidIron, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidGolden, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidEmerald, FLUID_PIPE_CONNECTION_ANY);


TileEntity.registerPrototype(BlockID.pipeFluidWooden, {
    defaultValues: {
        storageIndex: 0,
    },
    
    getTransportSlots: function(){
        return {};
    },
    
    MJEnergyDeploy: function(amount, generator, params){
        var storageData = this.findLiquidStorage();
        if (storageData && storageData.liquidStorage){
     var pipes = LiquidTransportHelper.locateLiquidPipes(this.x, this.y, this.z);
            if (pipes.length > 0){
       for (var dir in pipes){
        var liquid = this.getLiquidFrom(storageData.liquidStorage, amount*0.01);
              if (liquid){
         for (var pos in pipes[dir]){
          pipes[dir][pos] += this[pos];
         }
                LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);
            }
            else{
                this.data.storageIndex++;
            }
    }
   }
   }
    },
    
    findLiquidStorage: function(){
        var directions = LiquidTransportHelper.findNearbyLiquidStorages(this);
        var dir = directions[this.data.storageIndex % directions.length];
        
        if (dir){
            var liquidStorage = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z).liquidStorage;
            return {
                liquidStorage: liquidStorage,
                direction: dir,
                position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
            };
        }
    },

    getLiquidFrom: function(storage, amount){
   var liquidStored = storage.getLiquidStored();
   if (liquidStored){
    return {id: liquidStored, amount: storage.getLiquid(liquidStored, amount)};
   }
  }
});



TileEntity.registerPrototype(BlockID.pipeFluidEmerald, {
    defaultValues: {
        containerIndex: 0,
        inverseMode: false
    },
    
    /* callbacks */
    getGuiScreen: function(){
        return emeraldPipeUI;
    },

    tick: function(){
        if (this.container.isOpened()){
            this.reloadFilter();
            this.container.setText("modeSwitch", this.data.inverseMode ? "Ignore" : "Filter");
        }
    },
    
    getTransportSlots: function(){
        return {};
    },

    MJEnergyDeploy: function(amount, generator, params){
        var storageData = this.findLiquidStorage();
        if (storageData && storageData.liquidStorage){
     var pipes = LiquidTransportHelper.locateLiquidPipes(this.x, this.y, this.z);
            if (pipes.length > 0){
       for (var dir in pipes){
        var liquid = this.getLiquidFrom(storageData.liquidStorage, amount*0.05);
              if (liquid){
                LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);
            }
            else{
                this.data.storageIndex++;
            }
    }
   }
   }
    },
    
    findLiquidStorages: function(){
        var directions = LiquidTransportHelper.findNearbyLiquidDtorages(this);
        var dir = directions[this.data.storageIndex % directions.length];
        
        if (dir){
            var liquidStorage = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z).liquidStorage;
            return {
                liquidStorage: liquidStorage,
                direction: dir,
                position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
            };
        }
    },
    
    /* logic */
    reloadFilter: function(){
        this.filter = {
            all: true
        };
        this.container.validateAll();
        for (var i = 0; i < 9; i++){
                var slot = this.container.getSlot("slot" + i);
     var liquid = LiquidRegistry.getItemLiquid(slot.id, slot.data)
            if (liquid){
                this.filter[liquid] = true;
                this.filter.all = false;
            }
        }
    },

    checkLiquid: function(id){
        if (this.filter){
            if (this.data.inverseMode){
                return this.filter.all || !this.filter[id];
            }
            else{
                return this.filter.all || this.filter[id];
            }
        }
        else{
            return true;
        }
    },

    getLiquidFrom: function(storage, amount){
   var liquidStored = storage.getLiquidStored();
   if (liquidStored && checkLiquid(liquid)){
    return {id: liquidStored, amount: storage.getLiquid(liquidStored, amount)};
   }
  }
});





