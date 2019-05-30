// Pipe Sealant
IDRegistry.genItemID("pipeSealant");
Item.createItem("pipeSealant", "Pipe Sealant", {name: "pipe_sealant"});
Recipes.addShapeless({id: ItemID.pipeSealant, count: 1, data: 0}, [{id: 351, data: 2}]);
Recipes.addShapeless({id: ItemID.pipeSealant, count: 1, data: 0}, [{id: 341, data: 0}]);


// Wrench
IDRegistry.genItemID("bcWrench");
Item.createItem("bcWrench", "Wrench", {name: "bc_wrench"});
Recipes.addShaped({id: ItemID.bcWrench, count: 1, data: 0}, [
    "x x",
    " o ",
    " x "
], ['x', 265, 0, 'o', ItemID.gearStone, 0]);