IDRegistry.genItemID("bc_wrench");
Item.createItem("bc_wrench", "Wrench", { name: "bc_wrench" }, { stack: 1 });

Callback.addCallback("PostLoaded", () => {
    Recipes.addShaped({ id: ItemID.bc_wrench, count: 1, data: 0 }, [
        "x x",
        " o ",
        " x "
    ], ["x", VanillaItemID.iron_ingot, 0, "o", ItemID.gear_stone, 0]);
});
