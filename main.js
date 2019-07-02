/*
NIDE BUILD INFO:
  dir: dev
  target: main.js
  files: 25
*/



// file: header.js

/*
 *
 *       :::::::::      :::    :::       :::::::::::       :::        :::::::::            ::::::::       :::::::::           :::        ::::::::::   ::::::::::: 
 *      :+:    :+:     :+:    :+:           :+:           :+:        :+:    :+:          :+:    :+:      :+:    :+:        :+: :+:      :+:              :+:      
 *     +:+    +:+     +:+    +:+           +:+           +:+        +:+    +:+          +:+             +:+    +:+       +:+   +:+     +:+              +:+       
 *    +#++:++#+      +#+    +:+           +#+           +#+        +#+    +:+          +#+             +#++:++#:       +#++:++#++:    :#::+::#         +#+        
 *   +#+    +#+     +#+    +#+           +#+           +#+        +#+    +#+          +#+             +#+    +#+      +#+     +#+    +#+              +#+         
 *  #+#    #+#     #+#    #+#           #+#           #+#        #+#    #+#          #+#    #+#      #+#    #+#      #+#     #+#    #+#              #+#          
 * #########       ########        ###########       ########## #########            ########       ###    ###      ###     ###    ###              ###           
 *
 *
 *  This mod is licenced under GPL-3.0 licence
 *  All rights belong to IchZerowan & #mineprogramming
 *  Original CoreEngine source: Zheka Smirnov
 *  Textures and mod design: Nikich21
 * 
 */

var redstoneInverse = __config__.getBool('inverse_redstone');

Recipes.removeFurnaceRecipe(81);
Recipes.addFurnace(81, 351, 2);




// file: main.js


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
        var render = new Render({
            name: "liquidModel" + [w, d, h]
        });
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
            render: render.getId()
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






// file: translation.js

Translation.addTranslation("Redstone Engine", {ru: "Двигатель на красном камне"});
Translation.addTranslation("Steam Engine", {ru: "Паровой Двигатель"});
Translation.addTranslation("Combustion Engine", {ru: "Двигатель внутреннего сгорания"});
Translation.addTranslation("Creative Engine", {ru: "Творческий Двигатель"});
Translation.addTranslation("Tank", {ru: "Цистерна"});
Translation.addTranslation("Pump", {ru: "Помпа"});

Translation.addTranslation("Wooden Transport Pipe", {ru: "Деревянная транспортная труба"});
Translation.addTranslation("Cobblestone Transport Pipe", {ru: "Булыжниковая транспортная труба"});
Translation.addTranslation("Stone Transport Pipe", {ru: "Каменная транспортная труба"});
Translation.addTranslation("Sandstone Transport Pipe", {ru: "Песчаниковая транспортная труба"});
Translation.addTranslation("Iron Transport Pipe", {ru: "Железная транспортная труба"});
Translation.addTranslation("Golden Transport Pipe", {ru: "Золотая транспортная труба"});
Translation.addTranslation("Obsidian Transport Pipe", {ru: "Обсидиановая транспортная труба"});
Translation.addTranslation("Emerald Transport Pipe", {ru: "Изумрудная транспортная труба"});
Translation.addTranslation("Diamond Transport Pipe", {ru: "Алмазная транспортная труба"});

Translation.addTranslation("Wooden Fluid Pipe", {ru: "Деревянная жидкостная труба"});
Translation.addTranslation("Cobblestone Fluid Pipe", {ru: "Булыжниковая жидкостная труба"});
Translation.addTranslation("Stone Fluid Pipe", {ru: "Каменная жидкостная труба"});
Translation.addTranslation("Iron Fluid Pipe", {ru: "Железная жидкостная труба"});
Translation.addTranslation("Golden Fluid Pipe", {ru: "Золотая жидкостная труба"});
Translation.addTranslation("Emerald Fluid Pipe", {ru: "Изумрудная жидкостная труба"});

Translation.addTranslation("Wrench", {ru: "Гаечный ключ"});
Translation.addTranslation("Wood Gear", {ru: "Деревянная шестерёнка"});
Translation.addTranslation("Stone Gear", {ru: "Каменная шестерёнка"});
Translation.addTranslation("Tin Gear", {ru: "Оловянная шестерёнка"});
Translation.addTranslation("Iron Gear", {ru: "Железная шестерёнка"});
Translation.addTranslation("Gold Gear", {ru: "Золотая шестерёнка"});
Translation.addTranslation("Diamond Gear", {ru: "Алмазная шестерёнка"});
Translation.addTranslation("Pipe Waterproof", {ru: "Водяная изоляция для труб"});




// file: core/TransportedLiquid.js

var LiquidTransportHelper = {
    DownloadingDenied: {

    },

    PipeTiles: {

    },

    registerFluidPipe: function(id, connectType) {
        this.PipeTiles[id] = connectType;
    },

    isPipe: function(blockID) {
        return this.PipeTiles[blockID];
    },

    canPipesConnect: function(pipe1, pipe2) {
        var type1 = this.PipeTiles[pipe1] || FLUID_PIPE_CONNECTION_ANY;
        var type2 = this.PipeTiles[pipe2] || FLUID_PIPE_CONNECTION_ANY;
        return type1 == type2 || type1 == FLUID_PIPE_CONNECTION_ANY || type2 == FLUID_PIPE_CONNECTION_ANY;
    },

    findNearbyLiquidStorages: function(position) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var possibleDirs = [];
        for (var i in directions) {
            var dir = directions[i];
            var tileentity = World.getTileEntity(position.x + dir.x, position.y + dir.y, position.z + dir.z);
            if (tileentity && tileentity.liquidStorage) {
                var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
                if (!this.DownloadingDenied[block]) {
                    possibleDirs.push(dir);
                }
            }
        }
        return possibleDirs;
    },

    canDownloadTo: function(pipe, x, y, z) {
        var block = World.getBlock(x, y, z).id;
        if (block >= 8192 && !this.DownloadingDenied[block]) {
            return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
        }
        return false;
    },

    locateLiquidPipes: function(x, y, z) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var pipes = [];
        var pipe = World.getBlock(x, y, z).id;
        for (var d in directions) {
            var dir = directions[d];
            var block = World.getBlock(x + dir.x, y + dir.y, z + dir.z).id;
            if (!this.DownloadingDenied[block] && this.isPipe(block) && this.canPipesConnect(pipe, block)) {
                pipes.push(dir);
            }
        }
        return pipes;
    },

    findBasicDirections: function(pipe, position) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var possibleDirs = [];
        for (var i in directions) {
            var dir = directions[i];
            if (this.canDownloadTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)) {
                possibleDirs.push(dir);
            }
        }
        return possibleDirs;
    },

    getEnviromentData: function(position) {
        var directions = LiquidTransportingCache.getInfo(position.x, position.y, position.z);

        if (!directions) {
            var id = World.getBlock(position.x, position.y, position.z).id;
            var inPipe = this.isPipe(id) ? true : false;
            directions = this.findBasicDirections(id, position);

            for (var d in directions) {
                var direction = directions[d];
                var tileentity = World.getTileEntity(direction.x + position.x, direction.y + position.y, direction.z + position.z);
                if (tileentity) {
                    directions[d] = tileentity;
                } else {
                    for (var pos in position) {
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

    flushLiquid: function(position, liquid, amount) {
        var data = LiquidMap.getLiquid(position.x, position.y, position.z);
        if (!data) {
            data = TransportedLiquid.deploy(position.x, position.y, position.z, liquid, amount);
            return 0;
        }
        data.addAmount(liquid, amount);
        return 0;
    },



    downloadToStorage: function(storage, liquid, amount) {
        storage.addLiquid(liquid, amount);
    },

    extractFromStorage: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        return liquidStored ? storage.getLiquid(liquidStored, amount) : 0;
    }
};


var TransportedLiquid = new GameObject("bc-transported-liquid", {
    init: function(x, y, z, liquid, amount) {
        this.pos = {
            x: x,
            y: y,
            z: z
        };

        this.liquid = {
            id: liquid,
            amount: amount
        };

        this.frame = 0;

        LiquidMap.registerLiquid(this.pos.x, this.pos.y, this.pos.z, this);

    },

    setLiquid: function(liquid, amount) {
        this.liquid.id = liquid;
        this.liquid.amount = amount;
    },

    addAmount: function(liquid, amount) {
        if (this.liquid.id == liquid || !liquid) this.liquid.amount += amount;
    },

    validate: function() {
        if (!this.liquid || this.liquid.amount <= 0.001 || !this.liquid.id || !this.liquid.amount) {
            this.selfDestroy();
        }
        if (this.liquid.amount >= 0.12) this.liquid.amount = 0.12;
    },

    render: function(pos, dirs) {
        var arr = [];
        for (var a in dirs) {
            arr.push({
                x: dirs[a].x - pos.x,
                y: dirs[a].y - pos.y,
                z: dirs[a].z - pos.z
            });
        }
        this.animation.describe({
            render: LiquidModels.getLiquidRender(this.liquid.id, 6, this.liquid.amount <= 0.12 ? (this.liquid.amount / 20) * 100 : 6, 6, arr).getId()
        });
        this.animation.refresh();
    },


    //pouring

    mean: function(amounts) {
        var mean = 0;
        for (var i in amounts) {
            mean += amounts[i];
        }
        return +((mean / amounts.length).toFixed(3));
    },

    pouringAction: function() {
        var amounts = [this.liquid.amount];
        var deny = [true, true, true, true, true, true];
        var te_counts = 0;
        var env = LiquidTransportHelper.getEnviromentData(this.pos);
        if (!env.inPipe) {
            this.selfDestroy();
            return;
        }

        this.render(this.pos, env.directions);

        for (var d in env.directions) {
            var dir = env.directions[d];
            var liquid = LiquidMap.getLiquid(dir.x, dir.y, dir.z);
            if (dir.liquidStorage) {
                te_counts++;
                continue;
            }
            if (liquid) {
                if (liquid.liquid.id != this.liquid.id || liquid.liquid.amount > this.liquid.amount) {
                    deny[d] = false;
                } else amounts.push(liquid.liquid.amount);
            }
        }

        var mean = this.mean(amounts);
        for (var d in env.directions) {
            var dir = env.directions[d];
            if (!dir.liquidStorage && deny[d]) LiquidTransportHelper.flushLiquid(dir, this.liquid.id, mean);
        }

        if (te_counts > 0) {
            var amountForTE = this.liquid.amount / te_counts;
            this.liquid.amount = 0;
            for (var d in env.directions) {
                var dir = env.directions[d];
                if (dir.addLiquidFromPipe) {
                    this.liquid.amount += dir.addLiquidFromPipe(this.liquid.id, amountForTE);
                } else if (dir.liquidStorage) {
                    var liquidStored = dir.liquidStorage.getLiquidStored();
                    var transportableLiquids;
                    var transportDenied = false;
                    if (dir.getTransportLiquids) {
                        transportableLiquids = dir.getTransportLiquids();
                    }
                    if (transportableLiquids) {
                        for (var id in transportableLiquids.input) {
                            if (this.liquid.id == transportableLiquids.input[id]) transportDenied = true;
                        }
                    } else if (this.liquid.id == liquidStored) transportDenied = true;
                    if (transportDenied) this.liquid.amount += dir.liquidStorage.addLiquid(this.liquid.id, amountForTE);
                }
            }
            return;
        }

        this.liquid.amount = mean;
    },

    //standart callbacks
    loaded: function() {
        this.animation = new Animation.Base(this.pos.x + 7 / 16, this.pos.y + 6 / 16, this.pos.z + 10 / 16);
        this.animation.load();
        LiquidMap.registerLiquid(this.pos.x, this.pos.y, this.pos.z, this);
    },

    update: function() {
        this.frame++;
        if (this.frame % 5 == 0) {
            this.pouringAction();
            this.validate();
        }
    },

    selfDestroy: function() {
        if (this.animation) {
            this.animation.destroy();
        }
        LiquidMap.deleteLiquid(this.pos.x, this.pos.y, this.pos.z);
        this.destroy();
    },
});




// file: core/TransportingItem.js

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
        return (type1 == type2 && type1 != ITEM_PIPE_CONNECTION_WOOD) 
            || (type1 == ITEM_PIPE_CONNECTION_ANY || type2 == ITEM_PIPE_CONNECTION_ANY)
            || (type1 == ITEM_PIPE_CONNECTION_STONE && type2 != ITEM_PIPE_CONNECTION_COBBLE)
            || (type2 == ITEM_PIPE_CONNECTION_STONE && type1 != ITEM_PIPE_CONNECTION_COBBLE)
            || (type1 == ITEM_PIPE_CONNECTION_COBBLE && type2 != ITEM_PIPE_CONNECTION_STONE)
            || (type2 == ITEM_PIPE_CONNECTION_COBBLE && type1 != ITEM_PIPE_CONNECTION_STONE);
    },
    
    canTransportTo: function(pipe, x, y, z){
        var block = World.getBlock(x, y, z).id;
        if (this.BasicItemContainers[block])
            return true; 
        if (block > 4096 && !this.TransportingDenied[block]){
            return (!this.isPipe(block) && TileEntity.isTileEntityBlock(block)) || this.canPipesConnect(block, pipe);
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

var TransportingItem = new GameObject("bcTransportingItem", {
    init: function(){
        /* setup basics */
        this.pos = {
            x: 0,
            y: 0,
            z: 0
        };
        this.item = {
            id: 0,
            count: 0,
            data: 0
        };
        
        this.inPipeFlag = false;
        
        this.animation = null;
        
        /* setup pathfinding */
        this.target = null;
        this.velocity = .05;
        this.acceleration = .0;
        this.friction = .0;
        this.direction = {
            x: 0, 
            y: 0, 
            z: 0
        };
        
    },
    
    loaded: function(){
        this.reloadAnimation();
    },
    
    update: function(){
        if (this.move()){
            this.pathfind();
        }
        if (!this.item || this.item.count < 0 || !this.item.id){
            this.destroy();
        }
        this.moveAnimation();
    },
    
    destroySelf: function(){
        if (this.animation){
            this.animation.destroy();
        }
        this.destroy();
    },
    

    
    
    /* basics */
    
    setPosition: function(x, y, z){
        this.pos = {
            x: x,
            y: y,
            z: z
        };
    },
    
    setItem: function(id, count, data){
        this.item = {
            id: id,
            count: count, 
            data: data
        };
        if (id > 0){
            this.reloadAnimation();
        }
    },
    
    setItemSource: function(item){
        this.item = item || {id: 0, count: 0, data: 0};
        this.reloadAnimation();
    },
    
    drop: function(){
        this.destroySelf();
        if (this.item && this.item.id > 0 && this.item.count > 0){
            var item = World.drop(this.pos.x, this.pos.y, this.pos.z, this.item.id, this.item.count, this.item.data);
            Entity.setVelocity(item, this.direction.x * this.velocity * 1.5,  this.direction.y * this.velocity * 1.5,  this.direction.z * this.velocity * 1.5)
        }
        this.setItem(0, 0, 0);
    },
    
    validate: function(){
        if (!this.item || this.item.count <= 0){
            this.destroySelf();
        }
    },

    turnBack: function(){
        var delta = {
            x: this.target.x - this.pos.x,
            y: this.target.y - this.pos.y,
            z: this.target.z - this.pos.z,
        };
        this.target = {
            x: this.pos.x - delta.x,
            y: this.pos.y - delta.y,
            z: this.pos.z - delta.z,
        };
    },
    
    
    /* animation */
    
    reloadAnimation: function(){
        
        if (this.animation){
            this.animation.destroy();
        }
        this.animation = new Animation.Item(this.pos.x, this.pos.y, this.pos.z);
        
        var modelCount = 1;
        if (this.item.count > 1){
            modelCount = 2;
        }
        if (this.item.count > 12){
            modelCount = 3;
        }
        if (this.item.count > 56){
            modelCount = 4;
        }
        
        this.animation.describeItem({
            id: this.item.id,
            count: modelCount,
            data: this.item.data,
            size: 0.3,
            rotation: "x"
        });
        this.animation.load();
    },
    
    moveAnimation: function(){
        this.animation.setPos(this.pos.x, this.pos.y, this.pos.z);
    },
    
    
    /* pathfinding */
    
    setTarget: function(x, y, z){
        this.target = {
            x: Math.floor(x) + .5 || 0,
            y: Math.floor(y) + .5 || 0,
            z: Math.floor(z) + .5 || 0,
        };
    },
    
    move: function(){
        this.velocity = Math.min(.5, Math.max(.02, this.velocity + this.acceleration - this.friction || 0));
        if (this.target && this.velocity){
            var delta = {
                x: this.target.x - this.pos.x,
                y: this.target.y - this.pos.y,
                z: this.target.z - this.pos.z,
            };
            var dis = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
            this.direction = {
                x: Math.floor(delta.x / dis + .5) || 0,
                y: Math.floor(delta.y / dis + .5) || 0,
                z: Math.floor(delta.z / dis + .5) || 0,
            };
            var move = Math.min(dis, this.velocity) / dis || 0;
            this.pos.x += delta.x * move;
            this.pos.y += delta.y * move;
            this.pos.z += delta.z * move;
            return dis <= this.velocity;
        }
        return true;
    },
    
    
    addItemToContainer: function(container){
        if (this.item.count <= 0){
            return;
        }
        
        // Native TileEntity
        if(container.getType && container.getSize){
            let size = container.getSize();
            for (var i = 0; i < size; i++){
                var slot = container.getSlot(i);
                if (slot.id == 0 || slot.id == this.item.id && slot.data == this.item.data){
                    var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
                    var add = Math.min(maxstack - slot.count, this.item.count);
                    this.item.count -= add;
                    container.setSlot(i, this.item.id, slot.count + add, this.item.data);
                }
            }
        }
        
        // TileEntity
        else {
            var tileEntity = container.tileEntity;
            var slots = [];
            var slotsInitialized = false;
            if (tileEntity){
                if (tileEntity.addTransportedItem){
                    tileEntity.addTransportedItem(this, this.item, this.direction);
                    return;
                }
                if (tileEntity.getTransportSlots){
                    slots = tileEntity.getTransportSlots().input || [];
                    slotsInitialized = true;
                }
            }
            if (!slotsInitialized){
                for (var name in container.slots){
                    slots.push(name);
                }
            }
            for (var i in slots){
                var slot = container.getSlot(slots[i]);
                if (slot.id == 0 || slot.id == this.item.id && slot.data == this.item.data){
                    var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
                    var add = Math.min(maxstack - slot.count, this.item.count);
                    this.item.count -= add;
                    slot.count += add;
                    slot.id = this.item.id;
                    slot.data = this.item.data;
                }
            }
            
            container.validateAll();
        }
    },
    
    pathfind: function(){
        if (this.dropFlag){
            this.drop();
            return;
        }
        
        var pathdata = ItemTransportingHelper.getPathData(this, this.item, this.pos, this.direction);
        var directions = pathdata.directions;
        var dir = directions[parseInt(directions.length * Math.random())];
        
        this.acceleration = pathdata.acceleration;
        this.friction = pathdata.friction;
        
        if (pathdata.inPipe){           
            if (!dir){
                dir = this.direction;
                this.dropFlag = true;
            }
            this.inPipeFlag = true;
        }
        else if (pathdata.container){
            if (this.inPipeFlag){
                this.addItemToContainer(pathdata.container);
                this.validate();
            }
            this.inPipeFlag = false;
        }
        else {
            if (this.inPipeFlag){
                this.drop();
            }
            if (!dir){
                this.drop();
            }
        }
        
        if (dir){
            this.target = {
                x: Math.floor(this.pos.x) + .5 + dir.x,
                y: Math.floor(this.pos.y) + .5 + dir.y,
                z: Math.floor(this.pos.z) + .5 + dir.z,
            };
        }
    }
});





// file: core/ModelHelper.js

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
    } 
}



// file: items/gears.js

IDRegistry.genItemID("gearWood");
Item.createItem("gearWood", "Wood Gear", {name: "gear_wood"});

IDRegistry.genItemID("gearStone");
Item.createItem("gearStone", "Stone Gear", {name: "gear_stone"});

IDRegistry.genItemID("gearIron");
Item.createItem("gearIron", "Iron Gear", {name: "gear_iron"});

IDRegistry.genItemID("gearGold");
Item.createItem("gearGold", "Gold Gear", {name: "gear_gold"});

IDRegistry.genItemID("gearDiamond");
Item.createItem("gearDiamond", "Diamond Gear", {name: "gear_diamond"});

Recipes.addShaped({id: ItemID.gearWood, count: 1, data: 0}, [
    " x ",
    "x x",
    " x "
], ['x', 280, 0]);

Recipes.addShaped({id: ItemID.gearStone, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 4, -1, 'o', ItemID.gearWood, 0]);

Recipes.addShaped({id: ItemID.gearIron, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 265, 0, 'o', ItemID.gearStone, 0]);

Recipes.addShaped({id: ItemID.gearGold, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 266, 0, 'o', ItemID.gearIron, 0]);

Recipes.addShaped({id: ItemID.gearDiamond, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 264, 0, 'o', ItemID.gearGold, 0]);


Callback.addCallback("BC-ICore", function(ICore){
    IDRegistry.genItemID("gearTin");
    Item.createItem("gearTin", "Tin Gear", {name: "gear_tin"});
    
    Recipes.addShaped({id: ItemID.gearTin, count: 1, data: 0}, [
        " x ",
        "xox",
        " x "
    ], ['x', ItemID.ingotTin, 0, 'o', ItemID.gearStone, 0]);
});




// file: items/other.js

// Pipe Sealant
IDRegistry.genItemID("pipeSealant");
Item.createItem("pipeSealant", "Pipe Sealant", {name: "pipe_sealant"});
Recipes.addShapeless({id: ItemID.pipeSealant, count: 1, data: 0}, [{id: 351, data: 2}]);
Recipes.addShapeless({id: ItemID.pipeSealant, count: 1, data: 0}, [{id: 341, data: 0}]);


// Wrench
IDRegistry.genItemID("bcWrench");
Item.createItem("bcWrench", "Wrench", {name: "bc_wrench"});
Recipes.addShaped({id: ItemID.bcWrench, count: 1, data: 0}, [
    "x x",
    " o ",
    " x "
], ['x', 265, 0, 'o', ItemID.gearStone, 0]);



// file: machine/engines/engines.js

// BuildCraft Engine
IDRegistry.genBlockID("bcEngine");
Block.createBlock("bcEngine", [
    {name: "bcEngine", texture: [["empty", 0]], inCreative: false}
], BLOCK_TYPE_ITEM_PIPE);

Block.registerDropFunction("bcEngine", function(){
    return [];
});

Block.setBlockShape(BlockID.bcEngine, {x: 1 / 16, y: 1 / 16, z: 1 / 16}, {x: 15 / 16, y: 15 / 16, z: 15 / 16});

denyTransporting(BlockID.bcEngine, true, true);


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

EngineModelPartRegistry.Add("trunkBlack0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 0, y: 128}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlack1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 64, y: 128}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("trunkBlack2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 128, y: 128}, {width: 512, height: 512}));


var ENGINE_HEAT_BLUE = "Blue";
var ENGINE_HEAT_GREEN = "Green";
var ENGINE_HEAT_ORANGE = "Orange";
var ENGINE_HEAT_RED = "Red";
var ENGINE_HEAT_BLACK = "Black";

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
        
        var render = new Render({skin: "model/" + pistonMaterial.getTexture()});
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
        
        return {
            render: render.getId(),
            //firmRotation: true,
            //hitbox: {
            //    width: .0,
            //    height: .0
            //}
        };
    }
}


var BUILDCRAFT_ENGINE_PROTOTYPE = {
    defaultValues:{
        type: null,
        rotation: 0,
        direction: 1,
        heatStage: ENGINE_HEAT_BLUE,
        
        rotationIndex: 0,
        redstone: redstoneInverse,
        
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
        }  else {
            this.data.heatStage = ENGINE_HEAT_BLACK;
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

if(__config__.getBool('use_redstone')){
    BUILDCRAFT_ENGINE_PROTOTYPE.redstone = function(signal){
        this.data.redstone = redstoneInverse? signal.power <= 8: signal.power > 8;
    };
} else {
    BUILDCRAFT_ENGINE_PROTOTYPE.defaultValues.redstone = true;
}


Callback.addCallback("BC-DefineEngines", function(ICore){
    // TODO: IC2 integration
    TileEntity.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
});






// file: machine/engines/engineRedstone.js

var ENGINE_TYPE_WOOD = "Wood";

// Redstone Engine
IDRegistry.genItemID("engineWooden");
Item.createItem("engineWooden", "Redstone Engine", {name: "engine_wooden"});

Recipes.addShaped({id: ItemID.engineWooden, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 5, -1, 'b', 20, -1, 'o', ItemID.gearWood, 0]);


Item.registerUseFunction("engineWooden", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_WOOD);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineWood0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 0}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineWood2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 0}, {width: 512, height: 512}));


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



// file: machine/engines/engineStirling.js

var ENGINE_TYPE_STONE = "Stone";

// Stirling Engine
IDRegistry.genItemID("engineStone");
Item.createItem("engineStone", "Stirling Engine", {name: "engine_stone"});

Recipes.addShaped({id: ItemID.engineStone, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 4, -1, 'b', 20, -1, 'o', ItemID.gearStone, 0]);


Item.registerUseFunction("engineStone", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_STONE);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


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


EngineModelPartRegistry.Add("engineStone0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 32}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineStone2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 32}, {width: 512, height: 512}));


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





// file: machine/engines/engineICE.js

var ENGINE_TYPE_IRON = "Iron";

// ICE Engine
IDRegistry.genItemID("engineIron");
Item.createItem("engineIron", "ICE", {name: "engine_iron"});

Recipes.addShaped({id: ItemID.engineIron, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 265, 0, 'b', 20, -1, 'o', ItemID.gearIron, 0]);


Item.registerUseFunction("engineIron", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_IRON);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineIron0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 64}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineIron2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 64}, {width: 512, height: 512}));


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



// file: machine/engines/engineCreative.js

var ENGINE_TYPE_CREATIVE = "Creative";

// Creative Engine
IDRegistry.genItemID("engineCreative");
Item.createItem("engineCreative", "Creative Engine", {name: "engine_creative"});


Item.registerUseFunction("engineCreative", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_CREATIVE);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});


EngineModelPartRegistry.Add("engineCreative0", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 256, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineCreative1", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 320, y: 96}, {width: 512, height: 512}));
EngineModelPartRegistry.Add("engineCreative2", new ModelHelper.Texture("buildcraft_engine_atlas.png", {x: 384, y: 96}, {width: 512, height: 512}));


ENGINE_TYPE_DATA[ENGINE_TYPE_CREATIVE] = {
    defaultValues: {
        generation: 20
    },
    
    getGuiScreen: function(){
        return null;
    },
    
    getItemDrop: function(){
        return [[ItemID.engineCreative, 1, 0]];
    },
    
    engineTick: function(){
        if (this.data.redstone){
            this.setPower(0.4);
        }
        else{
            this.setPower(0);
            this.data.pistonDelay = 0;
        }
    },
    
    energyDeploy: function(params){
        return this.data.generation;
    },
    
    energyTick: function(type, src){
    },
    
    click: function(id, count, data){
        if (id == ItemID.bcWrench){
            this.data.generation *= 2;
            if(this.data.generation > 1280){
                this.data.generation = 20;
            }
            Game.message("Switched to " + this.data.generation + " RF/t limit");
        }
    },
};




// file: machine/pipes/PipeRegistry.js

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
        data = connectionType == ITEM_PIPE_CONNECTION_WOOD? texture.data + 2: data;
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

var blockGroupFluid = ICRender.getGroup("bc-liquid-pipes");
//blockGroupMachine.add(54, -1);

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

Callback.addCallback("PostLoaded", function(){
    var prototypes = TileEntity.tileEntityPrototypes;
    for(var id in prototypes){
        if(prototypes[id].getTransportLiquid){
            blockGroupFluid.add(id, -1);
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



















// file: machine/pipes/itemWood.js

// Wooden Transport Pipe
IDRegistry.genBlockID("pipeItemWooden");
Block.createBlock("pipeItemWooden", [
    {name: "Wooden Transport Pipe", texture: [["pipe_item_wood", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemWooden, count: 1, data: 0}, ["xax"], ['x', 5, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemWooden, {name: "pipe_item_wood", data: 0}, ITEM_PIPE_CONNECTION_WOOD);
 

TileEntity.registerPrototype(BlockID.pipeItemWooden, {
    defaultValues: {
        containerIndex: 0,
    },
    
    getTransportSlots: function(){
        return {};
    },
    
    MJEnergyDeploy: function(amount, generator, params){
        var containerData = this.findContainer();
        if (containerData && containerData.container){
            var item = this.getItemFrom(containerData.container, amount >= 8 ? amount * 8 : 1);
            if (item){
                var transportedItem = TransportingItem.deploy();
                transportedItem.setPosition(containerData.position.x + .5, containerData.position.y + .5, containerData.position.z + .5);
                transportedItem.setItem(item.id, item.count, item.data);
                transportedItem.setTarget(this.x, this.y, this.z);
            }
            else{
                this.data.containerIndex++;
            }
        }
    },
    
    findContainer: function(){
        var directions = ItemTransportingHelper.findNearbyContainers(this);
        var dir = directions[this.data.containerIndex % directions.length];
        
        if (dir){
            var container = World.getContainer(this.x + dir.x, this.y + dir.y, this.z + dir.z);
            return {
                container: container,
                direction: dir,
                position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
            };
        }
    },
    
    getItemFrom: function(container, maxCount){
        // Native TileEntity
        if(container.getType && container.getSize){
            let size = container.getSize();
            let slot;
            for(var i = 0; i < size; i++){
                var slot = container.getSlot(i);
                if(slot.id > 0){
                    var count = Math.min(maxCount, slot.count);
                    item = {id: slot.id, count: count, data: slot.data};
                    container.setSlot(i, slot.id, slot.count - count, slot.data);
                    break;
                }
            }
        } 
        
        // TileEntity
        else {
            var tileEntity = container.tileEntity;
            var slots = [];
            var slotsInitialized = false;
            if (tileEntity){
                if (tileEntity.getTransportedItem){
                    tileEntity.getTransportedItem();
                }
                if (tileEntity.getTransportSlots){
                    slots = tileEntity.getTransportSlots().output || [];
                    slotsInitialized = true;
                }
            }
            
            if (!slotsInitialized){
                for (var name in container.slots){
                    slots.push(name);
                }
            }  
            
            var item = null;
            for (var i in slots){
                var slot = container.getSlot(slots[i]);
                if (slot.id > 0){
                    var count = Math.min(maxCount, slot.count);
                    item = {id: slot.id, count: count, data: slot.data};
                    slot.count -= count;
                    break;
                }
            }
            
            container.validateAll();
        }
        
        return item;
    }
});




// file: machine/pipes/itemIron.js

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








// file: machine/pipes/itemGold.js

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
        redstone: redstoneInverse,
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
    },
    
    destroyBlock: function(){
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }
};


if(__config__.getBool('pipes_use_redstone')){
    PIPE_ITEM_GOLDEN_PROTOTYPE.redstone = function(signal){
        this.data.redstone = redstoneInverse? signal.power <= 8: signal.power > 8;  
        this.updateModel();
    };
} else {
    PIPE_ITEM_GOLDEN_PROTOTYPE.defaultValues.redstone = true;
}


TileEntity.registerPrototype(BlockID.pipeItemGolden, PIPE_ITEM_GOLDEN_PROTOTYPE);






// file: machine/pipes/itemEmerald.js

// Emerald Transport Pipe
IDRegistry.genBlockID("pipeItemEmerald");
Block.createBlock("pipeItemEmerald", [
    {name: "Emerald Transport Pipe", texture: [["pipe_item_emerald", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemEmerald, count: 1, data: 0}, ["xax"], ['x', 388, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemEmerald, {name: "pipe_item_emerald", data: 0}, ITEM_PIPE_CONNECTION_WOOD);


var emeraldPipeUI = new UI.StandartWindow({
    standart: {
        header: {
            text: {text: "Emerald Transporting Pipe"}
        },
        background: {
            standart: true,
        },
        inventory: {
            standart: true
        }
    },

    elements: {
        "modeWhitelist": {
            type: "button", x: 380, y: 200, bitmap: "emerald_button_inactive", bitmap2: "emerald_button_active", scale: 3.5, 
            clicker: {
                onClick: function(container, tileEntity){
                    tileEntity.setMode(EMERALD_MODE_WHITELIST);
                }
            }
        },
        
        "iconWhitelist": {
            type: "image", bitmap: "emerald_whitelist", x: 383, y: 203, z: 5, scale: 3.5
        },
        
        "modeBlacklist": {
            type: "button", x: 450, y: 200, bitmap: "emerald_button_inactive", bitmap2: "emerald_button_active", scale: 3.5, 
            clicker: {
                onClick: function(container, tileEntity){
                    tileEntity.setMode(EMERALD_MODE_BLACKLIST);
                }
            }
        },
        
        
        "iconBlacklist": {
            type: "image", bitmap: "emerald_blacklist", x: 453, y: 203, z: 5, scale: 3.5
        }
    }
});

for (var i = 0; i < 9; i++){
    emeraldPipeUI.content.elements["slot" + i] = {
        type: "slot",
        x: 370 + i * 65, y: 100
    };
}

const EMERALD_MODE_WHITELIST = 0;
const EMERALD_MODE_BLACKLIST = 1;
const EMERALD_MODE_ORDER = 2;


TileEntity.registerPrototype(BlockID.pipeItemEmerald, {
    defaultValues: {
        containerIndex: 0,
        mode: EMERALD_MODE_WHITELIST
    },
    
    click: function(id, count, data){
        
    },
    
    /* callbacks */
    getGuiScreen: function(){
        return emeraldPipeUI;
    },

    tick: function(){
        if (this.container.isOpened()){
            this.reloadFilter();
        }
    },
    
    getTransportSlots: function(){
        return {};
    },

    MJEnergyDeploy: function(amount, generator, params){
        var containerData = this.findContainer();
        if (containerData && containerData.container){
            var item = this.getItemFrom(containerData.container, amount >= 8 ? amount * 8 : 1);
            if (item){
                var transportedItem = TransportingItem.deploy();
                transportedItem.setPosition(containerData.position.x + .5, containerData.position.y + .5, containerData.position.z + .5);
                transportedItem.setItem(item.id, item.count, item.data);
                transportedItem.setTarget(this.x, this.y, this.z);
            }
            else{
                this.data.containerIndex++;
            }
        }
    },
    
    reloadFilter: function(){
        this.filter = {};
        for (var i = 0; i < 9; i++){
            var slot = this.container.getSlot("slot" + i);
            if (slot.id > 0){
                this.filter[slot.id + "." + slot.data] = true;
            }
        }
    },

    checkItem: function(id, data){
        if (this.filter){
            if (this.data.mode == EMERALD_MODE_WHITELIST){
                return this.filter[id + "." + data];
            }
            else if(this.data.mode == EMERALD_MODE_BLACKLIST){
                return !this.filter[id + "." + data];
            }
        }
        else{
            return true;
        }
    },
    
    setMode: function(mode){
        this.data.mode = mode;
        this.container.getElement("modeWhitelist").bitmap = 
            mode == EMERALD_MODE_WHITELIST? "emerald_button_active": "emerald_button_inactive";
        this.container.getElement("modeBlacklist").bitmap = 
            mode == EMERALD_MODE_BLACKLIST? "emerald_button_active": "emerald_button_inactive";
    },

    findContainer: function(){
        var directions = ItemTransportingHelper.findNearbyContainers(this);
        var dir = directions[this.data.containerIndex % directions.length];
        
        if (dir){
            var container = World.getContainer(this.x + dir.x, this.y + dir.y, this.z + dir.z);
            return {
                container: container,
                direction: dir,
                position: {x: this.x + dir.x, y: this.y + dir.y, z: this.z + dir.z}
            };
        }
    },
    
    getItemFrom: function(container, maxCount){
        // Native TileEntity
        if(container.getType && container.getSize){
            let size = container.getSize();
            let slot;
            for(var i = 0; i < size; i++){
                var slot = container.getSlot(i);
                if(slot.id > 0 && this.checkItem(slot.id, slot.data)){
                    var count = Math.min(maxCount, slot.count);
                    item = {id: slot.id, count: count, data: slot.data};
                    container.setSlot(i, slot.id, slot.count - count, slot.data);
                    break;
                }
            }
        } 
        
        // TileEntity
        else {
            var tileEntity = container.tileEntity;
            var slots = [];
            var slotsInitialized = false;
            if (tileEntity){
                if (tileEntity.getTransportedItem){
                    tileEntity.getTransportedItem();
                }
                if (tileEntity.getTransportSlots){
                    slots = tileEntity.getTransportSlots().output || [];
                    slotsInitialized = true;
                }
            }
            
            if (!slotsInitialized){
                for (var name in container.slots){
                    slots.push(name);
                }
            }  
            
            var item = null;
            for (var i in slots){
                var slot = container.getSlot(slots[i]);
                if (slot.id > 0 && this.checkItem(slot.id, slot.data)){
                    var count = Math.min(maxCount, slot.count);
                    item = {id: slot.id, count: count, data: slot.data};
                    slot.count -= count;
                    break;
                }
            }
            
            container.validateAll();
        }
        
        return item;
    }
});




// file: machine/pipes/itemDiamond.js

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



// file: machine/pipes/itemOther.js

// Cobblestone Transport Pipe
IDRegistry.genBlockID("pipeItemCobble");
Block.createBlock("pipeItemCobble", [
    {name: "Cobblestone Transport Pipe", texture: [["pipe_item_cobble", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemCobble, count: 1, data: 0}, ["xax"], ['x', 4, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemCobble, {name: "pipe_item_cobble", data: 0}, ITEM_PIPE_CONNECTION_COBBLE, {
    friction: .005
});


// Stone Transport Pipe
IDRegistry.genBlockID("pipeItemStone");
Block.createBlock("pipeItemStone", [
    {name: "Stone Transport Pipe", texture: [["pipe_item_stone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemStone, count: 1, data: 0}, ["xax"], ['x', 1, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemStone, {name: "pipe_item_stone", data: 0}, ITEM_PIPE_CONNECTION_STONE, {
    friction: .0015
});


// Sandstone Transport Pipe
IDRegistry.genBlockID("pipeItemSandstone");
Block.createBlock("pipeItemSandstone", [
    {name: "Sandstone Transport Pipe", texture: [["pipe_item_sandstone", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemSandstone, count: 1, data: 0}, ["xax"], ['x', 24, 0, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemSandstone, {name: "pipe_item_sandstone", data: 0}, ITEM_PIPE_CONNECTION_ANY, {
    friction: .0025
}); 


// Obsidian Transport Pipe
IDRegistry.genBlockID("pipeItemObsidian");
Block.createBlock("pipeItemObsidian", [
    {name: "Obsidian Transport Pipe", texture: [["pipe_item_obsidian", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemObsidian, count: 1, data: 0}, ["xax"], ['x', 49, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemObsidian, {name: "pipe_item_obsidian", data: 0}, ITEM_PIPE_CONNECTION_ANY);








// file: machine/pipes/liquidWooden.js

// Wooden Fluid Pipe
IDRegistry.genBlockID("pipeFluidWooden");
Block.createBlock("pipeFluidWooden", [
    {name: "Wooden Fluid Pipe", texture: [["pipe_fluid_wood", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

Block.setBlockShape(BlockID.pipeFluidWooden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Recipes.addShapeless({id: BlockID.pipeFluidWooden, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemWooden, data: 0}]);
setupFluidPipeRender(BlockID.pipeFluidWooden, {name: "pipe_fluid_wood", data: 0}, FLUID_PIPE_CONNECTION_ANY);


TileEntity.registerPrototype(BlockID.pipeFluidWooden, {
    defaultValues: {
        storageIndex: 0,
    },

    getTransportSlots: function() {
        return {};
    },

    MJEnergyDeploy: function(amount, generator, params) {
        var storageData = this.findLiquidStorage();
        if (storageData && storageData.liquidStorage) {
            var pipes = LiquidTransportHelper.locateLiquidPipes(this.x, this.y, this.z);
            if (pipes.length > 0) {
                for (var dir in pipes) {
                    var liquid = this.getLiquidFrom(storageData.liquidStorage, amount * 0.01);
                    if (liquid) {
                        for (var pos in pipes[dir]) {
                            pipes[dir][pos] += this[pos];
                        }
                        LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);
                    } else {
                        this.data.storageIndex++;
                    }
                }
            }
        }
    },

    findLiquidStorage: function() {
        var directions = LiquidTransportHelper.findNearbyLiquidStorages(this);
        var dir = directions[this.data.storageIndex % directions.length];

        if (dir) {
            var liquidStorage = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z).liquidStorage;
            return {
                liquidStorage: liquidStorage,
                direction: dir,
                position: {
                    x: this.x + dir.x,
                    y: this.y + dir.y,
                    z: this.z + dir.z
                }
            };
        }
    },

    getLiquidFrom: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        if (liquidStored) {
            return {
                id: liquidStored,
                amount: storage.getLiquid(liquidStored, amount)
            };
        }
    } 
});




// file: machine/pipes/liquidEmerald.js

// Emerald Fluid Pipe
IDRegistry.genBlockID("pipeFluidEmerald");
Block.createBlock("pipeFluidEmerald", [
    {name: "Emerald Fluid Pipe", texture: [["pipe_fluid_emerald", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

Block.setBlockShape(BlockID.pipeFluidEmerald, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Recipes.addShapeless({id: BlockID.pipeFluidEmerald, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemEmerald, data: 0}]);
setupFluidPipeRender(BlockID.pipeFluidEmerald, {name: "pipe_fluid_emerald", data: 0}, FLUID_PIPE_CONNECTION_ANY);


TileEntity.registerPrototype(BlockID.pipeFluidEmerald, {
    defaultValues: {
        containerIndex: 0,
        inverseMode: false
    },

    /* callbacks */
    getGuiScreen: function() {
        return emeraldPipeUI;
    },

    tick: function() {
        if (this.container.isOpened()) {
            this.reloadFilter();
            this.container.setText("modeSwitch", this.data.inverseMode ? "Ignore" : "Filter");
        }
    },

    getTransportSlots: function() {
        return {};
    },

    MJEnergyDeploy: function(amount, generator, params) {
        var storageData = this.findLiquidStorage();
        if (storageData && storageData.liquidStorage) {
            var pipes = LiquidTransportHelper.locateLiquidPipes(this.x, this.y, this.z);
            if (pipes.length > 0) {
                for (var dir in pipes) {
                    var liquid = this.getLiquidFrom(storageData.liquidStorage, amount * 0.05);
                    if (liquid) {
                        LiquidTransportHelper.flushLiquid(pipes[dir], liquid.id, liquid.amount);
                    } else {
                        this.data.storageIndex++;
                    }
                }
            }
        }
    },

    findLiquidStorages: function() {
        var directions = LiquidTransportHelper.findNearbyLiquidDtorages(this);
        var dir = directions[this.data.storageIndex % directions.length];

        if (dir) {
            var liquidStorage = World.getTileEntity(this.x + dir.x, this.y + dir.y, this.z + dir.z).liquidStorage;
            return {
                liquidStorage: liquidStorage,
                direction: dir,
                position: {
                    x: this.x + dir.x,
                    y: this.y + dir.y,
                    z: this.z + dir.z
                }
            };
        }
    },

    /* logic */
    reloadFilter: function() {
        this.filter = {
            all: true
        };
        this.container.validateAll();
        for (var i = 0; i < 9; i++) {
            var slot = this.container.getSlot("slot" + i);
            var liquid = LiquidRegistry.getItemLiquid(slot.id, slot.data)
            if (liquid) {
                this.filter[liquid] = true;
                this.filter.all = false;
            }
        }
    },

    checkLiquid: function(id) {
        if (this.filter) {
            if (this.data.inverseMode) {
                return this.filter.all || !this.filter[id];
            } else {
                return this.filter.all || this.filter[id];
            }
        } else {
            return true;
        }
    },

    getLiquidFrom: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        if (liquidStored && checkLiquid(liquid)) {
            return {
                id: liquidStored,
                amount: storage.getLiquid(liquidStored, amount)
            };
        }
    }
});



// file: machine/pipes/liquidOther.js

IDRegistry.genBlockID("pipeFluidCobble");
Block.createBlock("pipeFluidCobble", [
    {name: "Cobblestone Fluid Pipe", texture: [["pipe_fluid_cobble", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidStone");
Block.createBlock("pipeFluidStone", [
    {name: "Stone Fluid Pipe", texture: [["pipe_fluid_stone", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidIron");
Block.createBlock("pipeFluidIron", [
    {name: "Iron Fluid Pipe", texture: [["pipe_fluid_iron", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);

IDRegistry.genBlockID("pipeFluidGolden");
Block.createBlock("pipeFluidGolden", [
    {name: "Golden Fluid Pipe", texture: [["pipe_fluid_gold", 0]], inCreative: true}
], BLOCK_TYPE_LIQUID_PIPE);



Block.setBlockShape(BlockID.pipeFluidCobble, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidStone, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidIron, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.pipeFluidGolden, {x: 0.5 - PIPE_BLOCK_WIDTH, y: 0.5 - PIPE_BLOCK_WIDTH, z: 0.5 - PIPE_BLOCK_WIDTH}, {x: 0.5 + PIPE_BLOCK_WIDTH, y: 0.5 + PIPE_BLOCK_WIDTH, z: 0.5 + PIPE_BLOCK_WIDTH});


Recipes.addShapeless({id: BlockID.pipeFluidCobble, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemCobble, data: 0}]);
Recipes.addShapeless({id: BlockID.pipeFluidStone, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemStone, data: 0}]);
Recipes.addShapeless({id: BlockID.pipeFluidIron, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemIron, data: -1}]);
Recipes.addShapeless({id: BlockID.pipeFluidGolden, count: 1, data: 0}, [{id: ItemID.pipeSealant, data: 0}, {id: BlockID.pipeItemGolden, data: -1}]);


setupFluidPipeRender(BlockID.pipeFluidCobble, {name: "pipe_fluid_cobble", data: 0}, FLUID_PIPE_CONNECTION_COBBLE);
setupFluidPipeRender(BlockID.pipeFluidStone, {name: "pipe_fluid_stone", data: 0}, FLUID_PIPE_CONNECTION_STONE);
setupFluidPipeRender(BlockID.pipeFluidIron, {name: "pipe_fluid_iron", data: 0}, FLUID_PIPE_CONNECTION_ANY);
setupFluidPipeRender(BlockID.pipeFluidGolden, {name: "pipe_fluid_gold", data: 0}, FLUID_PIPE_CONNECTION_ANY);




// file: machine/tank.js

IDRegistry.genBlockID("bcTank");
Block.createBlock("bcTank", [
 {name: "Tank", texture: [["tank", 1], ["tank", 1], ["tank", 0]], inCreative: true}], BLOCK_TYPE_LIQUID_PIPE);
Block.setBlockShape(BlockID.bcTank, {x: 2/16 + 0.001, y: 0.001, z: 2/16 + 0.001}, {x: 14/16 - 0.001, y: 0.999, z: 14/16 - 0.001});

Recipes.addShaped({id: BlockID.bcTank, count: 1, data: 0}, [
    "ggg",
    "g g",
    "ggg"
], ["g", 20, 0]);

//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_ANY, BlockID.tank);

//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_STONE, BlockID.tank);
//ICRenderLib.addConnectionBlock(FLUID_PIPE_CONNECTION_COBBLE, BlockID.tank);

var tankUI = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Tank"}},
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
    }
});


TileEntity.registerPrototype(BlockID.bcTank, {
    init: function() {
        this.animation = new Animation.Base(this.x + 3 / 16, this.y, this.z + 13 / 16);
        this.animation.load();
        this.data.frame = 0;
    },

    updateModel: function() {
        var storage = this.liquidStorage;
        var liquid = storage.getLiquidStored();
        if (liquid) {
            var amount = storage.getAmount(liquid);
            this.animation.describe(LiquidModels.getModelData(liquid, 10, amount, 10));
            this.animation.refresh();
        }
    },

    getGuiScreen: function() {
        return tank_interface ? tankUI : null;
    },
    getTransportLiquid:function(){
        return {input: ["water","lava"],output:["water","lava"]};
    },

    tick: function() {
        this.updateModel();

        this.data.frame++;

        var liquidStored = this.liquidStorage.getLiquidStored();
        var slot1 = this.container.getSlot("liquidSlot1");
        var slot2 = this.container.getSlot("liquidSlot2");
        var emptyItem = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
        var fullItem = LiquidRegistry.getFullItem(slot1.id, slot1.data, liquidStored);
        this.liquidStorage.setLimit(null, 16);

        if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)) {
            if (this.liquidStorage.addLiquid(emptyItem.liquid, 1) <= 1) {
                if (slot2.id == emptyItem.id && slot2.data == emptyItem.data && slot2.count < Item.getMaxStack(emptyItem.id) || slot2.id == 0) {
                    slot1.count--;
                    slot2.id = emptyItem.id;
                    slot2.data = emptyItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        if (fullItem) {
            if (this.liquidStorage.getAmount(liquidStored, 1) >= 1) {
                if (slot2.id == fullItem.id && slot2.data == fullItem.data && slot2.count < Item.getMaxStack(fullItem.id) || slot2.id == 0) {
                    this.liquidStorage.getLiquid(liquidStored, 1, true);
                    slot1.count--;
                    slot2.id = fullItem.id;
                    slot2.data = fullItem.data;
                    slot2.count++;
                    this.container.validateAll();
                }
            }
        }
        if (this.container.isOpened()) {
            this.liquidStorage.updateUiScale("liquidScale", this.liquidStorage.getLiquidStored());
            this.container.setText("textInfo1", "Liquid: " + (+this.liquidStorage.getAmount(this.liquidStorage.getLiquidStored()).toFixed(3)) * 1000 + "/16000");
        }

        var targetId = World.getBlockID(this.x, this.y - 1, this.z);
        if (targetId == BlockID.bcTank) {
            var other_storage = World.getTileEntity(this.x, this.y - 1, this.z).liquidStorage;
            var amount = this.liquidStorage.getLiquid(liquidStored, 1);
            if (amount > 0) {
                var returned_amount = other_storage.addLiquid(liquidStored, amount);
                this.liquidStorage.addLiquid(liquidStored, returned_amount);
            }
        }
    },

    click: function() {
        if (!tank_interface) {
            var item = Player.getCarriedItem();
            var emptyItem = LiquidRegistry.getEmptyItem(item.id, item.data);
            var liquidStored = this.liquidStorage.getLiquidStored();
            if (emptyItem && (emptyItem.liquid == liquidStored || !liquidStored)) {
                if (this.liquidStorage.addLiquid(emptyItem.liquid, 1, true) < 1) {
                    Player.decreaseCarriedItem(1);
                    Player.addItemToInventory(emptyItem.id, 1, emptyItem.data);
                }
            }
        } else {
            return false;
        }
    },

    addLiquidFromPipe: function(liquid, amount) {
        var liquidStored = this.liquidStorage.getLiquidStored();
        if (liquidStored == liquid || !liquidStored) {
            return this.liquidStorage.addLiquid(liquid, amount);
        }
    },

    destroyBlock: function() {
        if (this.animation) this.animation.destroy();
    }
});



// file: machine/pump.js

IDRegistry.genBlockID("bcPump");
Block.createBlock("bcPump", [
    {name: "Pump", texture: [["bc_pump", 1], ["bc_machine", 0], ["bc_pump", 0], ["bc_pump", 0], ["bc_pump", 0], ["bc_pump", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.bcPump, count: 1, data: 0}, [
        "iri",
        "igi",
        "tbt"
    ], ["i", 265, 0, "r", 331, 0, "b", 325, -1, "g", ItemID.gearIron, 0, "t", BlockID.tank, 0]);
});


TileEntity.registerPrototype(BlockID.bcPump, {
    defaultValues: {
        energy: 0,
        pumpY: 0
    },

    created: function() {
        this.data.pumpY = this.y - 1;
    },

    MJEnergyDeploy: function(amount, generator, params) {
        if (this.data.energy < 20) this.data.energy += Math.min(amount, amount - this.data.energy);
    },
    
    getTransportLiquid:function(){
        return {output: ["water"]};
    },

    tick: function() {
        this.liquidStorage.setLimit(null, 16);

        if (World.getThreadTime() % 20 == 0 && this.data.energy > 1) {
            var te = World.getTileEntity(this.x, this.y - 1, this.z);
            if (te) {
                this.pullFromTileEntity(te);
            } else {
                var coords = this.getPumpingCoords();
                if (coords) {
                    var tile = World.getBlock(coords.x, coords.y, coords.z);
                    if (tile.id == 9 || tile.id == 11) {
                        World.setBlock(coords.x, coords.y, coords.z, 0);
                        this.liquidStorage.addLiquid(tile.id == 9 ? "water" : "lava", 1);
                    }
                    if (tile.id == 8 || tile.id == 10) World.setBlock(coords.x, coords.y, coords.z, 0);
                    this.data.energy--;
                }
            }
        }
    },

    pullFromTileEntity: function(tileEntity) {
        var transportableLiquid = tileEntity.getTransportLiquids;
        var outputLiquids;
        if (transportableLiquid) outputLiquids = transportableLiquid().output;

        var liquidStored = tileEntity.liquidStorage.getLiquidStored();
        var pullAllowed = liquidStored ? true : false;
        if (outputLiquids) {
            for (var liquid in outputLiquids) {
                if (liquidStored != outputLiquids[liquid]) pullAllowed = false;
            }
        }

        if (pullAllowed) {
            this.liquidStorage.addLiquid(liquidStored, tileEntity.liquidStorage.getLiquid(liquidStored));
            this.data.energy--;
        }
    },

    getPumpingCoords: function() {
        while (World.getBlockID(this.x, this.data.pumpY, this.z) == 0 && this.data.pumpY > 0) this.data.pumpY--;
        var coords = this.getCoordsForLevel(this.x, this.data.pumpY, this.z);
        return coords;
    },

    getCoordsForLevel: function(x, y, z, data, exp, expCount) {
        if (!exp) exp = []
        if (!expCount) expCount = 0;
        var key = x + "#" + y + "#" + z;
        if (exp[key]) return null;
        exp[key] = true;
        expCount++;
        if (!data) data = 9;

        var tile = World.getBlock(x, y, z)
        if (tile.data >= data) return null;
        var posCoords = null;
        if (this.isLiquidSource(tile.id, tile.data)) {
            posCoords = {
                x: x,
                y: y,
                z: z
            };
            data = 9;
        }
        if (!this.isLiquidFlow(tile.id, tile.data) && !posCoords) return posCoords;
        if (expCount > 32) return posCoords;

        var cs = [
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y, z + 1],
            [x, y, z - 1],
            [x, y - 1, z],
            [x, y + 1, z]
        ];
        for (var k in cs) {
            var cd = this.getCoordsForLevel(cs[k][0], cs[k][1], cs[k][2], tile.data, exp, expCount)
            if (cd != null) return cd;
        }
        return posCoords;
    },

    isLiquidSource: function(id, data) {
        return (id == 8 || id == 9 || id == 10 || id == 11) && data == 0;
    },

    isLiquidFlow: function(id, data) {
        return (id == 8 || id == 9 || id == 10 || id == 11) && data > 0;
    }
});

