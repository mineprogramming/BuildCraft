LIBRARY({
    name: "LiquidLib",
    version: 1,
    shared: true,
    api: "CoreEngine"
});


IMPORT("numbers.js");


var BLOCK_TYPE_LIQUID = Block.createSpecialType({
    base: 8,
    opaque: false
}, "liquid");


IDRegistry.genBlockID("liquidSource");
Block.createBlock("liquidSource", [
    {name: "Liquid Source", inCreative: false}
], BLOCK_TYPE_LIQUID);


IDRegistry.genBlockID("liquidFlow");
Block.createBlock("liquidFlow", [
    {name: "Liquid Flow", inCreative: false}
], BLOCK_TYPE_LIQUID);


var LiquidLib = {
    liquids: {},
    /*
     * Creates liquid block
     * @param liquidId string liquid id registered using LiquidRegistry
     * @param texture texture information
     * @param fluidity determines how many blocks will liquid level 
     * reduce before stopping
     */
    registerLiquid: function(liquidId, texture, fluidity){
        if(!LiquidRegistry.isExists(liquidId)){
            throw new Excepion("Liquid id doesn't exist!");
        }
        
        var models = [];
        var step = 15 / fluidity;
        for(var i = 0; i < fluidity; i++){
            for(var j = 0; j < 4; j++){
                let render = new ICRender.Model();
                render.addEntry(buildFlowMesh(texture, j, (i + 1) * step, i * step));
                models.push(render);
            }
            
        }
        
        // full liquid
        let render = new ICRender.Model();
        render.addEntry(buildFlowMesh(texture, 3, 15/16, 15/16));
        models.push(render);
        
        BlockRenderer.setStaticICRender(BlockID.liquidFlow, 0, render);
        BlockRenderer.setStaticICRender(BlockID.liquidSource, 0, render);
        BlockRenderer.enableCoordMapping(BlockID.liquidFlow, 0, render);
        
        
        LiquidLib.liquids[liquidId] = {
            fluidity: fluidity,
            models: models
        }
    }
};


function buildFlowMesh(texture, direction, from, to){
    var mesh = new RenderMesh();
    mesh.setBlockTexture(texture.name, texture.data || 0);
    
    var vertices = [
        [
            [0, 0, 0],
            [0, from, 0],
            [1, 0, 0],
        ],[ 
            [1, from, 0],
            [1, 0, 0],
            [0, from, 0],
        ],[ 
            [0, 0, 0],
            [0, 0, 1],
            [0, from, 0],
        ],[ 
            [0, to, 1],
            [0, from, 0],
            [0, 0, 1],
        ],[ 
            [1, 0, 1],
            [1, 0, 0],
            [0, 0, 1],
        ],[  
            [1, 0, 1],
            [0, 0, 1],
            [1, 0, 0],
        ],[  
            [0, 0, 1],
            [1, 0, 1],
            [0, to, 1],
        ],[  
            [1, to, 1],
            [0, to, 1],
            [1, 0, 1],
        ],[  
            [1, 0, 0],
            [1, from, 0],
            [1, 0, 1],
        ],[  
            [1, to, 1],
            [1, 0, 1],
            [1, from, 0],
        ],[  
            [0, from, 0],
            [0, to, 1],
            [1, from, 0],
        ],[  
            [1, to, 1],
            [1, from, 0],
            [0, to, 1]
        ]
    ];
    
    let rotation = getRotationMatrix(direction);
    
    for(var i = 0; i < vertices.length; i++){
        var vertex = vertices[i];
        let coords = numbers.matrix.multiply(vertex, rotation);
        if(direction == 2 || direction == 3){
            for(var j = 0; j < 3; j++){
                coords[j][0] += 1;
                coords[j][2] += 1;
            }
        }
        if(direction == 0 || direction == 2){
            mesh.addVertex(coords[0][0], coords[0][1], coords[0][2], i % 2, i % 2);
            mesh.addVertex(coords[1][0], coords[1][1], coords[1][2], (i + 1) % 2, i % 2);
            mesh.addVertex(coords[2][0], coords[2][1], coords[2][2], i % 2, (i + 1) % 2);
        } else {
            mesh.addVertex(coords[0][0], coords[0][1], coords[0][2], i % 2, i % 2);
            mesh.addVertex(coords[2][0], coords[2][1], coords[2][2], i % 2, (i + 1) % 2);
            mesh.addVertex(coords[1][0], coords[1][1], coords[1][2], (i + 1) % 2, i % 2);
        }
        
    }
    
    mesh.rebuild();
    return mesh;
}

function getRotationMatrix(direction){
    switch(direction){
        case 0: return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        case 1: return [[0, 0, 1], [0, 1, 0], [1, 0, 0]];
        case 2: return [[-1, 0, 0], [0, 1, 0], [0, 0, -1]];
        case 3: return [[0, 0, -1], [0, 1, 0], [-1, 0, 0]];
    }
}


var SIDES = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1]
];


var LiquidUpdater = {
    blocks: [],
    updates: [],
    
    update: function(x, y, z){
        updates.push({x: x, y: y, z: z});
    },
    
    tick: function(){
        
    }
}


Callback.addCallback("tick", function(){
    LiquidUpdater.tick();
});


LiquidRegistry.registerLiquid("myLiquid", "My Liquid", []);
LiquidLib.registerLiquid("myLiquid", {name: "my_liquid"}, 16);

Callback.addCallback("ItemUse", function(coords, item, block){
    let x = coords.relative.x;
    let y = coords.relative.y;
    let z = coords.relative.z;
    if(item.id == 280){
        World.setBlock(x, y, z, BlockID.liquidSource, 0);  
        LiquidUpdater.blocks.push({x: x, y: y, z: z, id: "myLiquid"});
        LiquidUpdater.update(x, y, z);
    }
});

EXPORT("LiquidLib", LiquidLib);
