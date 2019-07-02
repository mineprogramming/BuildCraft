
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

var LiquidModels = {
    registerSkin: function(liquid) {
        LiquidRegistry.getLiquidData(liquid).modelTextures.push("images/model/buildcraft_" + liquid + "_atlas.png");
    },

    getRender: function(w, d, h) {
        var render = new Render();//{\name: "liquidModel" + [w, d, h]}
        if (render.isEmpty) {
            render.setPart("body", [{
                type: "box",

                uv: {
                    x: 0,
                    y: 0
                },

                coords: {
                    x: w / 2 - 1,
                    y: 24 - d / 2 + 1,
                    z: h / 2 - 1
                },

                size: {
                    x: w,
                    y: d,
                    z: h
                }
            }], {
                width: 128,
                height: 64
            });
        }
        return render;
    },

    getModelSkin: function(liquid) {
        var liquid = LiquidRegistry.getLiquidData(liquid);
        if(liquid){
            return liquid.modelTextures[0].substring(7);
        }
        return "model/buildcraft_water_atlas.png";
    },

    getModelData: function(liquid, w, d, h) {
        var render = this.getRender(w, d, h);
        return {
            render: render.getId(),
            skin:this.getModelSkin(liquid)
        };
    },

    getLiquidRender: function(liquid, w, d, h, directions) {
        var render = new Render({skin: this.getModelSkin(liquid)});
        var modelData = [{
            type: "box",

            uv: {
                x: 0,
                y: 0
            },

            coords: {
                x: w / 2 - 1,
                y: 24 - d / 2 + 1,
                z: h / 2 - 1
            },

            size: {
                x: w,
                y: d,
                z: h
            }
        }];
        for (var dir in directions) {
            var direct = directions[dir];
            modelData.push({
                type: "box",

                uv: {
                    x: 0,
                    y: 0
                },

                coords: {
                    x: w / 2 + w * direct.x - 1,
                    y: 24 - d / 2 + d * direct.y + 1,
                    z: h / 2 + h * direct.z - 1
                },

                size: {
                    x: w,
                    y: d,
                    z: h
                }
            });
        }
        render.setPart("body", modelData, {
            width: 128,
            height: 64
        });

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




Callback.addCallback("PostLoaded", function(){
 denyTransporting(BlockID.pipeFluidWooden, false, true);
 denyTransporting(BlockID.pipeFluidEmerald, false, true);
});




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


