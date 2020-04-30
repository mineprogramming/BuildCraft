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
IMPORT("StorageInterface");
IMPORT("EnergyNet");
// you can see this files in
// BuildCraft/lib/
// !only bundle folder should contain lib files
/// <reference path="importLib.ts" />
var RF = EnergyTypeRegistry.assureEnergyType("RF", .25);
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
var engineBlockType = {
    base: 1,
    opaque: false
};
// TODO complete blockType before release
var EngineBlock = /** @class */ (function () {
    function EngineBlock(registryId) {
        this.registryId = registryId;
        this.stringId = "engine" + this.registryId;
        this.registerBlock();
        this.id = BlockID[this.stringId];
    }
    EngineBlock.prototype.registerBlock = function () {
        IDRegistry.genBlockID(this.stringId);
        Block.createBlock(this.stringId, [{ name: this.stringId, texture: [["empty", 0]], inCreative: false }], engineBlockType);
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
    };
    EngineItem.prototype.getName = function () {
        return this.registryId + " Engine";
    };
    ;
    return EngineItem;
}());
var EngineRotation;
(function (EngineRotation) {
    EngineRotation[EngineRotation["X"] = 1] = "X";
    EngineRotation[EngineRotation["Y"] = 0] = "Y";
    EngineRotation[EngineRotation["Z"] = 2] = "Z";
})(EngineRotation || (EngineRotation = {}));
/// <reference path="../../EngineHeat.ts" />
/// <reference path="../EngineRotation.ts" />
/// <reference path="ITexture.ts" />
var STANDART_TEXTURE = "model/buildcraft_engine_atlas.png";
var STANDART_SIZE = { width: 512, height: 512 };
var EngineTexture = /** @class */ (function () {
    function EngineTexture(name, baseOffset, size) {
        this.name = name;
        this.baseOffset = baseOffset;
        this.size = size;
    }
    EngineTexture.prototype.getTrunkUV = function (heat, rotation) {
        return { x: 64 * rotation, y: 32 * HeatOrder.indexOf(heat) };
    };
    EngineTexture.prototype.getBaseUV = function (rotation) {
        return { x: this.baseOffset.x + 64 * rotation, y: this.baseOffset.y };
    };
    return EngineTexture;
}());
var RenderManager = /** @class */ (function () {
    function RenderManager() {
    }
    RenderManager.getRender = function (groupName) {
        return this.renders.pop();
    };
    RenderManager.store = function (render) {
        this.renders.push(render);
    };
    RenderManager.renders = [];
    return RenderManager;
}());
/// <reference path="../texture/EngineTexture.ts" />
/// <reference path="RenderManager.ts" />
var EngineRender = /** @class */ (function () {
    function EngineRender(engineTexture) {
        this.engineTexture = engineTexture;
        this.boxes = [];
        this.render = RenderManager.getRender() || new Render({ skin: this.engineTexture.name });
    }
    EngineRender.prototype.refresh = function () {
        this.render.setPart("head", this.getModelData(), this.engineTexture.size);
    };
    EngineRender.prototype.stash = function () {
        RenderManager.store(this.render);
    };
    EngineRender.prototype.getID = function () {
        return this.render.getId();
    };
    EngineRender.prototype.getModelData = function () {
        return this.boxes;
    };
    return EngineRender;
}());
/// <reference path="EngineRender.ts" />
var BaseRender = /** @class */ (function (_super) {
    __extends(BaseRender, _super);
    function BaseRender() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boxes = [{
                type: "box",
                uv: null,
                coords: null,
                size: null
            },
            {
                type: "box",
                uv: null,
                coords: null,
                size: null
            }];
        return _this;
    }
    Object.defineProperty(BaseRender.prototype, "baseCoords", {
        set: function (value) {
            this.boxes[0].coords = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRender.prototype, "baseUV", {
        set: function (value) {
            this.boxes[0].uv = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRender.prototype, "baseSize", {
        set: function (value) {
            this.boxes[0].size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRender.prototype, "trunkCoords", {
        set: function (value) {
            this.boxes[1].coords = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRender.prototype, "trunkSize", {
        set: function (value) {
            this.boxes[1].size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseRender.prototype, "trunkUV", {
        set: function (value) {
            this.boxes[1].uv = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseRender.prototype.getModelData = function () {
        return this.boxes;
    };
    return BaseRender;
}(EngineRender));
/// <reference path="EngineRender.ts" />
var PistonRender = /** @class */ (function (_super) {
    __extends(PistonRender, _super);
    function PistonRender() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boxes = [{
                type: "box",
                uv: null,
                coords: null,
                size: null
            }];
        return _this;
    }
    Object.defineProperty(PistonRender.prototype, "pistonCoords", {
        set: function (value) {
            this.boxes[0].coords = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PistonRender.prototype, "pistonUV", {
        set: function (value) {
            this.boxes[0].uv = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PistonRender.prototype, "pistonSize", {
        set: function (value) {
            this.boxes[0].size = value;
        },
        enumerable: true,
        configurable: true
    });
    PistonRender.prototype.getModelData = function () {
        return this.boxes;
    };
    return PistonRender;
}(EngineRender));
/// <reference path="../../model/render/EngineRender.ts" />
/// <reference path="../../../Coords.ts" />
var AnimationComponent = /** @class */ (function () {
    function AnimationComponent(pos, render) {
        this.render = render;
        this.coords = { x: pos.x + .5, y: pos.y + 15 / 16, z: pos.z + .5 };
        this.animation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.animation.describe({ render: this.render.getID() });
        this.animation.load();
    }
    AnimationComponent.prototype.updateRender = function (render) {
        this.render.stash();
        this.render = render;
        this.animation.describe({ render: this.render.getID() });
        this.animation.refresh();
    };
    AnimationComponent.prototype.destroy = function () {
        this.render.stash();
        this.animation.destroy();
    };
    return AnimationComponent;
}());
/// <reference path="./AnimationComponent.ts" />
var PistonAnimation = /** @class */ (function (_super) {
    __extends(PistonAnimation, _super);
    function PistonAnimation(pos, engineTexture) {
        var _this = this;
        var render = new PistonRender(engineTexture);
        _this = _super.call(this, pos, render) || this;
        return _this;
    }
    PistonAnimation.prototype.setPosition = function (pistonPosition) {
        var move = {
            x: this.rotation === EngineRotation.X ? pistonPosition * this.direction : 0,
            y: this.rotation === EngineRotation.Y ? pistonPosition * -this.direction : 0,
            z: this.rotation === EngineRotation.Z ? pistonPosition * -this.direction : 0
        }; // !dont touch -1 or fix root of evil
        this.animation.setPos(this.coords.x + move.x, this.coords.y + move.y, this.coords.z + move.z);
    };
    return PistonAnimation;
}(AnimationComponent));
/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineHeat.ts" />
/// <reference path="../../model/texture/EngineTexture.ts" />
var BaseAnimation = /** @class */ (function (_super) {
    __extends(BaseAnimation, _super);
    function BaseAnimation(pos, engineTexture) {
        var _this = this;
        var render = new BaseRender(engineTexture);
        _this = _super.call(this, pos, render) || this;
        return _this;
    }
    return BaseAnimation;
}(AnimationComponent));
/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="../model/EngineRotation.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />
var EngineAnimation = /** @class */ (function () {
    function EngineAnimation(coords, heatStage, engineTexture) {
        this.coords = coords;
        this.heatStage = heatStage;
        this.engineTexture = engineTexture;
        this.pistonPosition = 0; // TODO make setter
        this.pushingMultiplier = 1;
        this.yOffset = 31; // magic const
        this.side = 1; // connected side index
        this.directions = [
            { rotation: EngineRotation.Y, direction: -1 },
            { rotation: EngineRotation.Y, direction: 1 },
            { rotation: EngineRotation.Z, direction: -1 },
            { rotation: EngineRotation.Z, direction: 1 },
            { rotation: EngineRotation.X, direction: 1 },
            { rotation: EngineRotation.X, direction: -1 }
        ];
        this.piston = new PistonAnimation(coords, engineTexture);
        this.base = new BaseAnimation(coords, engineTexture);
    }
    Object.defineProperty(EngineAnimation.prototype, "connectionSide", {
        get: function () {
            return this.side;
        },
        set: function (value) {
            this.side = value;
            this.rotateByMeta();
        },
        enumerable: true,
        configurable: true
    });
    EngineAnimation.prototype.update = function (power, heat) {
        this.updateTrunkHeat(heat);
        this.movePiston(power);
    };
    EngineAnimation.prototype.updateTrunkHeat = function (heat) {
        if (this.heatStage !== heat) {
            this.heatStage = heat;
            this.base.render.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, this.directions[this.side].rotation);
            this.base.render.refresh();
        }
    };
    EngineAnimation.prototype.movePiston = function (power) {
        this.pushingMultiplier = this.pistonPosition < 0 ? 1 : this.pushingMultiplier;
        this.pistonPosition += power * this.pushingMultiplier / 64; // 64 is magical multiplier
        this.piston.setPosition(this.pistonPosition);
    };
    EngineAnimation.prototype.isReadyToGoBack = function () {
        return this.pistonPosition > .5;
    };
    EngineAnimation.prototype.goBack = function () {
        this.pushingMultiplier = -1;
    };
    EngineAnimation.prototype.rotateByMeta = function () {
        var data = this.directions[this.side];
        this.createPiston(data.rotation, data.direction);
    };
    EngineAnimation.prototype.destroy = function () {
        this.base.destroy();
        this.piston.destroy();
    };
    // Legacy, but it still work
    EngineAnimation.prototype.createPiston = function (rotation, direction) {
        var coords = { x: 0, y: 0, z: 0 };
        switch (rotation) {
            case EngineRotation.X:
                coords.x = direction;
                break;
            case EngineRotation.Y:
                coords.y = direction;
                break;
            case EngineRotation.Z:
                coords.z = direction;
                break;
        }
        ;
        this.setupBaseBoxes(coords);
        var baseRender = this.base.render;
        baseRender.baseUV = this.engineTexture.getBaseUV(rotation);
        this.setupTrunkBoxes(coords);
        baseRender.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, rotation);
        baseRender.refresh();
        this.setupPistonBoxes(coords);
        var pistonRender = this.piston.render;
        pistonRender.pistonUV = this.engineTexture.getBaseUV(rotation);
        pistonRender.refresh();
        // piston Move Vector setup
        this.piston.direction = -direction;
        this.piston.rotation = rotation;
    };
    EngineAnimation.prototype.setupBaseBoxes = function (coords) {
        this.base.render.baseCoords = {
            x: coords.x * 6,
            y: this.yOffset + coords.y * 6,
            z: coords.z * 6,
        };
        this.base.render.baseSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        };
    };
    EngineAnimation.prototype.setupTrunkBoxes = function (coords) {
        this.base.render.trunkCoords = {
            x: -coords.x * .1,
            y: this.yOffset - coords.y * .1,
            z: -coords.z * .1
        };
        this.base.render.trunkSize = {
            x: 8 + 8 * (Math.abs(coords.x)),
            y: 8 + 8 * (Math.abs(coords.y)),
            z: 8 + 8 * (Math.abs(coords.z))
        };
    };
    EngineAnimation.prototype.setupPistonBoxes = function (coords) {
        this.piston.render.pistonCoords = {
            x: coords.x * 2,
            y: this.yOffset + coords.y * 2,
            z: coords.z * 2
        };
        this.piston.render.pistonSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        };
    };
    return EngineAnimation;
}());
/// <reference path="../components/EngineAnimation.ts" />
/// <reference path="../../energy.ts" />
// test
IDRegistry.genBlockID("WIRE");
Block.createBlock("WIRE", [{ name: "WIRE", texture: [["stone", 0]], inCreative: true }]);
RF.registerWire(BlockID["WIRE"]);
var BCEngineTileEntity = /** @class */ (function () {
    function BCEngineTileEntity(maxHeat, texture) {
        this.maxHeat = maxHeat;
        this.texture = texture;
        this.data = {
            meta: null,
            energy: 0,
            heat: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.defaultValues = {
            meta: null,
            energy: 0,
            heat: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.engineAnimation = null;
    }
    Object.defineProperty(BCEngineTileEntity.prototype, "meta", {
        get: function () {
            if (!this.data.meta) {
                this.data.meta = this.getConnectionSide();
            }
            return this.data.meta;
        },
        set: function (value) {
            this.data.meta = value;
            this.engineAnimation.connectionSide = value;
        },
        enumerable: true,
        configurable: true
    });
    BCEngineTileEntity.prototype.init = function () {
        this.meta = this.getConnectionSide();
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.data.heatStage, this.texture);
        this.engineAnimation.connectionSide = this.meta;
    };
    BCEngineTileEntity.prototype.tick = function () {
        this.engineAnimation.update(this.data.power, this.data.heatStage);
        this.updatePower();
        this.data.heatStage = HeatOrder[Math.min(3, Math.max(0, this.getHeatStage() || 0))];
        this.setPower(this.getHeatStage() + .4);
        this.data.heat = Math.min(Math.max(this.data.heat, this.maxHeat), 100);
        if (this.engineAnimation.isReadyToGoBack()) {
            this.engineAnimation.goBack();
            this.deployEnergyToTarget();
        }
    };
    BCEngineTileEntity.prototype.destroy = function () {
        this.engineAnimation.destroy();
    };
    BCEngineTileEntity.prototype.getConnectionSide = function () {
        for (var i = 0; i < 6; i++) {
            var relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            var block = World.getBlock(relCoords.x, relCoords.y, relCoords.z);
            if (EnergyTypeRegistry.isWire(block.id, "RF")) {
                return i;
            }
        }
        return 2;
    };
    BCEngineTileEntity.prototype.getHeatStage = function () {
        return Math.floor(this.data.heat / this.maxHeat * 3);
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
        // TODO deploy
    };
    return BCEngineTileEntity;
}());
/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/EngineItem.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../../Coords.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
var BCEngine = /** @class */ (function () {
    function BCEngine() {
        this.maxHeat = 100;
        this.block = new EngineBlock(this.engineType);
        this.item = new EngineItem(this.engineType, this.block);
        this.registerTileEntity();
        TileEntity.registerPrototype(this.block.id, this.tileEntity);
        this.registerUse();
        this.registerDrop();
    }
    Object.defineProperty(BCEngine.prototype, "engineType", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BCEngine.prototype, "texture", {
        get: function () {
            return this.engineTexture;
        },
        enumerable: true,
        configurable: true
    });
    BCEngine.prototype.registerTileEntity = function () {
        this.tileEntity = new BCEngineTileEntity(this.maxHeat, this.texture);
    };
    BCEngine.prototype.registerUse = function () {
        var _this = this;
        Item.registerUseFunction(this.item.stringId, function (coords, item, block) {
            Player.decreaseCarriedItem();
            _this.setBlock(coords.relative);
        });
    };
    BCEngine.prototype.registerDrop = function () {
        var _this = this;
        Block.registerDropFunction(this.block.stringId, function () {
            return [[_this.item.id, 1, 0]];
        });
    };
    BCEngine.prototype.setBlock = function (coords) {
        World.setBlock(coords.x, coords.y, coords.z, this.block.id, 0);
        World.addTileEntity(coords.x, coords.y, coords.z);
    };
    return BCEngine;
}());
var BCCreativeEngineTileEntity = /** @class */ (function (_super) {
    __extends(BCCreativeEngineTileEntity, _super);
    function BCCreativeEngineTileEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BCCreativeEngineTileEntity;
}(BCEngineTileEntity));
/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="CreativeEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
var CreativeEngine = /** @class */ (function (_super) {
    __extends(CreativeEngine, _super);
    function CreativeEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CreativeEngine.prototype, "engineType", {
        get: function () {
            return "creative";
        },
        enumerable: true,
        configurable: true
    });
    CreativeEngine.prototype.registerTileEntity = function () {
        var baseOffset = { x: 256, y: 96 };
        this.tileEntity = new BCCreativeEngineTileEntity(this.maxHeat, new EngineTexture(STANDART_TEXTURE, baseOffset, STANDART_SIZE));
    };
    return CreativeEngine;
}(BCEngine));
/// <reference path="creative/CreativeEngine.ts" />
var creativeEngine = new CreativeEngine();
