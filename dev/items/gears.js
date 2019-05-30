IDRegistry.genItemID("gearWood");
Item.createItem("gearWood", "Wood Gear", {name: "gear_wood"});

IDRegistry.genItemID("gearStone");
Item.createItem("gearStone", "Stone Gear", {name: "gear_stone"});

IDRegistry.genItemID("gearIron");
Item.createItem("gearIron", "Iron Gear", {name: "gear_iron"});

IDRegistry.genItemID("gearGold");
Item.createItem("gearGold", "Gold Gear", {name: "gear_gold"});

IDRegistry.genItemID("gearDiamond");
Item.createItem("gearDiamond", "Diamond Gear", {name: "gear_diamond"});

Recipes.addShaped({id: ItemID.gearWood, count: 1, data: 0}, [
    " x ",
    "x x",
    " x "
], ['x', 280, 0]);

Recipes.addShaped({id: ItemID.gearStone, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 4, -1, 'o', ItemID.gearWood, 0]);

Recipes.addShaped({id: ItemID.gearIron, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 265, 0, 'o', ItemID.gearStone, 0]);

Recipes.addShaped({id: ItemID.gearGold, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 266, 0, 'o', ItemID.gearIron, 0]);

Recipes.addShaped({id: ItemID.gearDiamond, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ['x', 264, 0, 'o', ItemID.gearGold, 0]);


Callback.addCallback("BC-ICore", function(ICore){
    IDRegistry.genItemID("gearTin");
    Item.createItem("gearTin", "Tin Gear", {name: "gear_tin"});
    
    Recipes.addShaped({id: ItemID.gearTin, count: 1, data: 0}, [
        " x ",
        "xox",
        " x "
    ], ['x', ItemID.ingotTin, 0, 'o', ItemID.gearStone, 0]);
});
