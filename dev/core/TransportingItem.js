var ItemTransportingHelper = {
    PipeTiles: {
        // connection types are registred with render connections
    },
    
    PipeParams: {
        // params like friction are stored here
    },
    
    TransportingDenied: {
        // TODO: add all blocks
    },
    
    BasicItemContainers: {
        54: true,
        61: true,
        62: true
    },
    
    registerItemPipe: function(pipe, type, params){
        this.PipeTiles[pipe] = type;
        if (!params){
            params = {};
        }
        if (!params.friction){
            params.friction = 0;
        }
        this.PipeParams[pipe] = params;
    },
    
    isPipe: function(block){
        return this.PipeTiles[block];
    },
    
    canPipesConnect: function(pipe1, pipe2){
        var type1 = this.PipeTiles[pipe1] || ITEM_PIPE_CONNECTION_ANY;
        var type2 = this.PipeTiles[pipe2] || ITEM_PIPE_CONNECTION_ANY;
        return type1 == type2 || type1 == ITEM_PIPE_CONNECTION_ANY || type2 == ITEM_PIPE_CONNECTION_ANY;
    },
    
    canTransportTo: function(pipe, x, y, z){
        var block = World.getBlock(x, y, z).id;
        if (this.BasicItemContainers[block])
            return true; 
        if (block > 4096 && !this.TransportingDenied[block]){
            return TileEntity.isTileEntityBlock(block) || this.canPipesConnect(block, pipe);
        }
        return false;
    },
    
    findNearbyContainers: function(position){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            var container = World.getContainer(position.x + dir.x, position.y + dir.y, position.z + dir.z);
            if (container){
                var block = World.getBlock(position.x + dir.x, position.y + dir.y, position.z + dir.z).id;
                if (!this.TransportingDenied[block]){
                    possibleDirs.push(dir);
                }
            }
        }
        return possibleDirs;
    },
    
    findBasicDirections: function(pipe, position, direction, checkBackwardDirection){
        var directions = [
            {x: -1, y: 0, z: 0},
            {x: 1, y: 0, z: 0},
            {x: 0, y: -1, z: 0},
            {x: 0, y: 1, z: 0},
            {x: 0, y: 0, z: -1},
            {x: 0, y: 0, z: 1},
        ];
        var possibleDirs = [];
        for (var i in directions){
            var dir = directions[i];
            if (checkBackwardDirection && dir.x == -direction.x && dir.y == -direction.y && dir.z == -direction.z){
                continue;
            }
            if (this.canTransportTo(pipe, position.x + dir.x, position.y + dir.y, position.z + dir.z)){
                possibleDirs.push(dir);
            }
        }
        return possibleDirs;
    },
    
    filterDirections: function(listOfDirs, itemDirection){
        var resultDirs = [];
        for (var i in listOfDirs){
            var dir = listOfDirs[i];
            if (!(dir.x == -itemDirection.x && dir.y == -itemDirection.y && dir.z == -itemDirection.z)){
                resultDirs.push(dir);
            }
        }
        return resultDirs;
    },
    
    getPathData: function(transportedItem, item, position, direction){
        position = {
            x: Math.floor(position.x),
            y: Math.floor(position.y),
            z: Math.floor(position.z),
        };
        
        // cache block start
        var cachedData = TransportingCache.getInfo(position.x, position.y, position.z);
        if (!cachedData){
            // get block
            var pipeTile = World.getBlock(position.x, position.y, position.z).id;
            var pipeParams = this.PipeParams[pipeTile];
            var inPipe = this.isPipe(pipeTile);
            // get tile entity
            var container = World.getContainer(position.x, position.y, position.z);
            var tileEntity = container && container.tileEntity;
            // get dirs
            var possibleDirs = this.findBasicDirections(pipeTile, position, direction, false);
            // cache
            cachedData = {
                tileEntity: tileEntity,
                container: container,
                inPipe: inPipe,
                possibleDirs: possibleDirs,
                // params
                friction: pipeParams ? pipeParams.friction : 0
            };
            TransportingCache.registerInfo(position.x, position.y, position.z, cachedData);
        }
        // cache block end
        
        var resultDirs = this.filterDirections(cachedData.possibleDirs, direction);
        var acceleration = 0;
        if (cachedData.tileEntity){
            if (cachedData.tileEntity.getTransportedItemDirs){
                resultDirs = cachedData.tileEntity.getTransportedItemDirs(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
            }
            if (cachedData.tileEntity.getItemAcceleration){
                acceleration = cachedData.tileEntity.getItemAcceleration(transportedItem, cachedData.possibleDirs, item, direction, resultDirs);
            }
        }
        
        return {
            inPipe: cachedData.inPipe,
            directions: resultDirs,
            container: cachedData.container,
            tileEntity: cachedData.tileEntity,
            // params
            acceleration: acceleration,
            friction: cachedData.friction
        };
    }
}

var TransportingItem = new GameObject("bcTransportingItem", {
    init: function(){
        /* setup basics */
        this.pos = {
            x: 0,
            y: 0,
            z: 0
        };
        this.item = {
            id: 0,
            count: 0,
            data: 0
        };
        
        this.inPipeFlag = false;
        
        this.animation = null;
        
        /* setup pathfinding */
        this.target = null;
        this.velocity = .05;
        this.acceleration = .0;
        this.friction = .0;
        this.direction = {
            x: 0, 
            y: 0, 
            z: 0
        };
        
    },
    
    loaded: function(){
        this.reloadAnimation();
    },
    
    update: function(){
        if (this.move()){
            this.pathfind();
        }
        if (!this.item || this.item.count < 0 || !this.item.id){
            this.destroy();
        }
        this.moveAnimation();
    },
    
    destroySelf: function(){
        if (this.animation){
            this.animation.destroy();
        }
        this.destroy();
    },
    

    
    
    /* basics */
    
    setPosition: function(x, y, z){
        this.pos = {
            x: x,
            y: y,
            z: z
        };
    },
    
    setItem: function(id, count, data){
        this.item = {
            id: id,
            count: count, 
            data: data
        };
        if (id > 0){
            this.reloadAnimation();
        }
    },
    
    setItemSource: function(item){
        this.item = item || {id: 0, count: 0, data: 0};
        this.reloadAnimation();
    },
    
    drop: function(){
        this.destroySelf();
        if (this.item && this.item.id > 0 && this.item.count > 0){
            var item = World.drop(this.pos.x, this.pos.y, this.pos.z, this.item.id, this.item.count, this.item.data);
            Entity.setVelocity(item, this.direction.x * this.velocity * 1.5,  this.direction.y * this.velocity * 1.5,  this.direction.z * this.velocity * 1.5)
        }
        this.setItem(0, 0, 0);
    },
    
    validate: function(){
        if (!this.item || this.item.count <= 0){
            this.destroySelf();
        }
    },

    turnBack: function(){
        var delta = {
            x: this.target.x - this.pos.x,
            y: this.target.y - this.pos.y,
            z: this.target.z - this.pos.z,
        };
        this.target = {
            x: this.pos.x - delta.x,
            y: this.pos.y - delta.y,
            z: this.pos.z - delta.z,
        };
    },
    
    
    /* animation */
    
    reloadAnimation: function(){
        
        if (this.animation){
            this.animation.destroy();
        }
        this.animation = new Animation.Item(this.pos.x, this.pos.y, this.pos.z);
        
        var modelCount = 1;
        if (this.item.count > 1){
            modelCount = 2;
        }
        if (this.item.count > 12){
            modelCount = 3;
        }
        if (this.item.count > 56){
            modelCount = 4;
        }
        
        this.animation.describeItem({
            id: this.item.id,
            count: modelCount,
            data: this.item.data,
            size: 0.3,
            rotation: "x"
        });
        this.animation.load();
    },
    
    moveAnimation: function(){
        this.animation.setPos(this.pos.x, this.pos.y, this.pos.z);
    },
    
    
    /* pathfinding */
    
    setTarget: function(x, y, z){
        this.target = {
            x: Math.floor(x) + .5 || 0,
            y: Math.floor(y) + .5 || 0,
            z: Math.floor(z) + .5 || 0,
        };
    },
    
    move: function(){
        this.velocity = Math.min(.5, Math.max(.02, this.velocity + this.acceleration - this.friction || 0));
        if (this.target && this.velocity){
            var delta = {
                x: this.target.x - this.pos.x,
                y: this.target.y - this.pos.y,
                z: this.target.z - this.pos.z,
            };
            var dis = Math.sqrt(delta.x * delta.x + delta.y * delta.y + delta.z * delta.z);
            this.direction = {
                x: Math.floor(delta.x / dis + .5) || 0,
                y: Math.floor(delta.y / dis + .5) || 0,
                z: Math.floor(delta.z / dis + .5) || 0,
            };
            var move = Math.min(dis, this.velocity) / dis || 0;
            this.pos.x += delta.x * move;
            this.pos.y += delta.y * move;
            this.pos.z += delta.z * move;
            return dis <= this.velocity;
        }
        return true;
    },
    
    
    addItemToContainer: function(container){
        // container.refreshSlots();
        var tileEntity = container.tileEntity;
        var slots = [];
        var slotsInitialized = false;
        if (tileEntity){
            if (tileEntity.addTransportedItem){
                tileEntity.addTransportedItem(this, this.item, this.direction);
                return;
            }
            if (tileEntity.getTransportSlots){
                slots = tileEntity.getTransportSlots().input || [];
                slotsInitialized = true;
            }
        }
        if (!slotsInitialized){
            for (var name in container.slots){
                slots.push(name);
            }
        }
        for (var i in slots){
            var slot = container.getSlot(slots[i]);
            if (this.item.count <= 0){
                break;
            }
            if (slot.id == 0 || slot.id == this.item.id && slot.data == this.item.data){
                var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
                var add = Math.min(maxstack - slot.count, this.item.count);
                this.item.count -= add;
                slot.count += add;
                slot.id = this.item.id;
                slot.data = this.item.data;
            }
        }
        container.applyChanges();
        container.validateAll();
    },
    
    pathfind: function(){
        if (this.dropFlag){
            this.drop();
            return;
        }
        
        var pathdata = ItemTransportingHelper.getPathData(this, this.item, this.pos, this.direction);
        var directions = pathdata.directions;
        var dir = directions[parseInt(directions.length * Math.random())];
        
        this.acceleration = pathdata.acceleration;
        this.friction = pathdata.friction;
        
        if (pathdata.inPipe){           
            if (!dir){
                dir = this.direction;
                this.dropFlag = true;
            }
            this.inPipeFlag = true;
        }
        else if (pathdata.container){
            if (this.inPipeFlag){
                this.addItemToContainer(pathdata.container);
                this.validate();
            }
            this.inPipeFlag = false;
        }
        else {
            if (this.inPipeFlag){
                this.drop();
            }
            if (!dir){
                this.drop();
            }
        }
        
        if (dir){
            this.target = {
                x: Math.floor(this.pos.x) + .5 + dir.x,
                y: Math.floor(this.pos.y) + .5 + dir.y,
                z: Math.floor(this.pos.z) + .5 + dir.z,
            };
        }
    }
});

