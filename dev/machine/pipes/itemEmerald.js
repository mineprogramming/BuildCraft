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
        "modeSwitch": {
            type: "button", isTextButton: true, x: 380, y: 200, bitmap: "button_36x12_up", bitmap2: "button_36x12_down", text: "Filter", scale: 6, 
            font: {
                color: android.graphics.Color.WHITE,
                size: 24,
                shadow: 0.75
            },
            textOffset: {
                x: 48,
                y: 45
            },
            clicker: {
                onClick: function(container, tileEntity){
                    tileEntity.data.inverseMode = !tileEntity.data.inverseMode;
                }
            }
        }
    }
});

for (var i = 0; i < 9; i++){
    emeraldPipeUI.content.elements["slot" + i] = {
        type: "slot",
        x: 370 + i * 65, y: 285
    };
}


TileEntity.registerPrototype(BlockID.pipeItemEmerald, {
    defaultValues: {
        containerIndex: 0,
        inverseMode: false
    },
    
    /* callbacks */
    getGuiScreen: function(){
        return emeraldPipeUI;
    },

    tick: function(){
        if (this.container.isOpened()){
            this.reloadFilter();
            this.container.setText("modeSwitch", this.data.inverseMode ? "Ignore" : "Filter");
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
        this.filter = {
            all: true
        };
        this.container.validateAll();

        for (var i = 0; i < 9; i++){
            var slot = this.container.getSlot("slot" + i);
            if (slot.id > 0){
                this.filter[slot.id + "." + slot.data] = true;
                this.filter.all = false;
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
