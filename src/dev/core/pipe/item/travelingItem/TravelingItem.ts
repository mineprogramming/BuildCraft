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
                item: travelingItem.item,
            };
        },

        read(scope) {
            alert(`im readed!`);
            const item = new TravelingItem(scope.coords, scope.item);
            item.moveVector = scope.moveVector;
            item.moveSpeed = scope.moveSpeed;
            return item;
        },
    });

    public moveVector: Vector;
    public moveSpeed: number = 0;
    private coords: Vector;
    constructor(coords: Vector, private item: ItemSource) {
        this.coords = this.coordsToFixed(coords);
        this.itemAnimation = new TravelingItemAnimation(coords, item);

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
        const newCoords = {
            x: this.coords.x + this.moveVector.x * this.moveSpeed,
            y: this.coords.y + this.moveVector.y * this.moveSpeed,
            z: this.coords.z + this.moveVector.z * this.moveSpeed
        }
        // this.coords.x += this.moveVector.x * this.moveSpeed;
        // this.coords.y += this.moveVector.y * this.moveSpeed;
        // this.coords.z += this.moveVector.z * this.moveSpeed;
        this.coords = this.coordsToFixed(newCoords);
        this.itemAnimation.updateCoords(this.coords);
    }

    private coordsToFixed(coords: Vector): Vector {
        return {
            x: Math.floor(coords.x * 1000) / 1000,
            y: Math.floor(coords.y * 1000) / 1000,
            z: Math.floor(coords.z * 1000) / 1000,
        }
    }

    private isInCoordsCenter(coords: Vector): boolean {
        const isInCenterByX = coords.x % .5 == 0 && coords.x % 1 != 0;
        const isInCenterByY = coords.y % .5 == 0 && coords.y % 1 != 0;
        const isInCenterByZ = coords.z % .5 == 0 && coords.z % 1 != 0;
        return isInCenterByX && isInCenterByY && isInCenterByZ;
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
        World.drop(
            this.coords.x,
            this.coords.y,
            this.coords.z,
            this.item.id,
            this.item.count,
            this.item.data
        );
        alert(`item was dropped`);
    }

    private debug(): void {
        Debug.m(`${this.item.id} on coords ${JSON.stringify(this.coords)}`);
    }
}
