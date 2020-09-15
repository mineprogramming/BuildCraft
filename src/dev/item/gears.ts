IDRegistry.genItemID("gear_wood");
Item.createItem("gear_wood", "Wood Gear", {name: "gear_wood"});

IDRegistry.genItemID("gear_stone");
Item.createItem("gear_stone", "Stone Gear", {name: "gear_stone"});

IDRegistry.genItemID("gear_iron");
Item.createItem("gear_iron", "Iron Gear", {name: "gear_iron"});

IDRegistry.genItemID("gear_gold");
Item.createItem("gear_gold", "Gold Gear", {name: "gear_gold"});

IDRegistry.genItemID("gear_diamond");
Item.createItem("gear_diamond", "Diamond Gear", {name: "gear_diamond"});

Recipes.addShaped({id: ItemID.gear_wood, count: 1, data: 0}, [
    " x ",
    "x x",
    " x "
], ["x", 280, 0]);

Recipes.addShaped({id: ItemID.gear_stone, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ["x", 4, -1, "o", ItemID.gear_wood, 0]);

Recipes.addShaped({id: ItemID.gear_iron, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ["x", 265, 0, "o", ItemID.gear_stone, 0]);

Recipes.addShaped({id: ItemID.gear_gold, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ["x", 266, 0, "o", ItemID.gear_iron, 0]);

Recipes.addShaped({id: ItemID.gear_diamond, count: 1, data: 0}, [
    " x ",
    "xox",
    " x "
], ["x", 264, 0, "o", ItemID.gear_gold, 0]);


Callback.addCallback("BC-ICore", (ICore) => {
    IDRegistry.genItemID("gear_tin");
    Item.createItem("gear_tin", "Tin Gear", {name: "gear_tin"});

    Recipes.addShaped({id: ItemID.gear_tin, count: 1, data: 0}, [
        " x ",
        "xox",
        " x "
    ], ["x", ItemID.ingotTin, 0, "o", ItemID.gear_stone, 0]);
});
