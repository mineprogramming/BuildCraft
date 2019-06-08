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
        this.data.redstone = signal.power > 8;
    };
} else {
    BUILDCRAFT_ENGINE_PROTOTYPE.defaultValues.redstone = true;
}


Callback.addCallback("BC-DefineEngines", function(ICore){
    // TODO: IC2 integration
    TileEntity.registerPrototype(BlockID.bcEngine, BUILDCRAFT_ENGINE_PROTOTYPE);
});


