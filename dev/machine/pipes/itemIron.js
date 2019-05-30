// Iron Transport Pipe
IDRegistry.genBlockID("pipeItemIron");
Block.createBlock("pipeItemIron", [
    {name: "Iron Transport Pipe", texture: [["pipe_item_iron", 0]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.pipeItemIron, count: 1, data: 0}, ["xax"], ['x', 265, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemIron, {name: "pipe_item_iron", data: 0}, ITEM_PIPE_CONNECTION_ANY);

var IRON_PIPE_DIRECTIONS = [
    {x: 0, y: -1, z: 0},
    {x: 0, y: 1, z: 0},
    {x: 0, y: 0, z: -1},
    {x: 0, y: 0, z: 1},
    {x: -1, y: 0, z: 0},
    {x: 1, y: 0, z: 0},
];

var IRON_PIPE_MODEL_BOXES = [
    [0.5 - PIPE_BLOCK_WIDTH, 0.0, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 1.0, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.0, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 1.0],
    [0.0, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 1.0, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
];

// init renderer
//Callback.addCallback("PreLoaded", function(){
//    for (var data in IRON_PIPE_DIRECTIONS){
//        var ironPipeRender = new TileRenderModel(BlockID.pipeItemIron, data);
//        for(var i in IRON_PIPE_MODEL_BOXES){
//            var box = IRON_PIPE_MODEL_BOXES[i];
//            var dir = IRON_PIPE_DIRECTIONS[i];
//            if(i == data){
//                ironPipeRender.addBoxF(box[0], box[1], box[2], box[3], box[4], box[5], {id: BlockID.pipeItemIronRender, data: 0});
//            }
//            else{
//                var condition = ironPipeRender.createCondition(dir.x, dir.y, dir.z);
//                condition.addBoxF(box[0], box[1], box[2], box[3], box[4], box[5]);
//                condition.addBlockGroup(ITEM_PIPE_CONNECTION_ANY);
//                condition.addBlockGroup(ITEM_PIPE_CONNECTION_MACHINE);
//            }
//        }
//        ironPipeRender.addBoxF(0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH);
//    }
//});

TileEntity.registerPrototype(BlockID.pipeItemIron, {
    defaultValues: {
        direction: 0
    },

    setDirection: function(dir){
        this.data.direction = dir % 6 || 0;
        //World.setBlock(this.x, this.y, this.z, World.getBlock(this.x, this.y, this.z).id, this.data.direction);
    },

    created: function(){
        this.setDirection(1);
    },

    click: function(id, count, data){
        if (id == ItemID.bcWrench){
            this.setDirection(this.data.direction + 1);
        }
    },

    getTransportedItemDirs: function(){
        return [
            IRON_PIPE_DIRECTIONS[this.data.direction]
        ];
    }
});

