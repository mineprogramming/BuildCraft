// Iron Transport Pipe
IDRegistry.genBlockID("pipeItemIron");
Block.createBlock("pipeItemIron", [
    {name: "Iron Transport Pipe", texture: [["pipe_item_iron", 0]], inCreative: true}
]);

Recipes.addShaped({id: BlockID.pipeItemIron, count: 1, data: 0}, ["xax"], ['x', 265, 0, 'a', 20, -1]);
var modelsItemIron = registerItemPipe(BlockID.pipeItemIron, {name: "pipe_item_iron", data: 0, rotation: true}, ITEM_PIPE_CONNECTION_ANY);

var IRON_PIPE_DIRECTIONS = [
    {x: 1, y: 0, z: 0},
    {x: -1, y: 0, z: 0},
    {x: 0, y: 1, z: 0},
    {x: 0, y: -1, z: 0},
    {x: 0, y: 0, z: 1},
    {x: 0, y: 0, z: -1},
];


var PIPE_ITEM_IRON_PROTOTYPE = {
    defaultValues: {
        direction: 0
    },
    
    init: function(){
        this.setDirection(this.data.direction);
    },

    setDirection: function(dir){
        this.data.direction = dir || 0;
        BlockRenderer.mapAtCoords(this.x, this.y, this.z, modelsItemIron[dir]);
    },

    created: function(){
        this.setDirection(1);
    },

    click: function(id, count, data){
        if (id == ItemID.bcWrench){
            this.changeDirection();
        }
    },
    
    changeDirection: function(){
        var direction = this.data.direction;
        for(var i = 0; i < 6; i++){
            direction = (direction + 1) % 6;
            var relative = IRON_PIPE_DIRECTIONS[direction];
            var block = World.getBlockID(this.x + relative.x, this.y + relative.y, this.z + relative.z);
            if(PipeRegistry.itemPipes.indexOf(block) != -1) { 
                // Found next connected pipe
                break;
            }
        }
        this.setDirection(direction);
    },

    getTransportedItemDirs: function(){
        return [
            IRON_PIPE_DIRECTIONS[this.data.direction]
        ];
    },
    
    destroyBlock: function(){
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }
}


if(__config__.getBool('use_redstone')){ 
    PIPE_ITEM_IRON_PROTOTYPE.redstone = function(signal){
        if(signal.power > 8 && !this.data.redstone){
            this.data.redstone = true;
            this.changeDirection();
        } else {
            this.data.redstone = false;
        }
    }
    PIPE_ITEM_IRON_PROTOTYPE.defaultValues.redstone = false;
}


TileEntity.registerPrototype(BlockID.pipeItemIron, PIPE_ITEM_IRON_PROTOTYPE);




