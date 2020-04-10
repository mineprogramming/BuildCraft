var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
IMPORT("StorageInterface");
var BlockPos = /** @class */ (function () {
    function BlockPos(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    BlockPos.getCoords = function (variable) {
        return new BlockPos(parseInt(variable.x), parseInt(variable.y), parseInt(variable.z));
    };
    return BlockPos;
}());
var EngineBlock = /** @class */ (function () {
    function EngineBlock(registryId) {
        this.registryId = registryId;
        this.stringId = "engine" + this.registryId;
        this.registerBlock();
        this.registerDropFunction();
        this.id = BlockID[this.stringId];
    }
    EngineBlock.prototype.registerBlock = function () {
        IDRegistry.genBlockID(this.stringId);
        Block.createBlock(this.stringId, [{ name: this.stringId, texture: [["empty", 0]], inCreative: false }]);
    };
    EngineBlock.prototype.registerDropFunction = function () {
        Block.registerDropFunction(this.id, function () {
            return [];
        });
    };
    return EngineBlock;
}());
var EngineItem = /** @class */ (function () {
    function EngineItem(registryId, engineBlock) {
        this.registryId = registryId;
        this.engineBlock = engineBlock;
        this.stringId = "engine" + this.registryId;
        this.registerItem();
        this.id = ItemID[this.stringId];
    }
    EngineItem.prototype.registerItem = function () {
        IDRegistry.genItemID(this.stringId);
        Item.createItem(this.stringId, this.getName(), { name: "engine_" + this.registryId });
        alert("Item Registred " + this.stringId);
    };
    EngineItem.prototype.getName = function () {
        return this.registryId + " Engine";
    };
    ;
    return EngineItem;
}());
var EngineHeat;
(function (EngineHeat) {
    EngineHeat["BLUE"] = "BLUE";
    EngineHeat["GREEN"] = "GREEN";
    EngineHeat["ORANGE"] = "ORANGE";
    EngineHeat["RED"] = "RED";
    EngineHeat["BLACK"] = "BLACK";
})(EngineHeat || (EngineHeat = {}));
var HeatOrder = [
    EngineHeat.BLUE,
    EngineHeat.GREEN,
    EngineHeat.ORANGE,
    EngineHeat.RED,
    EngineHeat.BLACK
];
var EngineType;
(function (EngineType) {
    EngineType["creative"] = "creative";
    EngineType["iron"] = "iron";
    EngineType["redstone"] = "redstone";
    EngineType["stirling"] = "stirling";
    EngineType["custom"] = "custom";
})(EngineType || (EngineType = {}));
var RenderManager = /** @class */ (function () {
    function RenderManager() {
    }
    RenderManager.getRender = function (renderName) {
    };
    RenderManager.renders = {
        engine: {}
    };
    return RenderManager;
}());
var EngineRender = /** @class */ (function () {
    function EngineRender(texture) {
        this.texture = texture;
        this.render = new Render({ skin: "model/" + this.texture.getTexture() });
        this.render.setPart("head", this.getModelData(), this.texture.getSize());
    }
    EngineRender.prototype.getID = function () {
        return this.render.getId();
    };
    EngineRender.prototype.rebuild = function () {
        this.render.rebuild();
    };
    EngineRender.prototype.getModelData = function () {
        return [];
    };
    return EngineRender;
}());
var TexturesOffset = {
    engine: {
        base: {
            creative: { x: 320, y: 96 },
            iron: "iron",
            redstone: "redstone",
            stirling: "stirling",
            custom: "custom"
        },
        piston: {}
    },
    trunk: {
        BLUE: { x: 64, y: 0 },
        GREEN: { x: 64, y: 32 },
        ORANGE: { x: 64, y: 64 },
        RED: { x: 64, y: 96 },
        BLACK: { x: 64, y: 128 }
    }
};
var ModelTexture = /** @class */ (function () {
    function ModelTexture(offset) {
        this.offset = offset;
        this.name = "buildcraft_engine_atlas.png";
    }
    ModelTexture.prototype.getUV = function () {
        return this.offset;
    };
    ModelTexture.prototype.getSize = function () {
        return { width: 512, height: 512 };
    };
    ModelTexture.prototype.getTexture = function () {
        return this.name;
    };
    ModelTexture.prototype.textureMatches = function (texture) {
        return this.name == texture.name;
    };
    return ModelTexture;
}());
/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
var BaseRender = /** @class */ (function (_super) {
    __extends(BaseRender, _super);
    function BaseRender(type) {
        return _super.call(this, new ModelTexture(TexturesOffset.engine.base[type])) || this;
    }
    BaseRender.prototype.getModelData = function () {
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: -6,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 4,
                    y: 16,
                    z: 16
                }
            }
        ];
    };
    return BaseRender;
}(EngineRender));
/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
var TrunkRender = /** @class */ (function (_super) {
    __extends(TrunkRender, _super);
    function TrunkRender(type) {
        return _super.call(this, new ModelTexture(TexturesOffset.trunk["BLUE"])) || this;
    }
    TrunkRender.prototype.getModelData = function () {
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: .01,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 16,
                    y: 8,
                    z: 8
                }
            }
        ];
    };
    return TrunkRender;
}(EngineRender));
/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
var PistonRender = /** @class */ (function (_super) {
    __extends(PistonRender, _super);
    function PistonRender(type) {
        return _super.call(this, new ModelTexture(TexturesOffset.engine.base["creative"])) || this;
    }
    PistonRender.prototype.getModelData = function () {
        return [
            {
                type: "box",
                uv: this.texture.getUV(),
                coords: {
                    x: -2,
                    y: 24,
                    z: 0,
                },
                size: {
                    x: 4,
                    y: 16,
                    z: 16
                }
            }
        ];
    };
    return PistonRender;
}(EngineRender));
/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/TrunkRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
var EngineAnimation = /** @class */ (function () {
    function EngineAnimation(pos, type) {
        this.type = type;
        this.pistonPosition = 0; //TODO add getter and setter
        this.pushingMultiplier = 1;
        this.coords = { x: pos.x + .5, y: pos.y + .5, z: pos.z + .5 };
        this.baseAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.trunkAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.pistonAnimation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.pistonAnimation.setInterpolationEnabled(true);
        this.baseRender = new BaseRender("creative");
        this.trunkRender = new TrunkRender("creative");
        this.pistonRender = new PistonRender("creative");
        this.initAnimations();
    }
    EngineAnimation.prototype.isReadyToDeployEnergy = function () {
        return this.pistonPosition > 24;
    };
    EngineAnimation.prototype.initAnimations = function () {
        this.baseAnimation.describe({ render: this.baseRender.getID() });
        this.baseAnimation.load();
        this.trunkAnimation.describe({ render: this.trunkRender.getID() });
        this.trunkAnimation.load();
        this.pistonAnimation.describe({ render: this.pistonRender.getID() });
        this.pistonAnimation.load();
        //this.baseAnimation.render.transform.rotate(Math.PI/3, Math.PI/2 , Math.PI/4);
        //this.baseRender.rebuild();
    };
    EngineAnimation.prototype.update = function (power) {
        this.pushingMultiplier = this.pistonPosition < 0 ? 1 : this.pushingMultiplier;
        this.pistonPosition += power * this.pushingMultiplier;
        this.pistonAnimation.setPos(this.coords.x + this.pistonPosition / 50, this.coords.y, this.coords.z);
    };
    EngineAnimation.prototype.goBack = function () {
        this.pushingMultiplier = -1;
    };
    return EngineAnimation;
}());
/// <reference path="components/EngineBlock.ts" />
/// <reference path="components/EngineItem.ts" />
/// <reference path="components/EngineAnimation.ts" />
/// <reference path="EngineHeat.ts" />
/// <reference path="EngineType.ts" />
/// <reference path="../Coords.ts" />
var BCEngineTileEntity = /** @class */ (function () {
    function BCEngineTileEntity(maxHeat, type) {
        this.maxHeat = maxHeat;
        this.type = type;
        this.data = {
            energy: 0,
            heat: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.defaultValues = {
            energy: 0,
            heat: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.engineAnimation = null;
    } //all members should be public
    BCEngineTileEntity.prototype.init = function () {
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.type);
    };
    BCEngineTileEntity.prototype.tick = function () {
        this.engineAnimation.update(this.data.power);
        this.updatePower();
        this.data.heatStage = HeatOrder[Math.min(3, Math.max(0, this.getHeatStage() || 0))];
        this.setPower(this.getHeatStage() + .4);
        this.data.heat = Math.min(Math.max(this.data.heat, this.maxHeat), 100);
        if (this.engineAnimation.isReadyToDeployEnergy()) {
            this.engineAnimation.goBack();
            this.deployEnergyToTarget();
        }
    };
    BCEngineTileEntity.prototype.getHeatStage = function () {
        var index = Math.floor(this.data.heat / this.maxHeat * 3);
        return index;
    };
    BCEngineTileEntity.prototype.updatePower = function () {
        var change = .04;
        var add = this.data.targetPower - this.data.power;
        if (add > change) {
            add = change;
        }
        if (add < -change) {
            add = -change;
        }
        this.data.power += add;
    };
    BCEngineTileEntity.prototype.setPower = function (power) {
        this.data.targetPower = power;
    };
    BCEngineTileEntity.prototype.deployEnergyToTarget = function () {
        //TODO deploy
    };
    return BCEngineTileEntity;
}());
var BCEngine = /** @class */ (function () {
    function BCEngine(type) {
        this.type = type;
        this.maxHeat = 100;
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);
        TileEntity.registerPrototype(this.block.id, new BCEngineTileEntity(this.maxHeat, this.type));
        var self = this;
        Item.registerUseFunction(this.item.stringId, function (coords, item, block) {
            Debug.m(coords.relative);
            self.setBlock(coords.relative);
        });
    }
    BCEngine.prototype.setBlock = function (coords) {
        World.setBlock(coords.x, coords.y, coords.z, this.block.id, 0);
        World.addTileEntity(coords.x, coords.y, coords.z);
    };
    return BCEngine;
}());
/// <reference path="BCEngine.ts" />
/// <reference path="EngineType.ts" />
var CreativeEngine = /** @class */ (function (_super) {
    __extends(CreativeEngine, _super);
    function CreativeEngine() {
        return _super.call(this, EngineType.creative) || this;
    }
    return CreativeEngine;
}(BCEngine));
/// <reference path="CreativeEngine.ts" />
var creativeEngine = new CreativeEngine();
