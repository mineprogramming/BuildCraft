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
            if (slot.id != 0){
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
                if(slot.id != 0 && this.checkItem(slot.id, slot.data)){
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
                if (slot.id != 0 && this.checkItem(slot.id, slot.data)){
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
