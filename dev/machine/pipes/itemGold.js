// Golden Transport Pipe
IDRegistry.genBlockID("pipeItemGolden");
Block.createBlock("pipeItemGolden", [
    {name: "Golden Transport Pipe", texture: [["pipe_item_gold", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemGolden, count: 1, data: 0}, ["xax"], ['x', 266, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemGolden, "pipe_item_gold", ITEM_PIPE_CONNECTION_ANY);

TileEntity.registerPrototype(BlockID.pipeItemGolden, {
    defaultValues: {
        redstone: false,
    },

    redstone: function(signal){
        this.data.redstone = signal.power > 8;
        // TODO: change texture
        // World.setBlock(this.x, this.y, this.z, World.getBlock(this.x, this.y, this.z).id, this.data.redstone ? 1 : 0);
    },
    
    getItemAcceleration: function(){
        return this.data.redstone ? 0.0025 : 0.02;
    }
});
