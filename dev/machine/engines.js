IDRegistry.genItemID("engineWooden");
Item.createItem("engineWooden", "Redstone Engine", {name: "engine_wooden"});

IDRegistry.genItemID("engineStone");
Item.createItem("engineStone", "Stirling Engine", {name: "engine_stone"});

IDRegistry.genItemID("engineIron");
Item.createItem("engineIron", "ICE", {name: "engine_iron"});

IDRegistry.genItemID("engineElectric");
Item.createItem("engineElectric", "Electric Engine", {name: "engine_electric"});

Recipes.addShaped({id: ItemID.engineWooden, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 5, -1, 'b', 20, -1, 'o', ItemID.gearWood, 0]);

Recipes.addShaped({id: ItemID.engineStone, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 4, -1, 'b', 20, -1, 'o', ItemID.gearStone, 0]);

Recipes.addShaped({id: ItemID.engineIron, count: 1, data: 0}, [
    "aaa",
    " b ",
    "oxo"
], ['x', 33, -1, 'a', 265, 0, 'b', 20, -1, 'o', ItemID.gearIron, 0]);


Callback.addCallback("BC-ICore", function(ICore){
    Recipes.addShaped({id: ItemID.engineElectric, count: 1, data: 0}, [
        "aaa",
        " b ",
        "oxo"
    ], ['x', 33, -1, 'a', ItemID.ingotTin, 0, 'b', 20, -1, 'o', ItemID.gearTin, 0]);
});



Item.registerUseFunction("engineWooden", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_WOOD);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});

Item.registerUseFunction("engineStone", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_STONE);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});

Item.registerUseFunction("engineIron", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_IRON);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});

Item.registerUseFunction("engineElectric", function(coords, item, block){
    var block = World.getBlock(coords.relative.x, coords.relative.y, coords.relative.z);
    if (block.id == 0){
        World.setBlock(coords.relative.x, coords.relative.y, coords.relative.z, BlockID.bcEngine);
        World.addTileEntity(coords.relative.x, coords.relative.y, coords.relative.z).setEngineType(ENGINE_TYPE_ELECTRIC);
        Player.setCarriedItem(item.id, item.count - 1, item.data);
    }
});