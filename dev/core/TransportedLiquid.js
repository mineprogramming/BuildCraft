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
            renderAPI: LiquidModels.getLiquidRender(6, this.liquid.amount <= 0.12 ? (this.liquid.amount / 20) * 100 : 6, 6, arr),
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
