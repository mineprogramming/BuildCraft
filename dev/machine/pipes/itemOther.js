// Cobblestone Transport Pipe
IDRegistry.genBlockID("pipeItemCobble");
Block.createBlock("pipeItemCobble", [
    {name: "Cobblestone Transport Pipe", texture: [["pipe_item_cobble", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemCobble, count: 1, data: 0}, ["xax"], ['x', 4, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemCobble, "pipe_item_cobble", ITEM_PIPE_CONNECTION_COBBLE, {
    friction: .005
});


// Stone Transport Pipe
IDRegistry.genBlockID("pipeItemStone");
Block.createBlock("pipeItemStone", [
    {name: "Stone Transport Pipe", texture: [["pipe_item_stone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemStone, count: 1, data: 0}, ["xax"], ['x', 1, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemStone, "pipe_item_stone", ITEM_PIPE_CONNECTION_STONE, {
    friction: .0015
});


// Sandstone Transport Pipe
IDRegistry.genBlockID("pipeItemSandstone");
Block.createBlock("pipeItemSandstone", [
    {name: "Sandstone Transport Pipe", texture: [["pipe_item_sandstone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemSandstone, count: 1, data: 0}, ["xax"], ['x', 24, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemSandstone, "pipe_item_sandstone", ITEM_PIPE_CONNECTION_SANDSTONE, {
    friction: .0025
}); 


// Obsidian Transport Pipe
IDRegistry.genBlockID("pipeItemObsidian");
Block.createBlock("pipeItemObsidian", [
    {name: "Obsidian Transport Pipe", texture: [["pipe_item_obsidian", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemObsidian, count: 1, data: 0}, ["xax"], ['x', 49, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemObsidian, "pipe_item_obsidian", ITEM_PIPE_CONNECTION_ANY);




