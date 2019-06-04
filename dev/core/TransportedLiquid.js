var LiquidTransportHelper = {
    DownloadingDenied: {

    },

    PipeTiles: {

    },

    registerFluidPipe: function(id, connectType) {
        this.PipeTiles[id] = connectType;
    },

    isPipe: function(blockID) {
        return this.PipeTiles[blockID];
    },

    canPipesConnect: function(pipe1, pipe2) {
        var type1 = this.PipeTiles[pipe1] || FLUID_PIPE_CONNECTION_ANY;
        var type2 = this.PipeTiles[pipe2] || FLUID_PIPE_CONNECTION_ANY;
        return type1 == type2 || type1 == FLUID_PIPE_CONNECTION_ANY || type2 == FLUID_PIPE_CONNECTION_ANY;
    },

    findNearbyLiquidStorages: function(position) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var possibleDirs = [];
        for (var i in directions) {
            var dir = directions[i];
            var tileentity = World.getTileEntity(position.x + dir.x, position.y + dir.y, position.z + dir.z);
            if (tileentity && tileentity.liquidStorage) {
                var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
                if (!this.DownloadingDenied[block]) {
                    possibleDirs.push(dir);
                }
            }
        }
        return possibleDirs;
    },

    canDownloadTo: function(pipe, x, y, z) {
        var block = World.getBlock(x, y, z).id;
        if (block >= 8192 && !this.DownloadingDenied[block]) {
            return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
        }
        return false;
    },

    locateLiquidPipes: function(x, y, z) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var pipes = [];
        var pipe = World.getBlock(x, y, z).id;
        for (var d in directions) {
            var dir = directions[d];
            var block = World.getBlock(x + dir.x, y + dir.y, z + dir.z).id;
            if (!this.DownloadingDenied[block] && this.isPipe(block) && this.canPipesConnect(pipe, block)) {
                pipes.push(dir);
            }
        }
        return pipes;
    },

    findBasicDirections: function(pipe, position) {
        var directions = [{
                x: -1,
                y: 0,
                z: 0
            },
            {
                x: 1,
                y: 0,
                z: 0
            },
            {
                x: 0,
                y: -1,
                z: 0
            },
            {
                x: 0,
                y: 1,
                z: 0
            },
            {
                x: 0,
                y: 0,
                z: -1
            },
            {
                x: 0,
                y: 0,
                z: 1
            },
        ];
        var possibleDirs = [];
        for (var i in directions) {
            var dir = directions[i];
            if (this.canDownloadTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)) {
                possibleDirs.push(dir);
            }
        }
        return possibleDirs;
    },

    getEnviromentData: function(position) {
        var directions = LiquidTransportingCache.getInfo(position.x, position.y, position.z);

        if (!directions) {
            var id = World.getBlock(position.x, position.y, position.z).id;
            var inPipe = this.isPipe(id) ? true : false;
            directions = this.findBasicDirections(id, position);

            for (var d in directions) {
                var direction = directions[d];
                var tileentity = World.getTileEntity(direction.x + position.x, direction.y + position.y, direction.z + position.z);
                if (tileentity) {
                    directions[d] = tileentity;
                } else {
                    for (var pos in position) {
                        directions[d][pos] += position[pos];
                    }
                }
            }

            var directions = {
                inPipe: inPipe,
                directions: directions
            };
            LiquidTransportingCache.registerInfo(position.x, position.y, position.z, directions);
        }

        return directions;
    },

    flushLiquid: function(position, liquid, amount) {
        var data = LiquidMap.getLiquid(position.x, position.y, position.z);
        if (!data) {
            data = TransportedLiquid.deploy(position.x, position.y, position.z, liquid, amount);
            return 0;
        }
        data.addAmount(liquid, amount);
        return 0;
    },



    downloadToStorage: function(storage, liquid, amount) {
        storage.addLiquid(liquid, amount);
    },

    extractFromStorage: function(storage, amount) {
        var liquidStored = storage.getLiquidStored();
        return liquidStored ? storage.getLiquid(liquidStored, amount) : 0;
    }
};


var TransportedLiquid = new GameObject("bc-transported-liquid", {
    init: function(x, y, z, liquid, amount) {
        this.pos = {
            x: x,
            y: y,
            z: z
        };

        this.liquid = {
            id: liquid,
            amount: amount
        };

        this.frame = 0;

        LiquidMap.registerLiquid(this.pos.x, this.pos.y, this.pos.z, this);

    },

    setLiquid: function(liquid, amount) {
        this.liquid.id = liquid;
        this.liquid.amount = amount;
    },

    addAmount: function(liquid, amount) {
        if (this.liquid.id == liquid || !liquid) this.liquid.amount += amount;
    },

    validate: function() {
        if (!this.liquid || this.liquid.amount <= 0.001 || !this.liquid.id || !this.liquid.amount) {
            this.selfDestroy();
        }
        if (this.liquid.amount >= 0.12) this.liquid.amount = 0.12;
    },

    render: function(pos, dirs) {
        var arr = [];
        for (var a in dirs) {
            arr.push({
                x: dirs[a].x - pos.x,
                y: dirs[a].y - pos.y,
                z: dirs[a].z - pos.z
            });
        }
        this.animation.describe({
            skin: LiquidModels.getModelSkin(),
            render: LiquidModels.getLiquidRender(6, this.liquid.amount <= 0.12 ? (this.liquid.amount / 20) * 100 : 6, 6, arr).getId(),
            firmRotation: true,
            hitbox: {
                width: .0,
                height: .0
            }
        });
        this.animation.refresh();
    },


    //pouring

    mean: function(amounts) {
        var mean = 0;
        for (var i in amounts) {
            mean += amounts[i];
        }
        return +((mean / amounts.length).toFixed(3));
    },

    pouringAction: function() {
        var amounts = [this.liquid.amount];
        var deny = [true, true, true, true, true, true];
        var te_counts = 0;
        var env = LiquidTransportHelper.getEnviromentData(this.pos);
        if (!env.inPipe) {
            this.selfDestroy();
            return;
        }

        this.render(this.pos, env.directions);

        for (var d in env.directions) {
            var dir = env.directions[d];
            var liquid = LiquidMap.getLiquid(dir.x, dir.y, dir.z);
            if (dir.liquidStorage) {
                te_counts++;
                continue;
            }
            if (liquid) {
                if (liquid.liquid.id != this.liquid.id || liquid.liquid.amount > this.liquid.amount) {
                    deny[d] = false;
                } else amounts.push(liquid.liquid.amount);
            }
        }

        var mean = this.mean(amounts);
        for (var d in env.directions) {
            var dir = env.directions[d];
            if (!dir.liquidStorage && deny[d]) LiquidTransportHelper.flushLiquid(dir, this.liquid.id, mean);
        }

        if (te_counts > 0) {
            var amountForTE = this.liquid.amount / te_counts;
            this.liquid.amount = 0;
            for (var d in env.directions) {
                var dir = env.directions[d];
                if (dir.addLiquidFromPipe) {
                    this.liquid.amount += dir.addLiquidFromPipe(this.liquid.id, amountForTE);
                } else if (dir.liquidStorage) {
                    var liquidStored = dir.liquidStorage.getLiquidStored();
                    var transportableLiquids;
                    var transportDenied = false;
                    if (dir.getTransportLiquids) {
                        transportableLiquids = dir.getTransportLiquids();
                    }
                    if (transportableLiquids) {
                        for (var id in transportableLiquids.input) {
                            if (this.liquid.id == transportableLiquids.input[id]) transportDenied = true;
                        }
                    } else if (this.liquid.id == liquidStored) transportDenied = true;
                    if (transportDenied) this.liquid.amount += dir.liquidStorage.addLiquid(this.liquid.id, amountForTE);
                }
            }
            return;
        }

        this.liquid.amount = mean;
    },

    //standart callbacks
    loaded: function() {
        this.animation = new Animation.Base(this.pos.x + 7 / 16, this.pos.y + 6 / 16, this.pos.z + 10 / 16);
        this.animation.load();
        LiquidMap.registerLiquid(this.pos.x, this.pos.y, this.pos.z, this);
    },

    update: function() {
        this.frame++;
        if (this.frame % 5 == 0) {
            this.pouringAction();
            this.validate();
        }
    },

    selfDestroy: function() {
        if (this.animation) {
            this.animation.destroy();
        }
        LiquidMap.deleteLiquid(this.pos.x, this.pos.y, this.pos.z);
        this.destroy();
    },
});
