IDRegistry.genBlockID("bcPump");
Block.createBlock("bcPump", [
    {name: "Pump", texture: [["bc_pump", 1], ["bc_machine", 0], ["bc_pump", 0], ["bc_pump", 0], ["bc_pump", 0], ["bc_pump", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.bcPump, count: 1, data: 0}, [
        "iri",
        "igi",
        "tbt"
    ], ["i", 265, 0, "r", 331, 0, "b", 325, -1, "g", ItemID.gearIron, 0, "t", BlockID.tank, 0]);
});


TileEntity.registerPrototype(BlockID.bcPump, {
    defaultValues: {
        energy: 0,
        pumpY: 0
    },

    created: function() {
        this.data.pumpY = this.y - 1;
    },

    MJEnergyDeploy: function(amount, generator, params) {
        if (this.data.energy < 20) this.data.energy += Math.min(amount, amount - this.data.energy);
    },

    tick: function() {
        this.liquidStorage.setLimit(null, 16);

        if (World.getThreadTime() % 20 == 0 && this.data.energy > 1) {
            var te = World.getTileEntity(this.x, this.y - 1, this.z);
            if (te) {
                this.pullFromTileEntity(te);
            } else {
                var coords = this.getPumpingCoords();
                if (coords) {
                    var tile = World.getBlock(coords.x, coords.y, coords.z);
                    if (tile.id == 9 || tile.id == 11) {
                        World.setBlock(coords.x, coords.y, coords.z, 0);
                        this.liquidStorage.addLiquid(tile.id == 9 ? "water" : "lava", 1);
                    }
                    if (tile.id == 8 || tile.id == 10) World.setBlock(coords.x, coords.y, coords.z, 0);
                    this.data.energy--;
                }
            }
        }
    },

    pullFromTileEntity: function(tileEntity) {
        var transportableLiquid = tileEntity.getTransportLiquids;
        var outputLiquids;
        if (transportableLiquid) outputLiquids = transportableLiquid().output;

        var liquidStored = tileEntity.liquidStorage.getLiquidStored();
        var pullAllowed = liquidStored ? true : false;
        if (outputLiquids) {
            for (var liquid in outputLiquids) {
                if (liquidStored != outputLiquids[liquid]) pullAllowed = false;
            }
        }

        if (pullAllowed) {
            this.liquidStorage.addLiquid(liquidStored, tileEntity.liquidStorage.getLiquid(liquidStored));
            this.data.energy--;
        }
    },

    getPumpingCoords: function() {
        while (World.getBlockID(this.x, this.data.pumpY, this.z) == 0 && this.data.pumpY > 0) this.data.pumpY--;
        var coords = this.getCoordsForLevel(this.x, this.data.pumpY, this.z);
        return coords;
    },

    getCoordsForLevel: function(x, y, z, data, exp, expCount) {
        if (!exp) exp = []
        if (!expCount) expCount = 0;
        var key = x + "#" + y + "#" + z;
        if (exp[key]) return null;
        exp[key] = true;
        expCount++;
        if (!data) data = 9;

        var tile = World.getBlock(x, y, z)
        if (tile.data >= data) return null;
        var posCoords = null;
        if (this.isLiquidSource(tile.id, tile.data)) {
            posCoords = {
                x: x,
                y: y,
                z: z
            };
            data = 9;
        }
        if (!this.isLiquidFlow(tile.id, tile.data) && !posCoords) return posCoords;
        if (expCount > 32) return posCoords;

        var cs = [
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y, z + 1],
            [x, y, z - 1],
            [x, y - 1, z],
            [x, y + 1, z]
        ];
        for (var k in cs) {
            var cd = this.getCoordsForLevel(cs[k][0], cs[k][1], cs[k][2], tile.data, exp, expCount)
            if (cd != null) return cd;
        }
        return posCoords;
    },

    isLiquidSource: function(id, data) {
        return (id == 8 || id == 9 || id == 10 || id == 11) && data == 0;
    },

    isLiquidFlow: function(id, data) {
        return (id == 8 || id == 9 || id == 10 || id == 11) && data > 0;
    }
});

