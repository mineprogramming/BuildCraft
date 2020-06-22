IDRegistry.genItemID("bc_wrench");
Item.createItem("bc_wrench", "Wrench", {name: "bc_wrench"});

Callback.addCallback("PostLoaded", () => {
    Recipes.addShaped({id: ItemID.bc_wrench, count: 1, data: 0}, [
        "x x",
        " o ",
        " x "
    ], ['x', 265, 0, 'o', ItemID.gear_stone, 0]);
});
