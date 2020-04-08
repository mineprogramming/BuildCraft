// Wooden Transport Pipe
IDRegistry.genBlockID("pipeItemWooden");
Block.createBlock("pipeItemWooden", [
    {name: "Wooden Transport Pipe", texture: [["pipe_item_wood", 0]], inCreative: true}
], BLOCK_TYPE_ITEM_PIPE);

Recipes.addShaped({id: BlockID.pipeItemWooden, count: 1, data: 0}, ["xax"], ['x', 5, -1, 'a', 20, -1]);
registerItemPipe(BlockID.pipeItemWooden, {name: "pipe_item_wood", data: 0}, ITEM_PIPE_CONNECTION_WOOD);

TileEntity.registerPrototype(BlockID.pipeItemWooden, {
    defaultValues: {
        containerIndex: 0,
    },

    MJEnergyDeploy: function(amount, generator, params){
        var containerData = this.findContainer();
        if (containerData && containerData.container){
            var maxCount = amount >= 8 ? amount * 8 : 1;
            var side = {tileEntity: this, containerCoords: containerData.position};
            StorageInterface.extractItemsFromContainer(this, containerData.container, side, maxCount, true);
        }
    },

    addItemToPipe: function(item, containterPos){
        var transportedItem = TransportingItem.deploy();
        transportedItem.setPosition(containterPos.x + .5, containterPos.y + .5, containterPos.z + .5);
        transportedItem.setItem(item.id, item.count, item.data);
        transportedItem.setTarget(this.x, this.y, this.z);
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
    }
});

StorageInterface.createInterface(BlockID.pipeItemWooden, {
	addItem: function(item, side, maxCount){
        var count = 0;
        side.tileEntity.addItemToPipe(item, side.containerCoords);
        count += item.count;
        item.count = 0;
        return count;
    }
});