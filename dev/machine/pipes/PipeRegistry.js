var BLOCK_TYPE_ITEM_PIPE = Block.createSpecialType({
    base: 1,
    opaque: false
}, "bc-item-pipe");

var BLOCK_TYPE_LIQUID_PIPE = Block.createSpecialType({
    base: 1,
    opaque: false
}, "bc-liquid-pipe");

var PIPE_BLOCK_WIDTH = 0.25;



var ITEM_PIPE_CONNECTION_MACHINE = "bc-container";

var ITEM_PIPE_CONNECTION_ANY = "bc-item-pipe-any";
var ITEM_PIPE_CONNECTION_WOOD = "bc-item-pipe-wood";
var ITEM_PIPE_CONNECTION_STONE = "bc-item-pipe-stone";
var ITEM_PIPE_CONNECTION_COBBLE = "bc-item-pipe-cobble";



var FLUID_PIPE_CONNECTION_MACHINE = "bc-fluid";

var FLUID_PIPE_CONNECTION_ANY = "bc-fluid-pipe-any";
var FLUID_PIPE_CONNECTION_WOOD = "bc-fluid-pipe-wood";
var FLUID_PIPE_CONNECTION_STONE = "bc-fluid-pipe-stone";
var FLUID_PIPE_CONNECTION_COBBLE = "bc-fluid-pipe-cobble";


var PipeRegistry = {
    itemPipes: []
}


function getPipeRender(width, group, connectionType, texture){
    var render = new ICRender.Model();
    
    var boxes = [
        {side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
        {side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
        {side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
        {side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]},
    ]

    for (var i in boxes) {
        var box = boxes[i];
       
        var model = BlockRenderer.createModel();
        
        var data = texture.data + (texture.sides? 1 + parseInt(i) : 1);
        if(texture.rotation && i != texture.index){
            data += 1;
        }
        
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, data);
        
        var condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], group, false);
        if(connectionType == ITEM_PIPE_CONNECTION_WOOD){
            condition = ICRender.AND(condition, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], ICRender.getGroup(ITEM_PIPE_CONNECTION_WOOD), true));
        } 
        else if(connectionType == ITEM_PIPE_CONNECTION_STONE){
            condition = ICRender.AND(condition, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], ICRender.getGroup(ITEM_PIPE_CONNECTION_COBBLE), true));
        }
        else if(connectionType == ITEM_PIPE_CONNECTION_COBBLE){
            condition = ICRender.AND(condition, ICRender.BLOCK(box.side[0], box.side[1], box.side[2], ICRender.getGroup(ITEM_PIPE_CONNECTION_STONE), true));
        }
        
        render.addEntry(model).setCondition(condition);
        
        // Connecting to TileEntities
        data = connectionType == ITEM_PIPE_CONNECTION_WOOD? texture.data + 2: texture.data;
        model = BlockRenderer.createModel();
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, data);
        var condition = ICRender.BLOCK(box.side[0], box.side[1], box.side[2], ICRender.getGroup(ITEM_PIPE_CONNECTION_MACHINE), false);
        render.addEntry(model).setCondition(condition);
    }

    var model = BlockRenderer.createModel();
    model.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, texture.name, texture.data);
    render.addEntry(model);
    
    return render;
}


function registerItemPipe(id, texture, connectionType, params){
    Block.registerDropFunctionForID(id, function(){
        return [[id, 1, 0]];
    });
    
    var width = 0.5;
    ICRender.getGroup(connectionType).add(id, -1);
    var group = ICRender.getGroup("bc-pipes");
    group.add(id, -1);
    
    var render;
    var renders = [];

    if(Array.isArray(texture)){
        for(var i in texture){
            var current = getPipeRender(width, group, connectionType, texture[i]);
            renders.push(current);
        }
        render = renders[0];
    } else if(texture.rotation){
        for(var i = 0; i < 6; i++){
            texture.index = i;
            var current = getPipeRender(width, group, connectionType, texture);
            renders.push(current);
        }
        render = renders[0];
    } else {
        render = getPipeRender(width, group, connectionType, texture);
    }
    
    BlockRenderer.setStaticICRender(id, 0, render);
    BlockRenderer.enableCoordMapping(id, 0, render);
    Block.setBlockShape(id, {x: 0.5 - width/2, y: 0.5 - width/2, z: 0.5 - width/2}, {x: 0.5 + width/2, y: 0.5 + width/2, z: 0.5 + width/2});
    
    /* params */
    ItemTransportingHelper.registerItemPipe(id, connectionType, params);
    PipeRegistry.itemPipes.push(id);
    
    return renders;
}

var blockGroupMachine = ICRender.getGroup(ITEM_PIPE_CONNECTION_MACHINE);
blockGroupMachine.add(54, -1);
blockGroupMachine.add(61, -1);
blockGroupMachine.add(62, -1);
blockGroupMachine.add(154, -1);

Callback.addCallback("PostLoaded", function(){
    var prototypes = TileEntity.tileEntityPrototypes;
    for(var id in prototypes){
        if(prototypes[id].getTransportSlots){
            let slots = prototypes[id].getTransportSlots();
            if(slots.output && slots.output.length > 0 || slots.input && slots.input.length > 0){
                blockGroupMachine.add(id, -1);
            }
        }
    }
});


function setupFluidPipeRender(id, texture, connectionType){
    /* drop func */
    Block.registerDropFunctionForID(id, function(){
        return [[id, 1, 0]];
    });
    
    var width = 0.5;
    var group = ICRender.getGroup("bc-liquid-pipes");
    group.add(id, -1);

    /* render */
    var render = new ICRender.Model();
    
    var boxes = [
        {side: [1, 0, 0], box: [0.5 + width / 2, 0.5 - width / 2, 0.5 - width / 2, 1, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [-1, 0, 0], box: [0, 0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2]},
        {side: [0, 1, 0], box: [0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2, 1, 0.5 + width / 2]},
        {side: [0, -1, 0], box: [0.5 - width / 2, 0, 0.5 - width / 2, 0.5 + width / 2, 0.5 - width / 2, 0.5 + width / 2]},
        {side: [0, 0, 1], box: [0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, 1]},
        {side: [0, 0, -1], box: [0.5 - width / 2, 0.5 - width / 2, 0, 0.5 + width / 2, 0.5 + width / 2, 0.5 - width / 2]},
    ]

    for (var i in boxes) {
        var box = boxes[i];
       
        var model = BlockRenderer.createModel();
        
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, texture.data + 1);
       
        render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
    }

    var model = BlockRenderer.createModel();
    model.addBox(0.5 - width / 2, 0.5 - width / 2, 0.5 - width / 2, 0.5 + width / 2, 0.5 + width / 2, 0.5 + width / 2, texture.name, texture.data);
    render.addEntry(model);
    BlockRenderer.setStaticICRender(id, 0, render);
    
    LiquidTransportHelper.registerFluidPipe(id, connectionType);
}















