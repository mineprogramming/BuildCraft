/// <reference path="TravelingItemAnimation.ts" />
type ItemSource = {
    id: number
    count: number
    data: number
}
class TravelingItem {
    // ! its just a Updatable flag
    public remove: boolean = false;
    private readonly itemAnimation: TravelingItemAnimation;
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
            x: Math.floor(coords.x),
            y: Math.floor(coords.y),
            z: Math.floor(coords.z)
        };
        this.itemAnimation = new TravelingItemAnimation(this.coords, item.id);

        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
        alert(`item created on coords ${item.id}`);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        if (World.getThreadTime() % 40 == 0) this.debug();

        alert(`update of ${this.item.id}`);
        /*if (!this.isInsideBlock()) {
            this.drop();
            return;
        }*/
        this.move();
    }

    private move(): void {
        if (!(this.moveVector && this.moveSpeed)) return;
        this.coords.x += this.moveVector.x * this.moveSpeed;
        this.coords.y += this.moveVector.y * this.moveSpeed;
        this.coords.z += this.moveVector.z * this.moveSpeed;
    }

    private isInsideBlock(): boolean {
        const {x, y, z} = this.coords;
        alert(`checking block on coords ${x} ${y} ${z}`);
        const isChunkLoaded = World.isChunkLoadedAt(x, y, z);
        const blockID = World.getBlockID(this.coords.x, this.coords.y, this.coords.z)
        return !isChunkLoaded || blockID != 0;
    }

    private drop(): void {
        alert(`item was dropped`);
        this.remove = true;
    }

    private debug(): void {
        Debug.m(`${this.item.id} on coords ${JSON.stringify(this.coords)}`);
    }
}
Callback.addCallback("ItemUse", (coords, item, block) => {
    const crds = Entity.getPosition(Player.get());
    const travelItem = new TravelingItem(crds, item);
});