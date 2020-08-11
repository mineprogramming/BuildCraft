type ItemSource = {
    id: number
    count: number
    data: number
}

class TravelingItem {
    // ! its just a Updatable flag
    public remove: boolean = false;
    public static saverId = Saver.registerObjectSaver("TravelingItemSaver", {
        save(travelingItem) {
            alert(`im saved!`);
            return {
                coords: travelingItem.coords,
                moveVector: travelingItem.moveVector,
                moveSpeed: travelingItem.moveSpeed,
                item: travelingItem.item
            }
        },

        read(scope) {
            alert(`im readed!`);
            const item = new TravelingItem(scope.coords, scope.item);
            item.moveVector = scope.moveVector;
            item.moveSpeed = scope.moveSpeed;
            return item
        }
    });

    public moveVector: Vector;
    public moveSpeed: number = 0;
    private coords: Vector;
    constructor(coords: Vector, private item: ItemSource) {
        this.coords = {
            x: coords.x,
            y: coords.y,
            z: coords.z
        };
        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
        alert(`item created on coords ${item.id}`);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        if (World.getThreadTime() % 40 == 0) this.debug();

        alert(`update of ${this.item.id}`);
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
        const {x, y, z} = this.coords;
        alert(`checking block on coords ${x} ${y} ${z}`);
        return World.getBlockID(this.coords.x, this.coords.y, this.coords.z) != 0;
    }

    private drop() {
        alert(`item was dropped`);
        this.remove = true;
    }

    private debug() {
        Debug.m(`${this.item.id} on coords ${JSON.stringify(this.coords)}`);
    }
}
Callback.addCallback("ItemUse", (coords, item, block) => {
    const travelItem = new TravelingItem(coords, item);
});