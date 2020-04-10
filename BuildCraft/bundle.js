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
    EngineHeat[EngineHeat["BLUE"] = 0] = "BLUE";
    EngineHeat[EngineHeat["GREEN"] = 1] = "GREEN";
    EngineHeat[EngineHeat["ORANGE"] = 2] = "ORANGE";
    EngineHeat[EngineHeat["RED"] = 3] = "RED";
    EngineHeat[EngineHeat["BLACK"] = 4] = "BLACK";
})(EngineHeat || (EngineHeat = {}));
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
    function EngineAnimation(coords, type) {
        this.coords = coords;
        this.type = type;
        Debug.m("constructor EngineAnimation");
        this.baseAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        this.trunkAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        this.pistonAnimation = new Animation.Base(this.coords.x + .5, this.coords.y + .5, this.coords.z + .5);
        Debug.m(this.type);
        this.baseRender = new BaseRender("creative");
        this.trunkRender = new TrunkRender("creative");
        this.pistonRender = new PistonRender("creative");
        this.initAnimations();
    }
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
    EngineAnimation.prototype.update = function () {
    };
    return EngineAnimation;
}());
var TileEntityProvider = /** @class */ (function () {
    function TileEntityProvider(blockId, model) {
        this.blockId = blockId;
        this.model = model;
        TileEntity.registerPrototype(blockId, model);
    }
    return TileEntityProvider;
}());
/// <reference path="components/EngineBlock.ts" />
/// <reference path="components/EngineItem.ts" />
/// <reference path="components/EngineAnimation.ts" />
/// <reference path="EngineHeat.ts" />
/// <reference path="EngineType.ts" />
/// <reference path="TileEntityProvider.ts" />
/// <reference path="../Coords.ts" />
var BCEngine = /** @class */ (function () {
    function BCEngine(type) {
        this.type = type;
        this.tileEntityObject = {
            init: function () {
                alert("init ");
                Debug.m(this.type);
                this.animation = new EngineAnimation(BlockPos.getCoords(this), this.type);
            },
            tick: function () {
                this.animation.update();
            },
            animation: null
        };
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);
        this.tileEntityProvider = new TileEntityProvider(this.block.id, this.tileEntityObject);
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
