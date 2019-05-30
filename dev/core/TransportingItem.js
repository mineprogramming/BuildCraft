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
        var OFFSET = .3;
        
        if (this.animation){
            this.animation.destroy();
        }
        this.animation = new Animation.Item(this.pos.x + OFFSET, this.pos.y + OFFSET, this.pos.z + OFFSET);
        
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
            size: .5,
            rotation: "x"
        }, {
            x: -OFFSET,
            y: -OFFSET,
            z: -OFFSET,
        });
        this.animation.load();
    },
    
    moveAnimation: function(){
        var OFFSET = .3;
        this.animation.setPos(this.pos.x + OFFSET, this.pos.y + OFFSET, this.pos.z + OFFSET);
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
        container.refreshSlots();
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

