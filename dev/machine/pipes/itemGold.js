// Golden Transport Pipe
IDRegistry.genBlockID("pipeItemGolden");
Block.createBlock("pipeItemGolden", [
    {name: "Golden Transport Pipe", texture: [["pipe_item_gold", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemGolden, count: 1, data: 0}, ["xax"], ['x', 266, 0, 'a', 20, -1]);
var modelsItemGolden = registerItemPipe(BlockID.pipeItemGolden, [
    {name: "pipe_item_gold", data: 0},
    {name: "pipe_item_gold", data: 2}
 ], ITEM_PIPE_CONNECTION_ANY);

var PIPE_ITEM_GOLDEN_PROTOTYPE = {
    defaultValues: {
        redstone: false,
    },
    
    init: function(){
        this.updateModel();
    },
    
    updateModel: function(){
        var model = modelsItemGolden[this.data.redstone ? 1 : 0];
        BlockRenderer.mapAtCoords(this.x, this.y, this.z, model);
    },
    
    getItemAcceleration: function(){
        return this.data.redstone ? 0.0025 : 0.02;
    }
};


if(__config__.getBool('use_redstone')){
    PIPE_ITEM_GOLDEN_PROTOTYPE.redstone = function(signal){
        this.data.redstone = signal.power > 8;  
        this.updateModel();
    };
} else {
    PIPE_ITEM_GOLDEN_PROTOTYPE.defaultValues.redstone = true;
}


TileEntity.registerPrototype(BlockID.pipeItemGolden, PIPE_ITEM_GOLDEN_PROTOTYPE);


