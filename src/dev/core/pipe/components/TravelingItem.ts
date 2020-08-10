type ItemSource = {
    id: number
    count: number
    data: number
}

class TravelingItem {
    //! its just a Updatable flag
    public remove: boolean = false;
    public static saverId = Saver.registerObjectSaver("TravelingItemSaver", {
        save: function(travelingItem) {
            Debug.m(`im saved!`);
            return {
                coords: travelingItem.coords,
                moveVector: travelingItem.moveVector,
                moveSpeed: travelingItem.moveSpeed,
                item: travelingItem.item
            }
        },

        read: function(scope) {
            Debug.m(`im readed!`);
            const {x, y, z} = scope.coords;
            const item = new TravelingItem(x, y, z, scope.item);
            item.moveVector = scope.moveVector;
            item.moveSpeed = scope.moveSpeed;
            Updatable.addUpdatable(item);
            return item
        }
    });

    private coords: Vector;
    public moveVector: Vector;
    public moveSpeed: number = 0;
    constructor(x: number, y: number, z: number, private item: ItemSource) {
        this.coords = {
            x: x,
            y: y,
            z: z
        }
        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
        Debug.m(`item created on coords`);
        Debug.m(this.coords);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        Debug.m(`update of ${this.item.id}`);
        if (!this.isInsideBlock()) {
            this.drop();
            return;
        }
        this.move();
    }

    private move() {
        if (!(this.moveVector && this.moveSpeed)) return;
        this.coords.x += this.moveVector.x * this.moveSpeed;
        this.coords.y += this.moveVector.y * this.moveSpeed;
        this.coords.z += this.moveVector.z * this.moveSpeed;
    }

    private isInsideBlock(): boolean {
        return World.getBlockID(this.coords.x, this.coords.y, this.coords.z) != 0;
    }

    private drop() {
        Debug.m(`item was dropped`);
        this.remove = true;
    }
}
Callback.addCallback("ItemUse", (coords, item, block) => {
    new TravelingItem(coords.x, coords.y, coords.z, item);
});