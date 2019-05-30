// Wooden Transport Pipe
IDRegistry.genBlockID("pipeItemWooden");
Block.createBlock("pipeItemWooden", [
    {name: "Wooden Transport Pipe", texture: [["pipe_item_wood", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemWooden, count: 1, data: 0}, ["xax"], ['x', 5, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemWooden, {name: "pipe_item_wood", data: 0}, ITEM_PIPE_CONNECTION_ANY);
 

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
        container.refreshSlots();
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
        container.applyChanges();
        return item;
    }
});
