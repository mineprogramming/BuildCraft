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
var EngineBlock = /** @class */ (function () {
    function EngineBlock(registryId) {
        this.registryId = registryId;
        this.stringId = "engine" + this.registryId;
        this.registerBlock();
        this.id = BlockID[this.stringId];
    }
    EngineBlock.prototype.registerBlock = function () {
        IDRegistry.genBlockID(this.stringId);
        Block.createBlock(this.stringId, [{ name: this.stringId, texture: [["empty", 0]], inCreative: false }]);
        var staticModel = new BlockRenderer.Model();
        // модификация модели staticModel
        var icRenderModel = new ICRender.Model();
        icRenderModel.addEntry(staticModel);
        BlockRenderer.setStaticICRender(this.id, -1, icRenderModel);
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
var RenderManager = /** @class */ (function () {
    function RenderManager() {
    }
    RenderManager.getRender = function (groupName) {
        if (this.availableRenders[groupName]) {
            return this.availableRenders[groupName].pop();
        }
        return null;
    };
    RenderManager.addToGroup = function (groupName, render) {
        if (!this.availableRenders[groupName]) {
            this.availableRenders[groupName] = [];
        }
        this.availableRenders[groupName].push(render);
    };
    RenderManager.availableRenders = {
    // groupName : [ render0, render1]
    };
    return RenderManager;
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
/// <reference path="../ModelTexture.ts" />
/// <reference path="RenderManager.ts" />
var EngineRender = /** @class */ (function () {
    function EngineRender(type) {
        this.type = type;
        this.texture = new ModelTexture(this.getTextureOffset());
        this.render = RenderManager.getRender(this.getGroupName()) || this.createNewRender();
    }
    EngineRender.prototype.createNewRender = function () {
        var render = new Render({ skin: "model/" + this.texture.getTexture() });
        render.setPart("head", this.getModelData(), this.texture.getSize());
        return render;
    };
    EngineRender.prototype.getGroupPrefix = function () {
        return "EngineRender";
    };
    EngineRender.prototype.getGroupName = function () {
        return this.getGroupPrefix() + this.type;
    };
    EngineRender.prototype.getTextureOffset = function () {
        return TexturesOffset.engine.base[this.type];
    };
    EngineRender.prototype.stash = function () {
        RenderManager.addToGroup(this.getGroupName(), this.render);
    };
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
/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
var BaseRender = /** @class */ (function (_super) {
    __extends(BaseRender, _super);
    function BaseRender(type, heat) {
        var _this = _super.call(this, type) || this;
        _this.trunkTextrueUV = TexturesOffset.trunk.BLUE;
        _this.updateHeatStage(heat);
        return _this;
    }
    BaseRender.prototype.getGroupPrefix = function () {
        return "BaseRender";
    };
    BaseRender.prototype.updateHeatStage = function (heat) {
        //  Debug.m("Current UV");
        // Debug.m(this.trunkTextrueUV);
        this.trunkTextrueUV = TexturesOffset.trunk[heat];
    };
    BaseRender.prototype.getModelData = function () {
        Debug.m(this.trunkTextrueUV);
        Debug.m("BLUE");
        Debug.m(TexturesOffset.trunk.BLUE);
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
            },
            {
                type: "box",
                uv: this.trunkTextrueUV,
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
    return BaseRender;
}(EngineRender));
/// <reference path="EngineRender.ts" />
/// <reference path="../ModelTexture.ts" />
var TrunkRender = /** @class */ (function (_super) {
    __extends(TrunkRender, _super);
    function TrunkRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrunkRender.prototype.getGroupPrefix = function () {
        return "TrunkRender";
    };
    TrunkRender.prototype.getTextureOffset = function () {
        return TexturesOffset.trunk[this.type];
    };
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
    function PistonRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PistonRender.prototype.getGroupPrefix = function () {
        return "PistonRender";
    };
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
/// <reference path="../../model/render/EngineRender.ts" />
/// <reference path="../../../Coords.ts" />
var AnimationComponent = /** @class */ (function () {
    function AnimationComponent(pos, render) {
        this.render = render;
        this.coords = { x: pos.x + .5, y: pos.y + .5, z: pos.z + .5 };
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
    AnimationComponent.prototype.rotate = function (rotation) {
        this.animation.render.transform.rotate(rotation.x, rotation.y, rotation.z);
        this.render.rebuild();
    };
    AnimationComponent.prototype.destroy = function () {
        this.render.stash();
        this.animation.destroy();
    };
    return AnimationComponent;
}());
/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
var PistonAnimation = /** @class */ (function (_super) {
    __extends(PistonAnimation, _super);
    function PistonAnimation(pos, type) {
        return _super.call(this, pos, new PistonRender(type)) || this;
    }
    PistonAnimation.prototype.setPosition = function (pistonPosition) {
        this.animation.setPos(this.coords.x + pistonPosition, this.coords.y, this.coords.z);
    };
    return PistonAnimation;
}(AnimationComponent));
/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
/// <reference path="../../EngineHeat.ts" />
var BaseAnimation = /** @class */ (function (_super) {
    __extends(BaseAnimation, _super);
    function BaseAnimation(pos, type, heat) {
        var _this = this;
        var render = new BaseRender(type, heat);
        _this = _super.call(this, pos, render) || this;
        return _this;
        // this.render = render;
    }
    BaseAnimation.prototype.updateHeat = function (heat) {
        this.render.updateHeatStage(heat);
        // this.render.rebuild();
        this.animation.refresh();
    };
    return BaseAnimation;
}(AnimationComponent));
/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/TrunkRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="animation/AnimationComponent.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />
var EngineAnimation = /** @class */ (function () {
    function EngineAnimation(coords, type, heatStage) {
        this.coords = coords;
        this.type = type;
        this.heatStage = heatStage;
        this.pistonPosition = 0;
        this.pushingMultiplier = 1;
        // this.trunk = new AnimationComponent(coords, new TrunkRender(this.heatStage));
        this.piston = new PistonAnimation(coords, this.type);
        this.base = new BaseAnimation(coords, this.type, this.heatStage);
    }
    EngineAnimation.prototype.update = function (power, heat) {
        if (this.heatStage !== heat) {
            this.base.updateHeat(heat);
            this.heatStage = heat;
        }
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
    EngineAnimation.prototype.destroy = function () {
        this.base.destroy();
        // this.trunk.destroy();
        this.piston.destroy();
    };
    return EngineAnimation;
}());
/// <reference path="../components/EngineAnimation.ts" />
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
    }
    BCEngineTileEntity.prototype.init = function () {
        this.engineAnimation = new EngineAnimation(BlockPos.getCoords(this), this.type, this.data.heatStage);
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
/// <reference path="../EngineType.ts" />
/// <reference path="../../Coords.ts" />
/// <reference path="BCEngineTileEntity.ts" />
var BCEngine = /** @class */ (function () {
    function BCEngine(type) {
        this.type = type;
        this.maxHeat = 100;
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);
        TileEntity.registerPrototype(this.block.id, new BCEngineTileEntity(this.maxHeat, this.type));
        this.registerUse();
        this.registerDrop();
    }
    BCEngine.prototype.registerUse = function () {
        var _this = this;
        Item.registerUseFunction(this.item.stringId, function (coords, item, block) {
            Debug.m(coords.relative);
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
/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="../EngineType.ts" />
var CreativeEngine = /** @class */ (function (_super) {
    __extends(CreativeEngine, _super);
    function CreativeEngine() {
        return _super.call(this, EngineType.creative) || this;
    }
    return CreativeEngine;
}(BCEngine));
/// <reference path="creative/CreativeEngine.ts" />
var creativeEngine = new CreativeEngine();
var BCCreativeEngineTileEntity = /** @class */ (function (_super) {
    __extends(BCCreativeEngineTileEntity, _super);
    function BCCreativeEngineTileEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BCCreativeEngineTileEntity;
}(BCEngineTileEntity));
