IDRegistry.genBlockID("pipeItemDiamond");
Block.createBlock("pipeItemDiamond", [
    {name: "Diamond Transport Pipe", texture: [["pipe_item_diamond", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemDiamond, count: 1, data: 0}, ["xax"], ['x', 264, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemDiamond, {name: "pipe_item_diamond", data: 0, sides: true}, ITEM_PIPE_CONNECTION_ANY);

var DIAMOND_PIPE_COLORS = {
    BLACK: {slot: "black", data: 0},
    YELLOW: {slot: "yellow", data: 1},
    RED: {slot: "red", data: 2},
    BLUE: {slot: "blue", data: 3},
    WHITE: {slot: "white", data: 4},
    GREEN: {slot: "green", data: 5}
};

var DIAMOND_PIPE_DIRECTIONS = [
    {x: 0, y: -1, z: 0, type: DIAMOND_PIPE_COLORS.BLACK},
    {x: 0, y: 1, z: 0, type: DIAMOND_PIPE_COLORS.WHITE},
    {x: 0, y: 0, z: -1, type: DIAMOND_PIPE_COLORS.RED},
    {x: 0, y: 0, z: 1, type: DIAMOND_PIPE_COLORS.BLUE},
    {x: -1, y: 0, z: 0, type: DIAMOND_PIPE_COLORS.YELLOW},
    {x: 1, y: 0, z: 0, type: DIAMOND_PIPE_COLORS.GREEN}
];

var DIAMOND_PIPE_MODEL_BOXES = [
    [0.5 - PIPE_BLOCK_WIDTH, 0.0, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 1.0, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.0, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH],
    [0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 1.0],
    [0.0, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
    [0.5 + PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 0.5 - PIPE_BLOCK_WIDTH, 1.0, 0.5 + PIPE_BLOCK_WIDTH, 0.5 + PIPE_BLOCK_WIDTH],
];

var diamondPipeUI = new UI.StandartWindow({
    standart: {
        header: {
            text: {text: "Diamond Transporting Pipe"}
        }, 
        background: {
            standart: true,
        },
        inventory: {
            standart: true
        }
    },

    elements: {
        
    }
});

for (var i in DIAMOND_PIPE_DIRECTIONS){
    var type = DIAMOND_PIPE_DIRECTIONS[i].type;
    for (var j = 0; j < 9; j++){
        diamondPipeUI.content.elements["slot_" + i + "_" + j] = {
            type: "slot",
            bitmap: "diamond_pipe_slot_" + type.slot,
            x: 370 + j * 65, y: 80 + i * 65
        };
    };
}


TileEntity.registerPrototype(BlockID.pipeItemDiamond, {
    defaultValues: {
        containerIndex: 0,
        inverseMode: false
    },
    
    /* callbacks */
    getGuiScreen: function(){
        return diamondPipeUI;
    },

    tick: function(){
        this.reloadFilter();
    },
    
    getTransportSlots: function(){
        return {};
    },

    
    
    /* logic */
    reloadFilter: function(){
        this.filter = {};
        this.container.validateAll();

        for (var i in DIAMOND_PIPE_DIRECTIONS){
            this.filter[i] = {
                all: true
            };
            for (var j = 0; j < 9; j++){
                var slot = this.container.getSlot("slot_" + i + "_" + j);
                if (slot.id > 0){
                    this.filter[i][slot.id + "." + slot.data] = true;
                    this.filter[i].all = false;
                }
            }
        }
    },

    checkItem: function(id, data){
        if (this.filter){
            if (this.data.inverseMode){
                return this.filter.all || !this.filter[id + "." + data];
            }
            else{
                return this.filter.all || this.filter[id + "." + data];
            }
        }
        else{
            return true;
        }
    },

    getTransportedItemDirs: function(transportedItem, possibleDirs, item, direction, resDirs){
        var priorityDirections = [];
        var otherDirections = [];

        var addDir = function(array, dir){
            for (var i in possibleDirs){
                var dir2 = possibleDirs[i];
                if (dir.x == dir2.x && dir.y == dir2.y && dir.z == dir2.z && !(dir.x == -direction.x && dir.y == -direction.y && dir.z == -direction.z)){
                    array.push(dir);
                    break;
                }
            }
        }

        for (var i in DIAMOND_PIPE_DIRECTIONS){
            var dir = DIAMOND_PIPE_DIRECTIONS[i];
            if (this.filter[i][item.id + "." + item.data]){
                addDir(priorityDirections, dir);
            }
            else if (this.filter[i].all){
                addDir(otherDirections, dir);
            }
        }

        var directions = priorityDirections.length > 0 ? priorityDirections : otherDirections;

        if (directions.length == 0){
            return [
                {x: -direction.x, y: -direction.y, z: -direction.z}
            ];
        }

        return directions;
    }
});