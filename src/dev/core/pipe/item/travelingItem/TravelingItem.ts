/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="../../components/PipeIdMap.ts" />
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
                // moveVector: travelingItem.moveVector,
                moveIndex: travelingItem.moveIndex,
                moveSpeed: travelingItem.moveSpeed,
                item: travelingItem.item,
                timeBeforChange: travelingItem.timeBeforeVectorChange
            };
        },

        read(scope) {
            alert(`im readed!`);
            const item = new TravelingItem(scope.coords, scope.item);
            // item.moveVector = scope.moveVector;
            item.moveSpeed = scope.moveSpeed;
            item.moveVectorIndex = scope.moveIndex;
            item.timeBeforeVectorChange = scope.timeBeforChange;
            return item;
        },
    });

    public moveVectorIndex: number = null;
    public moveSpeed: number = 0;
    private coords: Vector;
    private timeBeforeVectorChange = 40;
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
        this.checkMoveVectorChange();
    }

    private move(): void {
        const moveVector = this.getVectorBySide(this.moveVectorIndex);
        if (this.moveSpeed <= 0 || this.moveVectorIndex == null) return;

        const newCoords = {
            x: this.coords.x + moveVector.x * this.moveSpeed,
            y: this.coords.y + moveVector.y * this.moveSpeed,
            z: this.coords.z + moveVector.z * this.moveSpeed,
        };

        this.coords = this.coordsToFixed(newCoords);
        this.itemAnimation.updateCoords(this.coords);

        this.checkMoveVectorChange();
    }

    private coordsToFixed(coords: Vector): Vector {
        return {
            x: Math.floor(coords.x * 1000) / 1000,
            y: Math.floor(coords.y * 1000) / 1000,
            z: Math.floor(coords.z * 1000) / 1000,
        };
    }

    private checkMoveVectorChange(): void {
        if (this.timeBeforeVectorChange > 0) {
            this.timeBeforeVectorChange--;
            return;
        }

        if (!this.isInsideBlock()) return;

        this.moveVectorIndex = this.findNewMoveVector();
        this.timeBeforeVectorChange = 40;
    }

    // TODO make this sht
    private findNewMoveVector(): number {
        Debug.m(`finding new Vector`);
        let vctr = this.moveVectorIndex;
        const nextPipes = this.getNearbyPipes();
        const keys = Object.keys(nextPipes);

        if (keys.length > 0) {
            const keyIndex = this.random(keys.length);
            vctr = parseInt(keys[keyIndex]);
        }

        return vctr;
    }

    private random(max: number): number {
        return Math.floor(Math.random() * max);
    }

    // *Heh-heh cunning Nikolai won
    private getVectorBySide(side: number): Vector {
        return World.getRelativeCoords(0, 0, 0, side);
    }

    private getNearbyPipes(): object {
        const pipes = {};
        for (let i = 0; i < 6; i++) {
            const {x, y, z} = World.getRelativeCoords(this.coords.x, this.coords.y, this.coords.z, i);
            const pipeID = World.getBlockID(x, y, z);
            const cls = PipeIdMap.getClassById(pipeID);
            const backVectorIndex = World.getInverseBlockSide(this.moveVectorIndex);
            if (i != backVectorIndex && cls != null) {
                pipes[i] = cls;
            }
        }
        return pipes
    }


    private getBlockClass(): BCPipe | null {
        const blockID = World.getBlockID(
            this.coords.x,
            this.coords.y,
            this.coords.z
        );
        return PipeIdMap.getClassById(blockID);
    }

    private isInCoordsCenter(coords: Vector): boolean {
        const isInCenterByX = coords.x % 0.5 == 0 && coords.x % 1 != 0;
        const isInCenterByY = coords.y % 0.5 == 0 && coords.y % 1 != 0;
        const isInCenterByZ = coords.z % 0.5 == 0 && coords.z % 1 != 0;
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
