/// <reference path="TravelingItemAnimation.ts" />
type ItemSource = {
    id: number;
    count: number;
    data: number;
};
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
            };
        },

        read(scope) {
            alert(`im readed!`);
            const item = new TravelingItem(scope.coords, scope.item);
            item.moveVector = scope.moveVector;
            item.moveSpeed = scope.moveSpeed;
            return item;
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
        this.itemAnimation = new TravelingItemAnimation(coords, item.id);

        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
        alert(`item ${item.id} created`);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        if (World.getThreadTime() % 40 == 0) this.debug();

        // alert(`update of ${this.item.id}`);
        if (!this.isInsideBlock()) {
            this.destroy();
            return;
        }
        this.move();
    };

    private move(): void {
        if (!(this.moveVector && this.moveSpeed)) return;
        // if (World.getThreadTime() % 40 == 0) alert("moving");
        this.coords.x += this.moveVector.x * this.moveSpeed;
        this.coords.y += this.moveVector.y * this.moveSpeed;
        this.coords.z += this.moveVector.z * this.moveSpeed;
        this.itemAnimation.updateCoords(this.coords);
    }

    private isInsideBlock(): boolean {
        const { x, y, z } = this.coords;
        // alert(`checking block on coords ${x} ${y} ${z}`);
        const isChunkLoaded = World.isChunkLoadedAt(x, y, z);
        const blockID = World.getBlockID(
            this.coords.x,
            this.coords.y,
            this.coords.z
        );
        return !isChunkLoaded || blockID != 0;
    }

    private destroy(): void {
        this.drop();
        this.itemAnimation.destroy();
        this.remove = true;
    }

    private drop(): void {
        alert(`item was dropped`);
    }

    private debug(): void {
        Debug.m(`${this.item.id} on coords ${JSON.stringify(this.coords)}`);
    }
}
