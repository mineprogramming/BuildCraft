
// constants
var FURNACE_FUEL_MAP = {
    5: 300,
    6: 100,
    17: 300,
    263: 1600,
    280: 100,
    268: 200,
    269: 200,
    270: 200,
    271: 200,
    85: 300,
    107: 300,
    134: 300,
    135: 300,
    158: 150,
    162: 300,
    163: 300,
    164: 300,
    184: 300,
    185: 300,
    186: 300,
    187: 300,
    53: 300,
    54: 300,
    58: 300
};

// gui fonts
var STD_FONT_MEDIUM = {color: android.graphics.Color.WHITE, size: 28, shadow: 0.5};
var RED_FONT_MEDIUM = {color: android.graphics.Color.RED, size: 28, shadow: 0.5};

// config
var tank_interface = __config__.access("enable_tank_ui");



function TileRenderModel(id, data){
    this.registerAsId = function(id, data){
        this.id = id;
        this.data = data || 0;
        this.convertedId = this.id * 16 + this.data;
        
        if (this.convertedId){
            ICRenderLib.registerTileModel(this.convertedId, this);
        }
        else{
            Logger.Log("tile model cannot be registred: block id is undefined or 0", "ERROR");
        }
    }
    
    this.cloneForId = function(id, data){
        this.registerAsId(id, data);
    }
    
    this.registerAsId(id, data);
    
    this.boxes = [];
    this.dynamic = [];

    this.formatBox = function(x1, y1, z1, x2, y2, z2, block){
        var M = 1.0;
        var box = [
            x1 * M, y1 * M, z1 * M,
            x2 * M, y2 * M, z2 * M,
        ];

        if (block){
            box.push(parseInt(block.id) || 0);
            box.push(parseInt(block.data) || 0)
        }
        else{
            box.push(-1);
            box.push(-1);
        }

        return box;
    }

    this.addBoxF = function(x1, y1, z1, x2, y2, z2, block){
        this.boxes.push(this.formatBox(x1, y1, z1, x2, y2, z2, block));
    }
 
    this.addBox = function(x, y, z, size, block){
        this.boxes.push(this.formatBox(
                x, y, z,
                (x + size.x),
                (y + size.y),
                (z + size.z), 
                block
            )
        );
    }

    this.createCondition = function(x, y, z, mode){
        var model = this;
        var condition = {
            x: x, y: y, z: z,
            mode: Math.max(0, mode || 0),

            boxes: [],
            
            addBoxF: function(x1, y1, z1, x2, y2, z2, block){
                this.boxes.push(model.formatBox(x1, y1, z1, x2, y2, z2, block));
            },

            addBox: function(x, y, z, size, block){
                this.boxes.push(model.formatBox(
                        x, y, z,
                        (x + size.x),
                        (y + size.y),
                        (z + size.z), 
                        block
                    )
                );
            },

            tiles: {},
            tileGroups: [],
            
            addBlock: function(id, data){
                var convertedId = block.id * 16 + (block.datadata || 0);
                this.tiles[convertedId] = true;
            },
            
            addBlockGroup: function(name){
                this.tileGroups.push(name);
            },
            
            addBlockGroupFinal: function(name){
                var group = ICRenderLib.getConnectionGroup(name);
                for (var id in group){
                    this.tiles[id] = true;
                }
            },
            
            writeCondition: function(){
                var output = parseInt(this.x) + " " + parseInt(this.y) + " " + parseInt(this.z) + " " + parseInt(this.mode) + "\n";
                
                for (var i in this.tileGroups){
                    this.addBlockGroupFinal(this.tileGroups[i]);
                }
                
                var blocks = [];
                for(var id in this.tiles){
                    blocks.push(id);
                }
                output += blocks.length + " " + blocks.join(" ") + "\n" + condition.boxes.length + "\n";
                
                for(var i in condition.boxes){
                    output += condition.boxes[i].join(" ") + "\n";
                }
                
                return output;
            }
        };

        this.dynamic.push(condition);
        return condition;
    }
    
    this.connections = {};
    this.connectionGroups = [];
    this.connectionWidth = 0.5;
    this.hasConnections = false;
    
    this.setConnectionWidth = function(width){
        this.connectionWidth = width;
    }
    
    this.addConnection = function(id, data){
        var convertedId = id * 16 + (data || 0);
        this.connections[convertedId] = true;
        this.hasConnections = true;
    }
    
    this.addConnectionGroup = function(name){
        this.connectionGroups.push(name);
        this.hasConnections = true;
    }
    
    this.addConnectionGroupFinal = function(name){
        var group = ICRenderLib.getConnectionGroup(name);
        for (var id in group){
            this.connections[id] = true;
        }
    }
    
    this.addSelfConnection = function(){
        this.connections[this.convertedId] = true;
        this.hasConnections = true;
    }
    
    this.writeAsId = function(id){
        var output = "";
        output += id + " " + (this.hasConnections ? 1 : 0) + "\n";
        output += this.boxes.length + "\n";
        
        for (var i in this.boxes){
            output += this.boxes[i].join(" ") + "\n";
        }

        output += this.dynamic.length + "\n";
        for(var i in this.dynamic){
            var condition = this.dynamic[i];
            output += condition.writeCondition();
        }
        
        for (var i in this.connectionGroups){
            this.addConnectionGroupFinal(this.connectionGroups[i]);
        }
        
        var connections = [];
        for (var id in this.connections){
            connections.push(id);
        }
        
        output += connections.length + " " + this.connectionWidth + "\n" + connections.join(" ");
        return output;
    }
}


if (!ICRenderLib){
    var ICRenderLib = {
        /* model registry */
        tileModels: {},
        
        registerTileModel: function(convertedId, model){
            this.tileModels[convertedId] = model;
        },
        
        /* output */
        writeAllData: function(){
            var output = "";
            var count = 0;
            for (var id in this.tileModels){
                output += this.tileModels[id].writeAsId(id) + "\n\n";
                count++;
            }
            
            output = count + "\n\n" + output;
            FileTools.WriteText("games/com.mojang/mods/icrender", output);
        },
        
        /* connection groups functions */
        connectionGroups: {},
        
        addConnectionBlockWithData: function(name, blockId, blockData){
            var group = this.connectionGroups[name];
            if (!group){
                group = {};
                this.connectionGroups[name] = group;
            }
            
            group[blockId * 16 + blockData] = true;
        },
        
        addConnectionBlock: function(name, blockId){
            for (var data = 0; data < 16; data++){
                this.addConnectionBlockWithData(name, blockId, data);
            }
        },
        
        addConnectionGroup: function(name, blockIds){
            for (var i in blockIds){
                this.addConnectionBlock(name, blockIds[i]);
            }
        },
        
        getConnectionGroup: function(name){
            return this.connectionGroups[name];
        },
        
        
        /* standart models */
        registerAsWire: function(id, connectionGroupName, width){
            width = width || 0.5;
            
            var model = new TileRenderModel(id, 0);
            model.addConnectionGroup(connectionGroupName);
            model.addSelfConnection();
            model.setConnectionWidth(width);
            model.addBox(.5 - width / 2.0, .5 - width / 2.0, .5 - width / 2.0, {
                x: width,
                y: width,
                z: width,
            });
            
            this.addConnectionBlock(connectionGroupName, id);
        }
    };
    
    
    ModAPI.registerAPI("ICRenderLib", ICRenderLib);
    Callback.addCallback("PostLoaded", function(){
        ICRenderLib.writeAllData();
    });
    Logger.Log("ICRender API was created and shared by " + __name__ + " with name ICRenderLib", "API");
}




/**

// exampe of block model

Block.setPrototype("pillar", {
    getVariations: function(){
        return [
            {name: "Pillar", texture: [["cobblestone", 0]], inCreative: true}
        ]
    }
});
Block.setBlockShape(BlockID.pillar, {x: 0.25, y: 0, z: 0.25},  {x: 0.75, y: 1, z: 0.75})

var pillarRender = new TileRenderModel(BlockID.pillar);

var pillarCondition1 = pillarRender.createCondition(0, -1, 0, 1);
var pillarCondition2 = pillarRender.createCondition(0, 1, 0, 1);
pillarCondition1.addBlock(BlockID.pillar, 0);
pillarCondition2.addBlock(BlockID.pillar, 0);

for(var i = 0; i < 4; i++){
    pillarCondition1.addBoxF(i / 16, i / 16, i / 16, 1.0 - i / 16, (i + 1) / 16, 1.0 - i / 16);
    pillarCondition2.addBoxF(i / 16, 1.0 - (i + 1) / 16, i / 16, 1.0 - i / 16, 1.0 - i / 16, 1.0 - i / 16);
}

pillarRender.addBoxF(0.25, 0.0, 0.25, 0.75, 1.0, 0.75, {id: 5, data: 2});

*/



var ModelHelper = {
    Texture: function(name, offset, size) {
        this.name = name;
        this.offset = offset;
        this.size = size;
        
        this.getUV = function(){
            return this.offset;
        }
        
        this.getSize = function(){
            return this.size;
        }
        
        this.getTexture = function(){
            return this.name;
        }
        
        this.textureMatches = function(texture){
            return this.name == texture.name;
        }
    },
    
}


var LiquidModels = {
 registerSkin: function(liquid){
  LiquidRegistry.getLiquidData(liquid).modelTextures.push("images/model/buildcraft_" + liquid + "_atlas.png");
 },

 getRender: function(w, d, h){
  var render = new Render({name: "liquidModel" + [w, d, h]});
  if (render.isEmpty){
   render.setPart("body", [{
    type: "box",
    
    uv: {x: 0, y: 0},

    coords: {x: w/2, y: 24 - d/2, z: h/2},

    size: {x: w, y: d, z: h}
   }], {width: 128, height: 64});
   render.saveState("liquidModel" + [w, d, h]);
  }
  return render;
 },

 getModelSkin: function(liquid){
  var liquid = LiquidRegistry.getLiquidData(liquid);
  return liquid ? liquid.modelTextures[0] : "images/model/buildcraft_water_atlas.png";
 },

 getModelData: function(liquid, w, d, h){
  var skin = this.getModelSkin(liquid);
  var render = this.getRender(w, d, h);
  return {
   skin: skin,
   renderAPI: render,
   firmRotation: true,
   hitbox: {width: .0, height: .0}
  };
 },

 getLiquidRender: function(w, d, h, directions){
  var key = "transportedLiquid" + [w, d, h] + " " + JSON.stringify(directions, ["x", "y", "z"]);
  var render = new Render({name: key});
  if (render.isEmpty){
   var modelData = [{
     type: "box",
    
     uv: {x: 0, y: 0},

     coords: {x: w/2, y: 24 - d/2, z: h/2},

     size: {x: w, y: d, z: h}
   }];
   for (var dir in directions){
    var direct = directions[dir];
    modelData.push({
     type: "box",

     uv: {x: 0, y: 0},

     coords: {x: w/2 + w*direct.x, y: 24 - d/2 + d*direct.y, z: h/2 + h*direct.z},

     size: {x: w, y: d, z: h}
    });
   }
   render.setPart("body", modelData, {width: 128, height: 64});
   render.saveState(key);
  }
  return render;
 }
};

LiquidModels.registerSkin("water");
LiquidModels.registerSkin("lava");
LiquidModels.registerSkin("milk");


var IndustrialCraftAPI = null;

ModAPI.addAPICallback("ICore", function(ICore){
    IndustrialCraftAPI = ICore;
});

Callback.addCallback("PostLoaded", function(){
    if (IndustrialCraftAPI){
        Callback.invokeCallback("BC-DefineEngines", IndustrialCraftAPI);
        Callback.invokeCallback("BC-ICore", IndustrialCraftAPI);
    }
    else{
        Callback.invokeCallback("BC-DefineEngines", null);
    }
});


var TRANSPORTING_CACHE_DEBUG = false;

var TransportingCache = {
    cache: [],
    
    debug: {
        calls: 0,
        overrides: 0,
    },
    
    clear: function(){
        this.cache = [];
    },
    
    registerInfo: function(x, y, z, info){
        var key = x + "." + y + "." + z;
        this.cache[key] = info;
    },
    
    getInfo: function(x, y, z, info){
        var key = x + "." + y + "." + z;
        return this.cache[key];
    },
}


Callback.addCallback("LevelLoaded", function(){
    TransportingCache.clear();
});

Callback.addCallback("ItemUse", function(){
    TransportingCache.clear();
});

Callback.addCallback("DestroyBlock", function(){
    TransportingCache.clear();
});


/*
 * Debug output
*/
if (TRANSPORTING_CACHE_DEBUG){
    TransportingCache.registerInfo = function(x, y, z, info){
        this.debug.overrides++;
        var key = x + "." + y + "." + z;
        this.cache[key] = info;
    };
    
    TransportingCache.getInfo = function(x, y, z, info){
        this.debug.calls++;
        var key = x + "." + y + "." + z;
        return this.cache[key];
    };
    
    TransportingCache.debugTick = function(){
        Game.tipMessage(JSON.stringify(this.debug, "\t"));
        this.debug.calls = 0;
        this.debug.overrides = 0;
    };
    
    Callback.addCallback("tick", function(){
        TransportingCache.debugTick();
    });
}


var TRANSPORTING_CACHE_DEBUG = false;

var LiquidTransportingCache = {
    cache: [],
    
    debug: {
        calls: 0,
        overrides: 0,
    },
    
    clear: function(){
        this.cache = [];
    },
    
    registerInfo: function(x, y, z, info){
        var key = x + "." + y + "." + z;
        this.cache[key] = info;
    },
    
    getInfo: function(x, y, z, info){
        var key = x + "." + y + "." + z;
        return this.cache[key];
    },
}


Callback.addCallback("LevelLoaded", function(){
    LiquidTransportingCache.clear();
});

Callback.addCallback("ItemUse", function(){
    LiquidTransportingCache.clear();
});

Callback.addCallback("DestroyBlock", function(){
    LiquidTransportingCache.clear();
});


var LiquidMap = {
    cache: {},
    
    clear: function(){
        this.cache = {};
    },
    
    registerLiquid: function(x, y, z, info){
        var key = x + "." + y + "." + z;
        this.cache[key] = info;
    },
    
    getLiquid: function(x, y, z){
        var key = x + "." + y + "." + z;
        return this.cache[key];
    },

  deleteLiquid: function(x, y, z){
   var key = x + "." + y + "." + z;
     delete this.cache[key];

  }
};

Callback.addCallback("LevelLeft", function(){
    LiquidMap.clear();
});


function denyTransporting(id, item, fluid){
    if (item){
        ItemTransportingHelper.TransportingDenied[id] = true;
    }
    if (fluid){
        LiquidTransportHelper.DownloadingDenied[id] = true;
    }
};

var ItemTransportingHelper = {
    PipeTiles: {
        // connection types are registred with render connections
    },
    
    PipeParams: {
        // params like friction are stored here
    },
    
    TransportingDenied: {
        // TODO: add all blocks
    },
    
    BasicItemContainers: {
        54: true,
        61: true,
        62: true
    },
    
    registerItemPipe: function(pipe, type, params){
        this.PipeTiles[pipe] = type;
        if (!params){
            params = {};
        }
        if (!params.friction){
            params.friction = 0;
        }
        this.PipeParams[pipe] = params;
    },
    
    isPipe: function(block){
        return this.PipeTiles[block];
    },
    
    canPipesConnect: function(pipe1, pipe2){
        var type1 = this.PipeTiles[pipe1] || ITEM_PIPE_CONNECTION_ANY;
        var type2 = this.PipeTiles[pipe2] || ITEM_PIPE_CONNECTION_ANY;
        return type1 == type2 || type1 == ITEM_PIPE_CONNECTION_ANY || type2 == ITEM_PIPE_CONNECTION_ANY;
    },
    
    canTransportTo: function(pipe, x, y, z){
        var block = World.getBlock(x, y, z).id;
        if (this.BasicItemContainers[block])
            return true; 
        if (block > 4096 && !this.TransportingDenied[block]){
            return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
        }
        return false;
    },
    
    findNearbyContainers: function(position){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            var container = World.getContainer(position.x + dir.x, position.y + dir.y, position.z + dir.z);
            if (container){
                var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
                if (!this.TransportingDenied[block]){
                    possibleDirs.push(dir);
                }
            }
        }
        return possibleDirs;
    },
    
    findBasicDirections: function(pipe, position, direction, checkBackwardDirection){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            if (checkBackwardDirection && dir.x == -direction.x && dir.y == -direction.y && dir.z == -direction.z){
                continue;
            }
            if (this.canTransportTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)){
                possibleDirs.push(dir);
            }
        }
        return possibleDirs;
    },
    
    filterDirections: function(listOfDirs, itemDirection){
        var resultDirs = [];
        for (var i in listOfDirs){
            var dir = listOfDirs[i];
            if (!(dir.x == -itemDirection.x && dir.y == -itemDirection.y && dir.z == -itemDirection.z)){
                resultDirs.push(dir);
            }
        }
        return resultDirs;
    },
    
    getPathData: function(transportedItem, item, position, direction){
        position = {
            x: Math.floor(position.x),
            y: Math.floor(position.y),
            z: Math.floor(position.z),
        };
        
        // cache block start
        var cachedData = TransportingCache.getInfo(position.x, position.y, position.z);
        if (!cachedData){
            // get block
            var pipeTile = World.getBlock(position.x, position.y, position.z).id;
            var pipeParams = this.PipeParams[pipeTile];
            var inPipe = this.isPipe(pipeTile);
            // get tile entity
            var container = World.getContainer(position.x, position.y, position.z);
            var tileEntity = container && container.tileEntity;
            // get dirs
            var possibleDirs = this.findBasicDirections(pipeTile, position, direction, false);
            // cache
            cachedData = {
                tileEntity: tileEntity,
                container: container,
                inPipe: inPipe,
                possibleDirs: possibleDirs,
                // params
                friction: pipeParams ? pipeParams.friction : 0
            };
            TransportingCache.registerInfo(position.x, position.y, position.z, cachedData);
        }
        // cache block end
        
        var resultDirs = this.filterDirections(cachedData.possibleDirs, direction);
        var acceleration = 0;
        if (cachedData.tileEntity){
            if (cachedData.tileEntity.getTransportedItemDirs){
                resultDirs = cachedData.tileEntity.getTransportedItemDirs(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
            }
            if (cachedData.tileEntity.getItemAcceleration){
                acceleration = cachedData.tileEntity.getItemAcceleration(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
            }
        }
        
        return {
            inPipe: cachedData.inPipe,
            directions: resultDirs,
            container: cachedData.container,
            tileEntity: cachedData.tileEntity,
            // params
            acceleration: acceleration,
            friction: cachedData.friction
        };
    }
}


var LiquidTransportHelper = {
 DownloadingDenied: {

 },

 PipeTiles: {

 },

 registerFluidPipe: function(id, connectType){
  this.PipeTiles[id] = connectType;
 },

 isPipe: function(blockID){
  return this.PipeTiles[blockID];
 },

 canPipesConnect: function(pipe1, pipe2){
        var type1 = this.PipeTiles[pipe1] || FLUID_PIPE_CONNECTION_ANY;
        var type2 = this.PipeTiles[pipe2] || FLUID_PIPE_CONNECTION_ANY;
        return type1 == type2 || type1 == FLUID_PIPE_CONNECTION_ANY || type2 == FLUID_PIPE_CONNECTION_ANY;
    },

  findNearbyLiquidStorages: function(position){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            var tileentity = World.getTileEntity(position.x + dir.x, position.y + dir.y, position.z + dir.z);
            if (tileentity && tileentity.liquidStorage){
                var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
                if (!this.DownloadingDenied[block]){
                    possibleDirs.push(dir);
                }
            }
        }
        return possibleDirs;
    },

  canDownloadTo: function(pipe, x, y, z){
        var block = World.getBlock(x, y, z).id;
        if (block >= 8192 && !this.DownloadingDenied[block]){
            return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
        }
        return false;
    },

  locateLiquidPipes: function(x, y, z){
   var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
    var pipes = [];
    var pipe = World.getBlock(x, y, z).id;
   for (var d in directions){
    var dir = directions[d];
    var block = World.getBlock(x + dir.x, y + dir.y, z + dir.z).id;
    if (!this.DownloadingDenied[block] && this.isPipe(block) && this.canPipesConnect(pipe, block)){
     pipes.push(dir);
    }
   }
   return pipes;
  },

  findBasicDirections: function(pipe, position){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            if (this.canDownloadTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)){
                possibleDirs.push(dir);
            }
        }
        return possibleDirs;
    },

 getEnviromentData: function(position){
  var directions = LiquidTransportingCache.getInfo(position.x, position.y, position.z);

  if (!directions){
   var id = World.getBlock(position.x, position.y, position.z).id;
   var inPipe = this.isPipe(id) ? true : false;
   directions = this.findBasicDirections(id, position);

   for (var d in directions){
    var direction = directions[d];
    var tileentity = World.getTileEntity(direction.x + position.x, direction.y + position.y, direction.z + position.z);
    if (tileentity){
     directions[d] = tileentity;
    }
    else{
     for (var pos in position){
      directions[d][pos] += position[pos];
     }
    }
   }
  
   var directions = {
    inPipe: inPipe,
    directions: directions
   };
 LiquidTransportingCache.registerInfo(position.x, position.y, position.z, directions);
  }

  return directions;
 },

 flushLiquid: function(position, liquid, amount){
  var data = LiquidMap.getLiquid(position.x, position.y, position.z);
  if (!data){
    data = TransportedLiquid.deploy(position.x, position.y, position.z, liquid, amount);
    return 0;
  }
  data.addAmount(liquid, amount);
  return 0;
 },

 

 downloadToStorage: function(storage, liquid, amount){
  storage.addLiquid(liquid, amount);
 },

 extractFromStorage: function(storage, amount){
  var liquidStored = storage.getLiquidStored();
  return liquidStored ? storage.getLiquid(liquidStored, amount) : 0;
 }
};

Callback.addCallback("PostLoaded", function(){
 denyTransporting(BlockID.pipeFluidWooden, false, true);
 denyTransporting(BlockID.pipeFluidEmerald, false, true);
});


var EngineModelPartRegistry = {
    models: {},
    
    Add: function(name, model){
        this.models[name] = model;
    },
    
    Get: function(name){
        return this.models[name];
    }
};

EngineModelPartRegistry.Add("trunkBlue0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlue2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkGreen0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkGreen2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkOrange0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkOrange2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 64}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("trunkRed0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkRed2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 96}, {width: 512, height: 512}));


EngineModelPartRegistry.Add("engineWood0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 0}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineStone0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 32}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineIron0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 64}, {width: 512, height: 512}));

EngineModelPartRegistry.Add("engineElectric0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineElectric1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineElectric2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 96}, {width: 512, height: 512}));


var ENGINE_TYPE_WOOD = "Wood";
var ENGINE_TYPE_STONE = "Stone";
var ENGINE_TYPE_IRON = "Iron";
var ENGINE_TYPE_ELECTRIC = "Electric";
var ENGINE_TYPE_ELECTRIC_ADVANCED = "AdvElectric";

var ENGINE_HEAT_BLUE = "Blue";
var ENGINE_HEAT_GREEN = "Green";
var ENGINE_HEAT_ORANGE = "Orange";
var ENGINE_HEAT_RED = "Red";

var ENGINE_HEAT_ORDER = [
    ENGINE_HEAT_BLUE,
    ENGINE_HEAT_GREEN,
    ENGINE_HEAT_ORANGE,
    ENGINE_HEAT_RED
];

var ENGINE_ROTATION_Y = 0;
var ENGINE_ROTATION_X = 1;
var ENGINE_ROTATION_Z = 2;

var ENGINE_TYPE_DATA = {};

function getEngineType(type){
    return ENGINE_TYPE_DATA[type];
}

function getEngineTypeValue(type, method){
    if (ENGINE_TYPE_DATA[type]){
        return ENGINE_TYPE_DATA[type][method];
    }
}


var EngineModelHelper = {
    init: function(){
        
    },
    
    createPiston: function(type, heat, rotation, direction, position){
        var pistonMaterial = EngineModelPartRegistry.Get("engine" + type + rotation);
        var trunkMaterial = EngineModelPartRegistry.Get("trunk" + heat + rotation);
        
        var coords = {
            x: 0,
            y: 0, 
            z: 0
        };
        
        switch (rotation){
            case ENGINE_ROTATION_X:
            coords.x = direction;
            break;
            case ENGINE_ROTATION_Y:
            coords.y = direction;
            break;
            case ENGINE_ROTATION_Z:
            coords.z = direction;
            break;
        };
        
        var renderName = [type, heat, rotation, direction, position] + "";
        var render = new Render({name: renderName});
        if (render.isEmpty){
            var yOffset = 31;
            
            var modelData = [{
                type: "box",
                uv: pistonMaterial.getUV(),
                coords: {
                    x: 0 + coords.x * 6,
                    y: yOffset + coords.y * 6,
                    z: 0 + coords.z * 6,
                },
                size: {
                    x: 4 + 12 * (1 - Math.abs(coords.x)),
                    y: 4 + 12 * (1 - Math.abs(coords.y)),
                    z: 4 + 12 * (1 - Math.abs(coords.z))
                }
            },
            {
                type: "box",
                uv: pistonMaterial.getUV(),
                coords: {
                    x: 0 + coords.x * (2 - position / 3),
                    y: yOffset + coords.y * (2 - position / 3),
                    z: 0 + coords.z * (2 - position / 3),
                },
                size: {
                    x: 4 + 12 * (1 - Math.abs(coords.x)),
                    y: 4 + 12 * (1 - Math.abs(coords.y)),
                    z: 4 + 12 * (1 - Math.abs(coords.z))
                }
            }];
            
            if (pistonMaterial.textureMatches(trunkMaterial)){
                modelData.push({
                    type: "box",
                    uv: trunkMaterial.getUV(),
                    coords: {
                        x: 0 - coords.x * .1,
                        y: yOffset - coords.y * .1,
                        z: 0 - coords.z * .1
                    },
                    size: {
                        x: 8 + 8 * (Math.abs(coords.x)),
                        y: 8 + 8 * (Math.abs(coords.y)),
                        z: 8 + 8 * (Math.abs(coords.z))
                    }
                });
            }
            render.setPart("body", modelData, pistonMaterial.getSize());
            render.saveState(renderName);
        }
        else{
            //alert("render already cached: " + renderName);
        }
        
        return {
            skin: pistonMaterial.getTexture(),
            renderAPI: render,
            firmRotation: true,
            hitbox: {
                width: .0,
                height: .0
            }
        };
    }
}




IDRegistry.genBlockID("bcEngine");
Block.createBlock("bcEngine", [
    {name: "bcEngine", texture: [["empty", 0]], inCreative: false}
], BLOCK_TYPE_ITEM_PIPE);

Block.registerDropFunction("bcEngine", function(){
    return [];
});

Block.setBlockShape(BlockID.bcEngine, {x: 1 / 16, y: 1 / 16, z: 1 / 16}, {x: 15 / 16, y: 15 / 16, z: 15 / 16});

denyTransporting(BlockID.bcEngine, true, true);



var BUILDCRAFT_ENGINE_PROTOTYPE = {
    defaultValues:{
        type: null,
        rotation: 0,
        direction: 1,
        heatStage: ENGINE_HEAT_BLUE,
        
        rotationIndex: 0,
        redstone: false,
        
        position: 24, // low piston position
        energy: 0,
        heat: 0,
        power: 0,
        targetPower: 0
    },
    
    destroyAnimation: function(){
        if (this.animationPiston){
            this.animationPiston.destroy();
            this.animationPiston = null;
        }
    },
    
    reloadAnimation: function(){
        this.destroyAnimation();
        
        var engineValues = this.data;
        this.animationPiston = new Animation.Base(this.x + .5, this.y + 15 / 16, this.z + .5);
        this.animationPiston.loadCustom(function(){
            var animData = EngineModelHelper.createPiston(engineValues.type, engineValues.heatStage, engineValues.rotation, engineValues.direction, Math.abs(parseInt(engineValues.position) % 48 - 24));
            this.describe(animData);
            this.refresh();
        });
    },
    
    findRotations: function(){
        var directions = [
            {x: -1, y: 0, z: 0, rotation: ENGINE_ROTATION_X, direction: 1},
            {x: 1, y: 0, z: 0, rotation: ENGINE_ROTATION_X, direction: -1},
            {x: 0, y: -1, z: 0, rotation: ENGINE_ROTATION_Y, direction: -1},
            {x: 0, y: 1, z: 0, rotation: ENGINE_ROTATION_Y, direction: 1},
            {x: 0, y: 0, z: -1, rotation: ENGINE_ROTATION_Z, direction: -1},
            {x: 0, y: 0, z: 1, rotation: ENGINE_ROTATION_Z, direction: 1},
        ];
        
        this.rotationDirections = [];
        for (var i in directions){
            var dir = directions[i];
            var tileEntity = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z);
            if (tileEntity){
                dir.tileEntity = tileEntity;
                this.rotationDirections.push(dir);
            }
        }
        
        var dir = this.rotationDirections[this.data.rotationIndex % this.rotationDirections.length];
        if (dir){
            this.targetTileEntity = dir.tileEntity;
            this.data.rotation = dir.rotation;
            this.data.direction = dir.direction;
        }
        else{
            this.targetTileEntity = null;
            this.data.rotation = ENGINE_ROTATION_Y;
            this.data.direction = 1;
        }
    },
    
    getLookCoords: function(){
        var coords = {x: 0, y: 1, z: 0};
        if (this.data.rotation == ENGINE_ROTATION_X){
            var coords = this.data.direction > 0 ? {x: -1, y: 0, z: 0} : {x: 1, y: 0, z: 0};
        }
        if (this.data.rotation == ENGINE_ROTATION_Y){
            var coords = this.data.direction > 0 ? {x: 0, y: 1, z: 0} : {x: 0, y: -1, z: 0};
        }
        if (this.data.rotation == ENGINE_ROTATION_Z){
            var coords = this.data.direction > 0 ? {x: 0, y: 0, z: 1} : {x: 0, y: 0, z: -1};
        }
        return {
            x: this.x + coords.x,
            y: this.y + coords.y,
            z: this.z + coords.z,
        };
    },
    
    updateTargetTileEntity: function(){
        if (this.targetTileEntity && this.targetTileEntity.remove){
            this.targetTileEntity = null;
        }
        if (!this.targetTileEntity){
            var coords = this.getLookCoords();
            this.targetTileEntity = World.getTileEntity(coords.x, coords.y, coords.z);
        }
    },
    
    MJEnergyDeploy: function(amount, generator, params){
        params = params || {};
        if (!params.chain){
            params.chain = 1;
        }
        if (params.chain++ > 15){
            return;
        }
        if (generator != this.targetTileEntity){
            this.updateTargetTileEntity();
            this.deployMJEnergy(amount, params, generator);
            this.data.heat += 3;
        }
    },
    
    deployEnergyToTarget: function(){
        if (this.energyDeploy){
            this.updateTargetTileEntity();
            var params = {
                directDeploy: false,
                deployTarget: null,
                extra: null
            };
            if (this.targetTileEntity){
                params.directDeploy = true;
                params.deployTarget = this.targetTileEntity;
            }
            
            var amount = this.energyDeploy(params);
            this.deployMJEnergy(amount, params.extra);
        }
    },
    
    deployMJEnergy: function(amount, extra, customGenerator){
        if (amount){
            if (this.targetTileEntity){
                if (this.targetTileEntity.MJEnergyDeploy){
                    this.targetTileEntity.MJEnergyDeploy(amount, customGenerator || this, extra);
                }
            }
            else{
                
            }
        }
    },
    
    
    
    
    setPower: function(power){
        this.data.targetPower = power;
    },
    
    updatePower: function(){
        var change = .04;
        var add = this.data.targetPower - this.data.power;
        if (add > change){
            add = change;
        }
        if (add < -change){
            add = -change;
        }
        this.data.power += add;
    },

    isPushingForward: function(){
        return this.data.position > 24;
    },
    
    
    
    
    
    
    setEngineType: function(type){
        this.data.type = type;
        var typeData = getEngineType(this.data.type);
        
        if (typeData){
            for (var name in typeData){
                this[name] = typeData[name];
            }
            
            for (var name in typeData.defaultValues){
                this.data[name] = typeData.defaultValues[name];
            }
        }
    },
    
    created: function(){
        this.findRotations();
    },
    
    init: function(){
        this.setEngineType(this.data.type);
        this.reloadAnimation();
    },
    
    tick: function(){
        // update basic
        this.data.position += this.data.power;
        this.updatePower();
        // 
        if (this.engineTick){
            this.engineTick();
        }
        if (this.getHeatStage){
            this.data.heatStage = ENGINE_HEAT_ORDER[Math.min(3, Math.max(0, this.getHeatStage() || 0))];
        }
        if (this.data.position > 48){
            this.data.position -= 48;
            this.deployEnergyToTarget();
        }
    },
    
    click: function(id, count, data){
        if (id == ItemID.bcWrench){
            this.data.rotationIndex++;
            this.findRotations();
            return true;
        }
    },
    
    redstone: function(signal){
        this.data.redstone = signal.power > 8;
    },
    
    getGuiScreen: function(){
        if (this.getEngineGui){
            return this.getEngineGui();
        }
    },
    
    destroy: function(){
        this.destroyAnimation();
        if (this.getItemDrop){
            var drop = this.getItemDrop();
            for (var i in drop){
                World.drop(this.x + .5, this.y + .5, this.z + .5, drop[i][0] || 0, drop[i][1] || 1, drop[i][2] || 0);
            }
        }
    }
};

Callback.addCallback("BC-DefineEngines", function(ICore){
    if (ICore){
        ICore.Machine.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
    }
    else{
        TileEntity.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
    }
});


ENGINE_TYPE_DATA[ENGINE_TYPE_WOOD] = {
    getGuiScreen: function(){
        return null;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineWooden, 1, 0]];
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 100;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 100;
        if (this.data.redstone){
            this.setPower(this.getHeatStage() + .4);
            if (this.isPushingForward()){
                this.data.heat += .2;
            }
            else{
                this.data.heat -= .1;
            }
        }
        else{
            this.setPower(0);
            this.data.heat -= .1;
        }
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
    },
    
    energyDeploy: function(params){
        if (params.directDeploy){
            return 1;
        }
        return 0;
    }
};


var guiStoneEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Stirling Engine"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 445, y: 120, bitmap: "fire_background", scale: 5}
    ],
    
    elements: {
        "burningScale": {type: "scale", x: 445, y: 120, direction: 1, value: 0.5, bitmap: "fire_scale", scale: 5},
        "slotFuel": {type: "slot", x: 441, y: 212, size: 80},
        "textInfo1": {type: "text", x: 545, y: 180, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 655, y: 180, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});

ENGINE_TYPE_DATA[ENGINE_TYPE_STONE] = {
    defaultValues: {
        burn: 0,
        maxBurn: 0,
        overheat: 0
    },
    
    getItemDrop: function(){
        return [[ItemID.engineStone, 1, 0]];
    },
    
    getGuiScreen: function(){
        return guiStoneEngine;
    },
    
    energyDeploy: function(){
        return 32;
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 800;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        if (this.data.overheat > 0){
            return 3;
        }
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 800;
        var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
        
        if (this.data.overheat > 0){
            this.data.overheat--;
            this.data.heat -= .2;
            this.setPower(0);
        }
        
        else if (this.data.redstone && this.data.burn > 0){
            this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
            if (this.isPushingForward()){
                this.data.heat += .8 * heatRatio;
            }
            else{
                this.data.heat -= .4 * heatRatio;
            }
            this.data.burn--;
        }
        else{
            this.setPower(0);
            this.data.heat -= .2;
        }
        
        if (this.data.burn <= 0){
            this.data.burn = this.data.maxBurn = getFuelForStoneEngine(this.container, "slotFuel") * 2;
        }
        
        this.container.setScale("burningScale", this.data.burn / this.data.maxBurn || 0);
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
        this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (this.data.burn <= 0 ? ": NO FUEL" : "")));
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
        if (this.data.heat == MAX_HEAT){
            this.data.overheat = 2400; // 120 secs
        }
    }
};


function getFuelForStoneEngine(container, slotName){
    var fuelSlot = container.getSlot(slotName);
    if (fuelSlot.id > 0){
        var burn = FURNACE_FUEL_MAP[fuelSlot.id];
        if (burn){
            fuelSlot.count--;
            container.validateSlot(slotName);
            return burn;
        }
        if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
            var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
            fuelSlot.id = empty.id;
            fuelSlot.data = empty.data;
            return 20000;
        }
    }
    return 0;
}


var guiIronEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "ICE"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 550, y: 30, bitmap: "liquid_scale_40x8_background", scale: 4}
    ],
    
    elements: {
        "liquidScale": {type: "scale", x: 554, y: 34, direction: 1, value: 0.5, bitmap: "liquid_scale_40x8_empty", overlay: "liquid_scale_40x8_overlay", scale: 4},
        "liquidSlot1": {type: "slot", x: 421, y: 54, size: 80},
        "liquidSlot2": {type: "slot", x: 421, y: 254, size: 80},
        "textInfo1": {type: "text", x: 685, y: 150, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 685, y: 200, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});

var ENGINE_IRON_FUEL_DATA = {
    "lava": 2500,
    "oil": 7500,
    "fuel": 12500,
    "biofuel": 12500
};

ENGINE_TYPE_DATA[ENGINE_TYPE_IRON] = {
    defaultValues: {
        overheat: 0
    },
    
    getGuiScreen: function(){
        return guiIronEngine;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineIron, 1, 0]];
    },
    
    energyDeploy: function(){
        return 128;
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 1200;
        var index = parseInt(this.data.heat / MAX_HEAT * 3);
        if (this.data.overheat > 0){
            return 3;
        }
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 1200;
        var heatRatio = (MAX_HEAT - this.data.heat) / MAX_HEAT + .1;
        
        var liquidStored = this.liquidStorage.getLiquidStored();
        var fuelTicks = ENGINE_IRON_FUEL_DATA[liquidStored];
        
        if (this.data.overheat > 0){
            this.data.overheat--;
            this.data.heat -= .2;
            this.setPower(0);
        }
        else if (this.data.redstone && fuelTicks && this.liquidStorage.getLiquid(liquidStored, 1.0 / fuelTicks, true)){
            this.setPower(parseInt(this.data.heat / MAX_HEAT * 3) + .4);
            if (this.isPushingForward()){
                this.data.heat += 1.21 * heatRatio;
            }
            else{
                this.data.heat -= .4 * heatRatio;
            }
        }
        else{
            this.setPower(0);
            this.data.heat -= .2;
        }
        
        var slot1 = this.container.getSlot("liquidSlot1");
        var slot2 = this.container.getSlot("liquidSlot2");
        var emptyItem = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
        this.liquidStorage.setLimit(null, 8);
        
        if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)){
            if (this.liquidStorage.addLiquid(emptyItem.liquid, 1, true) < 1){
                if (slot2.id == emptyItem.id && slot2.data == emptyItem.data && slot2.count < Item.getMaxStack(emptyItem.id) || slot2.id == 0){
                    slot1.count--;
                    slot2.id = emptyItem.id;
                    slot2.data = emptyItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        
        this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C");
        this.container.setText("textInfo2", (this.data.redstone ? "ON" : "OFF") + (this.data.overheat > 0 ? ": OVERHEATED" : (!fuelTicks ? ": NO FUEL" : "")));
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
        if (this.data.heat == MAX_HEAT){
            this.data.overheat = 3600; // 180 secs
        }
    }
};



var guiElectricEngine = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Electric Engine"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 400, y: 30, bitmap: "electric_scale_background", scale: 10.0 / 3.0}
    ],
    
    elements: {
        "energyScale": {type: "scale", x: 400, y: 30, direction: 1, value: 0.5, bitmap: "electric_scale", scale: 10.0 / 3.0},
        "textInfo1": {type: "text", x: 535, y: 150, width: 300, height: 50, font: STD_FONT_MEDIUM, text: ""},
        "textInfo2": {type: "text", x: 535, y: 200, width: 300, height: 50, font: RED_FONT_MEDIUM, text: ""}
    }
});


ENGINE_TYPE_DATA[ENGINE_TYPE_ELECTRIC] = {
    defaultValues: {
        energyStored: 0,
        pistonDelay: 0,
    },
    
    getGuiScreen: function(){
        return guiElectricEngine;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineElectric, 1, 0]];
    },
    
    getHeatStage: function(){
        var MAX_HEAT = 200;
        var index = parseInt(this.data.heat / MAX_HEAT * 3.5);
        return index;
    },
    
    engineTick: function(){
        var MAX_HEAT = 200;
        if (this.data.redstone && this.data.energyStored > 0){
            this.setPower(this.getHeatStage() + .4);
            if (this.isPushingForward()){
                this.data.heat += .2;
            }
            else{
                this.data.heat -= .1;
            }
            this.data.pistonDelay ++;
        }
        else{
            this.setPower(0);
            this.data.heat -= .1;
            this.data.pistonDelay = 0;
        }
        
        this.container.setScale("energyScale", this.data.energyStored / 50);
        this.container.setText("textInfo1", parseInt(this.data.heat) + "°C   " + (this.data.redstone ? parseInt(this.data.energyInfo * 100 || 0) / 100 + " MJ/t": ""));
        this.container.setText("textInfo2", (this.data.redstone && this.data.energyStored > 0 ? "ON" : "OFF") + (this.data.energyStored > 0 ? "" : ": NO ENERGY"));
        this.container.setTextColor("textInfo2", this.data.redstone && this.data.energyStored > 0 ? android.graphics.Color.GREEN : android.graphics.Color.RED);
        
        this.data.heat = Math.min(Math.max(this.data.heat, 0), MAX_HEAT);
    },
    
    energyDeploy: function(params){
        var energy = this.data.energyStored;
        this.data.energyStored = 0;
        this.data.energyInfo = energy / this.data.pistonDelay;
        this.data.pistonDelay = 0;
        return energy;
    },
    
    energyTick: function(type, src){
        
        var energy = Math.floor(src.get(20)) / 2.5;
        this.data.energyStored += energy;
    }
};


ModAPI.registerAPI("BuildcraftAPI", {
 Transport: {
  Helper: ItemTransportingHelper,
  Item: TransportingItem,
  Liquid: TransportedLiquid,
  Cache: TransportingCache,
  LiquidHelper: LiquidTransportHelper,
  LiquidCache: LiquidTransportingCache,
  LiquidMap: LiquidMap
 },

 ModelHelper: ModelHelper,

 LiquidModelHelper: LiquidModels,

 Engine: {
  Part: EngineModelPartRegistry,
  ModelHelper: EngineModelHelper,
  Prototype: BUILDCRAFT_ENGINE_PROTOTYPE,
  Types: ENGINE_TYPE_DATA
 },

 requireGlobal: function(str){
  return eval(str);
 },

 registerPipe: registerItemPipe,

 registerFluidPipe: setupFluidPipeRender
});

Logger.Log("Buildcraft API shared as BuildcraftAPI", "API");


