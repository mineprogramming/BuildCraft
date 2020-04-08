LIBRARY({
    name: "StorageInterface",
    version: 3,
    shared: true,
    api: "CoreEngine"
});
var LIQUID_STORAGE_MAX_LIMIT = 99999999;
var StorageInterface = {
    data: {},
    directionsBySide: [
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: 0, z: -1 },
        { x: 0, y: 0, z: 1 },
        { x: -1, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 } // west
    ],
    getRelativeCoords: function (coords, side) {
        var dir = this.directionsBySide[side];
        return { x: coords.x + dir.x, y: coords.y + dir.y, z: coords.z + dir.z };
    },
    newInstance: function (id, tileEntity) {
        var instance = {};
        var obj = this.data[id];
        for (var i in obj) {
            instance[i] = obj[i];
        }
        instance.tileEntity = tileEntity;
        instance.container = tileEntity.container;
        return instance;
    },
    createInterface: function (id, interface) {
        tilePrototype = TileEntity.getPrototype(id);
        if (tilePrototype) {
            tilePrototype._init = tilePrototype.init;
            tilePrototype.init = function () {
                this.interface = StorageInterface.newInstance(id, this);
                this._init();
            };
            if (interface.slots) {
                for (var name in interface.slots) {
                    Logger.Log(name);
                    if (name.includes('^')) {
                        var slotData = interface.slots[name];
                        var str = name.split('^');
                        var index = str[1].split('-');
                        for (var i = parseInt(index[0]); i <= parseInt(index[1]); i++) {
                            interface.slots[str[0] + i] = slotData;
                        }
                        delete interface.slots[name];
                    }
                }
                if (!tilePrototype.getTransportSlots) {
                    var inputSlots_1 = [], outputSlots_1 = [];
                    for (var i in interface.slots) {
                        var slot = interface.slots[i];
                        if (slot.input)
                            inputSlots_1.push(i);
                        if (slot.output)
                            outputSlots_1.push(i);
                    }
                    tilePrototype.getTransportSlots = function () {
                        return { input: inputSlots_1, output: outputSlots_1 };
                    };
                }
            }
            else {
                interface.slots = {};
            }
            tilePrototype.addTransportedItem = function (obj, item, side) {
                this.interface.addItem(item, side);
            };
            interface.isValidInput = interface.isValidInput || function (item, side, tileEntity) {
                return true;
            };
            interface.addItem = interface.addItem || function (item, side, maxCount) {
                if (!this.isValidInput(item))
                    return 0;
                var count = 0;
                for (var name in this.slots) {
                    var slotData = this.slots[name];
                    if (slotData.input && (!slotData.isValid || slotData.isValid(item, side, this.tileEntity))) {
                        var slot = this.container.getSlot(name);
                        count += StorageInterface.addItemToSlot(item, slot, maxCount - count);
                        if (item.count == 0 || count >= maxCount) {
                            break;
                        }
                    }
                }
                return count;
            };
            interface.getOutputSlots = interface.getItems || function (side) {
                var slots = [];
                for (var name in this.slots) {
                    var slotData = this.slots[name];
                    if (slotData.output) {
                        var item = this.container.getSlot(name);
                        if (item.id > 0 && (!slotData.canOutput || slotData.canOutput(item, side, this.tileEntity))) {
                            slots.push(name);
                        }
                    }
                }
                return slots;
            };
            interface.canReceiveLiquid = interface.canReceiveLiquid || function (luquid, side) {
                return false;
            };
            interface.canTransportLiquid = interface.canTransportLiquid || function (luquid, side) {
                return false;
            };
            interface.addLiquid = interface.addLiquid || function (luquid, amount) {
                return this.tileEntity.liquidStorage.addLiquid(luquid, amount);
            };
            interface.getLiquid = interface.getLiquid || function (luquid, amount) {
                return this.tileEntity.liquidStorage.getLiquid(luquid, amount);
            };
            interface.getLiquidStored = interface.getLiquidStored || function (storage) {
                return this.tileEntity.liquidStorage.getLiquidStored();
            };
            this.data[id] = interface;
        }
        else {
            Logger.Log("failed to create storage interface: no tile entity for id " + id, "ERROR");
        }
    },
    /* WARNING */
    // if you use this function on native container (furnace, chest, etc)
    // you should set its slot by using container.setSlot(...) after function execution
    addItemToSlot: function (item, slot, count) {
        if (slot.id == 0 || slot.id == item.id && slot.data == item.data) {
            var maxStack = Item.getMaxStack(item.id);
            var add = Math.min(maxStack - slot.count, item.count);
            if (count)
                add = Math.min(add, count);
            if (add > 0) {
                slot.id = item.id;
                slot.count += add;
                slot.data = item.data;
                if (item.extra)
                    slot.extra = item.extra;
                item.count -= add;
                if (item.count == 0) {
                    item.id = item.data = 0;
                }
                return add;
            }
        }
        return 0;
    },
    getNearestContainers: function (coords, side, sideExcluded) {
        var containers = {};
        if (side >= 0 && !sideExcluded) {
            var dir = this.getRelativeCoords(coords, side);
            var container = World.getContainer(dir.x, dir.y, dir.z);
            if (container) {
                containers[side] = container;
            }
        }
        else
            for (var s = 0; s < 6; s++) {
                if (sideExcluded && s == side)
                    continue;
                var dir = this.getRelativeCoords(coords, s);
                var container = World.getContainer(dir.x, dir.y, dir.z);
                if (container) {
                    containers[s] = container;
                }
            }
        return containers;
    },
    getNearestLiquidStorages: function (coords, side, sideExcluded) {
        var storages = {};
        if (side >= 0 && !sideExcluded) {
            var dir = this.getRelativeCoords(coords, side);
            var tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
            if (tileEntity && tileEntity.liquidStorage) {
                storages[side] = tileEntity;
            }
        }
        else
            for (var s = 0; s < 6; s++) {
                if (sideExcluded && s == side)
                    continue;
                var dir = this.getRelativeCoords(coords, s);
                var tileEntity = World.getTileEntity(dir.x, dir.y, dir.z);
                if (tileEntity && tileEntity.liquidStorage) {
                    storages[s] = tileEntity;
                }
            }
        return storages;
    },
    putItems: function (items, containers) {
        for (var i in items) {
            var item = items[i];
            for (var side in containers) {
                if (item.count == 0)
                    break;
                var container = containers[side];
                this.putItemToContainer(item, container, parseInt(side));
            }
        }
    },
    putItemToContainer: function (item, container, side, maxCount) {
        var tileEntity = container.tileEntity;
        var count = 0;
        var slots = [];
        var slotsInitialized = false;
        if (tileEntity) {
            if (tileEntity.interface) {
                return tileEntity.interface.addItem(item, side, maxCount);
            }
            if (tileEntity.getTransportSlots) {
                slots = tileEntity.getTransportSlots().input || [];
                slotsInitialized = true;
            }
        }
        if (!slotsInitialized) {
            slots = this.getContainerSlots(container);
        }
        for (var i in slots) {
            var slot = container.getSlot(slots[i]);
            var added = this.addItemToSlot(item, slot, maxCount - count);
            if (added > 0) {
                count += added;
                if (!container.slots) {
                    container.setSlot(i, slot.id, slot.count, slot.data);
                }
                if (item.count == 0 || count >= maxCount) {
                    break;
                }
            }
        }
        return count;
    },
    extractItemsFromContainer: function (inputTile, container, side, maxCount, oneStack) {
        var outputTile = container.tileEntity;
        var count = 0;
        var slots = [];
        var slotsInitialized = false;
        if (outputTile) {
            if (outputTile.interface) {
                slots = outputTile.interface.getOutputSlots(side);
                slotsInitialized = true;
            }
            else if (outputTile.getTransportSlots) {
                slots = outputTile.getTransportSlots().output || [];
                slotsInitialized = true;
            }
        }
        if (!slotsInitialized) {
            slots = this.getContainerSlots(container);
        }
        for (var i in slots) {
            var slot = container.getSlot(slots[i]);
            if (slot.id > 0) {
                var added = inputTile.interface.addItem(slot, side, maxCount - count);
                if (added > 0) {
                    count += added;
                    if (!container.slots) {
                        container.setSlot(i, slot.id, slot.count, slot.data);
                    }
                    if (oneStack || count >= maxCount) {
                        break;
                    }
                }
            }
        }
        return count;
    },
    extractLiquid: function (liquid, maxAmount, input, output, inputSide) {
        if (!liquid) {
            if (output.interface) {
                liquid = output.interface.getLiquidStored("output");
            }
            else {
                liquid = output.liquidStorage.getLiquidStored();
            }
        }
        if (liquid) {
            var outputSide = inputSide + Math.pow(-1, inputSide);
            if (!output.interface || output.interface.canTransportLiquid(liquid, outputSide)) {
                this.transportLiquid(liquid, maxAmount, output, input, outputSide);
            }
        }
    },
    transportLiquid: function (liquid, maxAmount, output, input, outputSide) {
        if (liquid) {
            var inputSide = outputSide + Math.pow(-1, outputSide);
            var inputStorage = input.interface || input.liquidStorage;
            var outputStorage = output.interface || output.liquidStorage;
            var amount = Math.min(output.liquidStorage.getAmount(liquid), maxAmount);
            if (!input.interface || input.interface.canReceiveLiquid(liquid, inputSide)) {
                var liquidStored = inputStorage.getLiquidStored("input");
                if (!liquidStored && input.liquidStorage.getLimit(liquid) < LIQUID_STORAGE_MAX_LIMIT || liquidStored == liquid) {
                    outputStorage.getLiquid(liquid, amount - inputStorage.addLiquid(liquid, amount));
                }
            }
        }
    },
    getContainerSlots: function (container) {
        var slots = [];
        if (container.slots) {
            for (var name in container.slots) {
                slots.push(name);
            }
        }
        else {
            for (var i = 0; i < container.getSize(); i++) {
                slots.push(i);
            }
        }
        return slots;
    },
    // use it in tick function of tile entity
    // require storage interface for tile entity
    checkHoppers: function (tile) {
        if (World.getThreadTime() % 8 > 0)
            return;
        for (var side = 1; side < 6; side++) {
            var dir = this.getRelativeCoords(tile, side);
            var block = World.getBlock(dir.x, dir.y, dir.z);
            if (block.id == 154 && block.data == side + Math.pow(-1, side)) {
                var container = World.getContainer(dir.x, dir.y, dir.z);
                for (var i = 0; i < container.getSize(); i++) {
                    var slot_1 = container.getSlot(i);
                    if (slot_1.id > 0 && tile.interface.addItem(slot_1, side, 1)) {
                        container.setSlot(i, slot_1.id, slot_1.count, slot_1.data);
                        break;
                    }
                }
            }
        }
        if (World.getBlockID(tile.x, tile.y - 1, tile.z) == 154) {
            var container = World.getContainer(tile.x, tile.y - 1, tile.z);
            var slots = tile.interface.getOutputSlots(0);
            for (var i in slots) {
                var item = tile.container.getSlot(slots[i]);
                if (item.id > 0) {
                    for (var j = 0; j < container.getSize(); j++) {
                        var slot = container.getSlot(j);
                        if (this.addItemToSlot(item, slot, 1)) {
                            container.setSlot(j, slot.id, slot.count, slot.data);
                            return;
                        }
                    }
                }
            }
        }
    },
    // deprecated
    extractItems: function (items, containers, tile) {
        for (var i in items) {
            var item = items[i];
            var maxStack = Item.getMaxStack(item.id);
            for (var side in containers) {
                var container = containers[side];
                var tileEntity = container.tileEntity;
                var slots = [];
                var slotsInitialized = false;
                if (tileEntity) {
                    if (tileEntity.interface) {
                        slots = tileEntity.interface.getOutputSlots(parseInt(side));
                        slotsInitialized = true;
                    }
                    else if (tileEntity.getTransportSlots) {
                        slots = tileEntity.getTransportSlots().output || [];
                        slotsInitialized = true;
                    }
                }
                if (!slotsInitialized) {
                    slots = this.getContainerSlots(container);
                }
                for (var s in slots) {
                    var slot = container.getSlot(slots[s]);
                    if (slot.id > 0) {
                        if (tile.interface) {
                            if (tile.interface.addItem(slot, parseInt(side)) && !container.slots) {
                                container.setSlot(s, slot.id, slot.count, slot.data);
                            }
                        }
                        else if (this.addItemToSlot(slot, item) && !container.slots) {
                            container.setSlot(s, slot.id, slot.count, slot.data);
                        }
                        if (item.count == maxStack) {
                            break;
                        }
                    }
                }
                if (item.count == maxStack) {
                    break;
                }
            }
            if (tile.interface) {
                return;
            }
        }
    }
};
EXPORT("StorageInterface", StorageInterface);
