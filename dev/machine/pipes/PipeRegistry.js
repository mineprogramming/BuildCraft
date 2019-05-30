var BLOCK_TYPE_ITEM_PIPE = Block.createSpecialType({
    base: 20,
    opaque: false
}, "bc-item-pipe");

var BLOCK_TYPE_LIQUID_PIPE = Block.createSpecialType({
    base: 20,
    opaque: false
}, "bc-liquid-pipe");

var PIPE_BLOCK_WIDTH = 0.25;


// item pipe render setup

var ITEM_PIPE_CONNECTION_MACHINE = "bc-container";

var ITEM_PIPE_CONNECTION_ANY = "bc-item-pipe-any";
var ITEM_PIPE_CONNECTION_STONE = "bc-item-pipe-stone";
var ITEM_PIPE_CONNECTION_COBBLE = "bc-item-pipe-cobble";
var ITEM_PIPE_CONNECTION_SANDSTONE = "bc-item-pipe-sandstone";

var PipeRegistry = {
    itemPipes: []
}


function getPipeRender(width, group, texture){
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
       
        render.addEntry(model).asCondition(box.side[0], box.side[1], box.side[2], group, 0);
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
    var group = ICRender.getGroup("bc-pipes");
    group.add(id, -1);
    
    var render;
    var renders = [];

    if(Array.isArray(texture)){
        for(var i in texture){
            var current = getPipeRender(width, group, texture[i], false);
            renders.push(current);
        }
        render = renders[0];
    } else if(texture.rotation){
        for(var i = 0; i < 6; i++){
            texture.index = i;
            var current = getPipeRender(width, group, texture, false);
            renders.push(current);
        }
        render = renders[0];
    } else {
        render = getPipeRender(width, group, texture, false);
    }
    
    BlockRenderer.setStaticICRender(id, 0, render);
    BlockRenderer.enableCoordMapping(id, 0, render);
    Block.setBlockShape(id, {x: 0.5 - width/2, y: 0.5 - width/2, z: 0.5 - width/2}, {x: 0.5 + width/2, y: 0.5 + width/2, z: 0.5 + width/2});
    
    /* params */
    ItemTransportingHelper.registerItemPipe(id, connectionType, params);
    PipeRegistry.itemPipes.push(id);
    
    return renders;
}

ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 54);
ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 61);
ICRenderLib.addConnectionBlock(ITEM_PIPE_CONNECTION_MACHINE, 62);


// item pipes 















