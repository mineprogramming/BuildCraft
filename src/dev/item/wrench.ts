IDRegistry.genItemID("bcWrench");
Item.createItem("bcWrench", "Wrench", {name: "bc_wrench"});

Callback.addCallback("PostLoaded", () => {
    Recipes.addShaped({id: ItemID.bcWrench, count: 1, data: 0}, [
        "x x",
        " o ",
        " x "
    ], ['x', 265, 0, 'o', ItemID.gearStone, 0]);
});
