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
IMPORT("EnergyNet");
// you can see this files in
// BuildCraft/lib/
// !only bundle folder should contain lib files
/// <reference path="importLib.ts" />
var RF = EnergyTypeRegistry.assureEnergyType("RF", .25);
/// <reference path="../core/energy.ts" />
IDRegistry.genBlockID("Capacitor");
Block.createBlock("Capacitor", [{ name: "Capacitor", texture: [["stone", 0]], inCreative: true }]);
TileEntity.registerPrototype(BlockID["Capacitor"], {
    defaultValues: {
        progress: 0
    },
    energyReceive: function (type, amount, voltage) {
        this.data.progress += amount;
        return amount;
    },
    tick: function () {
        if (this.data.progress >= 100) {
            this.data.progress -= 100;
            World.drop(this.x, this.y + 1, this.z, 264, 1, 0);
        }
    }
});
EnergyTileRegistry.addEnergyTypeForId(BlockID["Capacitor"], RF);
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
    base: 1
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
/// <reference path="../../model/render/EngineRender.ts" />
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
/// <reference path="../model/EngineRotation.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />
var EngineAnimation = /** @class */ (function () {
    function EngineAnimation(coords, heatStage, engineTexture) {
        this.coords = coords;
        this.heatStage = heatStage;
        this.engineTexture = engineTexture;
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
    EngineAnimation.prototype.update = function (progress, heat) {
        if (progress > 0.5)
            progress = 1 - progress;
        this.updateTrunkHeat(heat);
        this.piston.setPosition(progress);
    };
    EngineAnimation.prototype.updateTrunkHeat = function (heat) {
        if (this.heatStage !== heat) {
            this.heatStage = heat;
            this.base.render.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, this.directions[this.side].rotation);
            this.base.render.refresh();
        }
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
var BCEngineTileEntity = /** @class */ (function () {
    // TODO remove constructor
    function BCEngineTileEntity(texture) {
        this.texture = texture;
        this.MIN_HEAT = 20;
        this.IDEAL_HEAT = 100;
        this.MAX_HEAT = 250;
        this.currentOutput = 0;
        this.isRedstonePowered = false;
        this.energyStage = EngineHeat.BLUE;
        this.progressPart = 0;
        this.isPumping = false; // Used for SMP synch // ?WTF is SMP
        // How many ticks ago it gave out power, capped to 4.
        this.lastTick = 0;
        this.data = {
            meta: null,
            energy: 0,
            heat: this.MIN_HEAT,
            progress: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.defaultValues = {
            meta: null,
            energy: 0,
            heat: this.MIN_HEAT,
            progress: 0,
            power: 0,
            targetPower: 0,
            heatStage: EngineHeat.BLUE
        };
        this.isEngine = true;
        this.engineAnimation = null;
    }
    Object.defineProperty(BCEngineTileEntity.prototype, "orientation", {
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
        this.engineAnimation = new EngineAnimation(this, this.getEnergyStage(), this.texture);
        this.engineAnimation.connectionSide = this.orientation = this.getConnectionSide();
        this.checkRedstonePower();
    };
    BCEngineTileEntity.prototype.tick = function () {
        if (this.lastTick < 4)
            this.lastTick++;
        this.engineAnimation.update(this.data.progress, this.getEnergyStage());
        // from PC
        this.checkRedstonePower();
        /* if (worldObj.isRemote) { // ? is it for client-server?
            if (this.progressPart != 0) {
                this.data.progress += this.getPistonSpeed();

                if (this.data.progress > 1) {
                    this.progressPart = 0;
                    this.data.progress = 0;
                }
            } else if (this.isPumping) {
                this.progressPart = 1;
            }

            return;
        }*/
        this.updateHeat();
        if (this.getEnergyStage() === EngineHeat.BLACK) {
            this.data.energy = Math.max(this.data.energy - 50, 0);
            return;
        }
        this.engineUpdate();
        var tile = this.getEnergyProvider(this.orientation);
        if (this.progressPart != 0) {
            this.data.progress += this.getPistonSpeed();
            if (this.data.progress > 0.5 && this.progressPart == 1) {
                this.progressPart = 2;
            }
            else if (this.data.progress >= 1) {
                this.data.progress = 0;
                this.progressPart = 0;
            }
        }
        else if (this.isRedstonePowered && this.isActive()) {
            if (this.isPoweredTile(tile, this.orientation)) {
                this.progressPart = 1;
                this.setPumping(true);
                if (this.getPowerToExtract() > 0) {
                    this.progressPart = 1;
                    this.setPumping(true);
                }
                else {
                    this.setPumping(false);
                }
            }
            else {
                this.setPumping(false);
            }
        }
        else {
            this.setPumping(false);
        }
        this.burn();
        if (!this.isRedstonePowered) {
            this.currentOutput = 0;
        }
        else if (this.isRedstonePowered && this.isActive()) {
            this.sendPower();
        }
    };
    BCEngineTileEntity.prototype.getConnectionSide = function () {
        for (var i = 0; i < 6; i++) {
            var relCoords = World.getRelativeCoords(this.x, this.y, this.z, i);
            var block = World.getBlock(relCoords.x, relCoords.y, relCoords.z);
            // TODO make it for only RF
            var machine = EnergyTileRegistry.accessMachineAtCoords(relCoords.x, relCoords.y, relCoords.z);
            if (machine) {
                return i;
            }
        }
        return 2;
    };
    BCEngineTileEntity.prototype.getEnergyStage = function () {
        // if (!worldObj.isRemote) { //? client-server
        if (this.energyStage == EngineHeat.BLACK)
            return this.energyStage;
        var newStage = this.computeEnergyStage();
        if (this.energyStage !== newStage) {
            this.energyStage = newStage;
            if (this.energyStage === EngineHeat.BLACK)
                this.overheat();
            // sendNetworkUpdate(); //? client-server
        }
        // }
        return this.energyStage;
    };
    BCEngineTileEntity.prototype.sendPower = function () {
        var tile = this.getEnergyProvider(this.orientation);
        if (this.isPoweredTile(tile, this.orientation)) {
            var extracted = this.getPowerToExtract();
            if (extracted <= 0) {
                this.setPumping(false);
                return;
            }
            this.setPumping(true);
            var oppositeSide = this.getOppositeSide(this.orientation);
            if (tile.isEngine) {
                var neededRF = tile.receiveEnergyFromEngine(oppositeSide, extracted, false);
                this.extractEnergy(neededRF, true);
            }
            else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
                var neededRF = tile.energyReceive("RF", this.data.energy, this.data.energy);
                this.extractEnergy(neededRF, true);
            }
        }
    };
    // ? why we need it? ask PC author about it. Maybe it should be overrided in future
    BCEngineTileEntity.prototype.burn = function () { };
    BCEngineTileEntity.prototype.getPowerToExtract = function () {
        var tile = this.getEnergyProvider(this.orientation);
        if (!tile)
            return 0;
        var oppositeSide = this.getOppositeSide(this.orientation);
        if (tile.isEngine) {
            var maxEnergy = tile.receiveEnergyFromEngine(oppositeSide, this.data.energy, true);
            return this.extractEnergy(maxEnergy, false);
        }
        else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            var maxEnergy = tile.energyReceive("RF", this.data.energy, this.data.energy);
            return this.extractEnergy(maxEnergy, false);
        }
        return 0;
    };
    // TODO make setter for setPumping()
    BCEngineTileEntity.prototype.setPumping = function (isActive) {
        if (this.isPumping == isActive)
            return;
        this.isPumping = isActive;
        this.lastTick = 0;
        // this.sendNetworkUpdate(); // ? is sendNetworkUpdate() for client-server?
    };
    BCEngineTileEntity.prototype.getEnergyProvider = function (orientation) {
        var coords = World.getRelativeCoords(this.x, this.y, this.z, orientation);
        return EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
    };
    BCEngineTileEntity.prototype.checkRedstonePower = function () {
        // checkRedstonePower = false;
        // this.isRedstonePowered = worldObj.isBlockIndirectlyGettingPowered(pos) > 0;
        // TODO make redstone powering
        this.isRedstonePowered = true;
    };
    BCEngineTileEntity.prototype.isActive = function () {
        return true;
    };
    BCEngineTileEntity.prototype.isPoweredTile = function (tile, side) {
        if (!tile)
            return false;
        var oppositeSide = this.getOppositeSide(this.orientation);
        if (tile.isEngine) {
            return tile.canReceiveFromEngine(oppositeSide);
        }
        else if (tile.canReceiveEnergy(oppositeSide, "RF")) {
            // return ((IEnergyConnection) tile).canConnectEnergy(side.getOpposite()); // ? is next line correct
            return tile.canReceiveEnergy(oppositeSide, "RF");
        }
        return false;
    };
    BCEngineTileEntity.prototype.getHeatLevel = function () {
        return (this.data.heat - this.MIN_HEAT) / (this.MAX_HEAT - this.MIN_HEAT);
    };
    BCEngineTileEntity.prototype.computeEnergyStage = function () {
        var energyLevel = this.getHeatLevel();
        if (energyLevel < 0.25) {
            return EngineHeat.BLUE;
        }
        else if (energyLevel < 0.5) {
            return EngineHeat.GREEN;
        }
        else if (energyLevel < 0.75) {
            return EngineHeat.ORANGE;
        }
        else if (energyLevel < 1) {
            return EngineHeat.RED;
        }
        return EngineHeat.BLACK;
    };
    BCEngineTileEntity.prototype.getPistonSpeed = function () {
        return Math.max(0.16 * this.getHeatLevel(), 0.01);
        // ? for client-server
        /*if (!worldObj.isRemote) {
            return Math.max(0.16f * getHeatLevel(), 0.01f);
        }
        switch (getEnergyStage()) {
            case BLUE:
                return 0.02F;
            case GREEN:
                return 0.04F;
            case YELLOW:
                return 0.08F;
            case RED:
                return 0.16F;
            default:
                return 0;
        }*/
    };
    BCEngineTileEntity.prototype.addEnergy = function (addition) {
        if (this.getEnergyStage() == EngineHeat.BLACK)
            return;
        this.data.energy += addition;
        if (this.data.energy > this.getMaxEnergy()) {
            this.data.energy = this.getMaxEnergy();
        }
    };
    BCEngineTileEntity.prototype.getEnergyStored = function () {
        return this.data.energy;
    };
    BCEngineTileEntity.prototype.getMaxEnergyStored = function () {
        return this.getMaxEnergy();
    };
    BCEngineTileEntity.prototype.extractEnergy = function (energyMax, doExtract) {
        var max = Math.min(energyMax, this.getCurrentOutputLimit());
        var extracted;
        var energy = this.data.energy;
        if (energy >= max) {
            extracted = max;
            if (doExtract) {
                energy -= max;
            }
        }
        else {
            extracted = energy;
            if (doExtract) {
                energy = 0;
            }
        }
        return extracted;
    };
    BCEngineTileEntity.prototype.canConnectEnergy = function (from) {
        return from == this.orientation;
    };
    BCEngineTileEntity.prototype.overheat = function () {
        this.isPumping = false;
        // TODO make some explode!
    };
    BCEngineTileEntity.prototype.getCurrentOutputLimit = function () {
        return Number.MAX_VALUE;
    };
    BCEngineTileEntity.prototype.engineUpdate = function () {
        if (!this.isRedstonePowered) { // TODO make redstone check
            if (this.data.energy >= 10) {
                this.data.energy -= 10;
            }
            else if (this.data.energy < 10) {
                this.data.energy = 0;
            }
        }
    };
    BCEngineTileEntity.prototype.updateHeat = function () {
        this.data.heat = ((this.MAX_HEAT - this.MIN_HEAT) * this.getEnergyLevel()) + this.MIN_HEAT;
    };
    BCEngineTileEntity.prototype.getEnergyLevel = function () {
        return this.data.energy / this.getMaxEnergy();
    };
    BCEngineTileEntity.prototype.destroy = function () {
        this.engineAnimation.destroy();
    };
    BCEngineTileEntity.prototype.getOppositeSide = function (side) {
        switch (side) {
            case 0:
                return 1;
            case 1:
                return 0;
            case 2:
                return 3;
            case 3:
                return 2;
            case 4:
                return 5;
            case 5:
                return 4;
        }
    };
    // TODO add IEngine interface
    // IEngine
    BCEngineTileEntity.prototype.canReceiveFromEngine = function (side) {
        return side == this.getOppositeSide(this.orientation);
    };
    BCEngineTileEntity.prototype.receiveEnergyFromEngine = function (side, amount, simulate) {
        if (this.canReceiveFromEngine(side)) {
            var targetEnergy = Math.min(this.getMaxEnergy() - this.data.energy, amount);
            if (!simulate) {
                this.data.energy += targetEnergy;
            }
            return targetEnergy;
        }
        return 0;
    };
    // TODO add IHeatable interface
    // IHeatable
    BCEngineTileEntity.prototype.getMinHeatValue = function () {
        return this.MIN_HEAT;
    };
    BCEngineTileEntity.prototype.getIdealHeatValue = function () {
        return this.IDEAL_HEAT;
    };
    BCEngineTileEntity.prototype.getMaxHeatValue = function () {
        return this.MAX_HEAT;
    };
    BCEngineTileEntity.prototype.getCurrentHeatValue = function () {
        return this.data.heat;
    };
    return BCEngineTileEntity;
}());
/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/EngineItem.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
var BCEngine = /** @class */ (function () {
    function BCEngine() {
        this.maxHeat = 100;
        this.block = new EngineBlock(this.engineType);
        this.item = new EngineItem(this.engineType, this.block);
        TileEntity.registerPrototype(this.block.id, this.requireTileEntity());
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
var PowerMode;
(function (PowerMode) {
    PowerMode[PowerMode["M2"] = 20] = "M2";
    PowerMode[PowerMode["M4"] = 40] = "M4";
    PowerMode[PowerMode["M8"] = 80] = "M8";
    PowerMode[PowerMode["M16"] = 160] = "M16";
    PowerMode[PowerMode["M32"] = 320] = "M32";
    PowerMode[PowerMode["M64"] = 640] = "M64";
    PowerMode[PowerMode["M128"] = 1280] = "M128";
    PowerMode[PowerMode["M256"] = 2560] = "M256";
})(PowerMode || (PowerMode = {}));
;
var PowerModeOrder = [
    PowerMode.M2,
    PowerMode.M4,
    PowerMode.M8,
    PowerMode.M16,
    PowerMode.M32,
    PowerMode.M64,
    PowerMode.M128,
    PowerMode.M256
];
/// <reference path="../PowerMode.ts" />
var BCCreativeEngineTileEntity = /** @class */ (function (_super) {
    __extends(BCCreativeEngineTileEntity, _super);
    function BCCreativeEngineTileEntity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //  private PowerMode powerMode = PowerMode.M2; // ! its from PC
        _this.powerMode = PowerMode.M2;
        return _this;
    }
    BCCreativeEngineTileEntity.prototype.computeEnergyStage = function () {
        return EngineHeat.BLACK;
    };
    BCCreativeEngineTileEntity.prototype.updateHeat = function () { };
    BCCreativeEngineTileEntity.prototype.getPistonSpeed = function () {
        // return 0.02 * (powerMode.ordinal() + 1); // ORIGINAL
        return 0.02 * (PowerModeOrder[this.powerMode] + 1); // Maybe shit...
    };
    BCCreativeEngineTileEntity.prototype.engineUpdate = function () {
        _super.prototype.engineUpdate.call(this);
        if (this.isRedstonePowered) {
            this.addEnergy(this.getIdealOutput());
        }
    };
    BCCreativeEngineTileEntity.prototype.isBurning = function () {
        return this.isRedstonePowered;
    };
    BCCreativeEngineTileEntity.prototype.getMaxEnergy = function () {
        return this.getIdealOutput();
    };
    BCCreativeEngineTileEntity.prototype.getIdealOutput = function () {
        // return powerMode.maxPower; //ORIGINAL
        return this.powerMode;
    };
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
    CreativeEngine.prototype.requireTileEntity = function () {
        return new BCCreativeEngineTileEntity(new EngineTexture(STANDART_TEXTURE, { x: 256, y: 96 }, STANDART_SIZE));
    };
    return CreativeEngine;
}(BCEngine));
/// <reference path="../PowerMode.ts" />
/// <reference path="../EngineHeat.ts" />
var BCWoodEngineTileEntity = /** @class */ (function (_super) {
    __extends(BCWoodEngineTileEntity, _super);
    function BCWoodEngineTileEntity() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasSent = false;
        return _this;
    }
    BCWoodEngineTileEntity.prototype.computeEnergyStage = function () {
        var energyLevel = this.getEnergyLevel();
        if (energyLevel < 0.33) {
            return EngineHeat.BLUE;
        }
        else if (energyLevel < 0.66) {
            return EngineHeat.GREEN;
        }
        else if (energyLevel < 0.75) {
            return EngineHeat.ORANGE;
        }
        return EngineHeat.RED;
    };
    BCWoodEngineTileEntity.prototype.getPistonSpeed = function () {
        // if (!worldObj.isRemote) { // ? is it again client-server?
        return Math.max(0.08 * this.getHeatLevel(), 0.01);
        // }
        /*switch (getEnergyStage()) {
            case GREEN:
                return 0.02F;
            case YELLOW:
                return 0.04F;
            case RED:
                return 0.08F;
            default:
                return 0.01F;
        }*/
    };
    BCWoodEngineTileEntity.prototype.engineUpdate = function () {
        _super.prototype.engineUpdate.call(this);
        if (this.isRedstonePowered) {
            if (World.getThreadTime() % 16 == 0) {
                this.addEnergy(10);
            }
        }
    };
    BCWoodEngineTileEntity.prototype.isBurning = function () {
        return this.isRedstonePowered;
    };
    BCWoodEngineTileEntity.prototype.getCurrentOutputLimit = function () {
        return 10;
    };
    BCWoodEngineTileEntity.prototype.getMaxEnergy = function () {
        return 1000;
    };
    BCWoodEngineTileEntity.prototype.getIdealOutput = function () {
        return 10;
    };
    BCWoodEngineTileEntity.prototype.canConnectEnergy = function (from) {
        return false;
    };
    BCWoodEngineTileEntity.prototype.getEnergyStored = function () {
        return 0;
    };
    BCWoodEngineTileEntity.prototype.getMaxEnergyStored = function () {
        return 0;
    };
    BCWoodEngineTileEntity.prototype.sendPower = function () {
        if (this.progressPart == 2 && !this.hasSent) {
            this.hasSent = true;
            var tile = this.getEnergyProvider(this.orientation);
            if (tile && tile.canReceiveEnergy(this.getOppositeSide(this.orientation), "RF")) {
                _super.prototype.sendPower.call(this);
            }
            else {
                this.data.energy = 0;
            }
        }
        else if (this.progressPart != 2) {
            this.hasSent = false;
        }
    };
    return BCWoodEngineTileEntity;
}(BCEngineTileEntity));
/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
var WoodEngine = /** @class */ (function (_super) {
    __extends(WoodEngine, _super);
    function WoodEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(WoodEngine.prototype, "engineType", {
        get: function () {
            return "wooden";
        },
        enumerable: true,
        configurable: true
    });
    WoodEngine.prototype.requireTileEntity = function () {
        return new BCWoodEngineTileEntity(new EngineTexture(STANDART_TEXTURE, { x: 256, y: 0 }, STANDART_SIZE));
    };
    return WoodEngine;
}(BCEngine));
/// <reference path="creative/CreativeEngine.ts" />
/// <reference path="wood/WoodEngine.ts" />
var creativeEngine = new CreativeEngine();
var woodenEngine = new WoodEngine();
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
