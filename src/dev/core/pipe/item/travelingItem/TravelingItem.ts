/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="TravelingItemMover.ts" />
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
    private readonly itemMover: TravelingItemMover;
    public static saverId = Saver.registerObjectSaver("TravelingItemSaver", {
        save(travelingItem) {
            alert(`im saved!`);
            // TODO test save values
            return {
                coords: travelingItem.coords,
                // moveVector: travelingItem.moveVector,
                moveIndex: travelingItem.itemMover.MoveVectorIndex,
                moveSpeed: travelingItem.itemMover.MoveSpeed,
                item: travelingItem.item,
                timeBeforeContainerExit: travelingItem.itemMover.TimeBeforeContainerExit,
            };
        },

        read(scope) {
            alert(`im readed!`);
            const item = new TravelingItem(scope.coords, scope.item, scope.moveSpeed, scope.moveIndex);
            item.itemMover.TimeBeforeContainerExit = scope.timeBeforeContainerExit;
            return item;
        },
    });

    constructor(coords: Vector, private item: ItemSource, moveSpeed: number, moveVectorIndex: number) {
        // this.coords = this.coordsToFixed(coords);
        this.itemMover = new TravelingItemMover(coords, moveSpeed, moveVectorIndex);
        this.itemAnimation = new TravelingItemAnimation(this.itemMover.Coords, item);

        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
        alert(`item ${item.id} created`);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        this.debug();

        if (!this.isInsidePipe() && this.itemMover.TimeBeforeContainerExit == 0) {
            this.destroy();
            return;
        }

        this.itemMover.move();
        this.itemAnimation.updateCoords(this.itemMover.Coords);
    };

    private getBlockClass(): BCPipe | null {
        const blockID = World.getBlockID(
            this.itemMover.Coords.x,
            this.itemMover.Coords.y,
            this.itemMover.Coords.z
        );
        return PipeIdMap.getClassById(blockID);
    }

    private isInsidePipe(): boolean {
        const { x, y, z } = this.itemMover.Coords;
        const isChunkLoaded = World.isChunkLoadedAt(x, y, z);
        return !isChunkLoaded || this.getBlockClass() != null;
    }

    private destroy(): void {
        this.drop();
        this.itemAnimation.destroy();
        this.remove = true;
    }

    private drop(): void {
        World.drop(
            this.itemMover.Coords.x,
            this.itemMover.Coords.y,
            this.itemMover.Coords.z,
            this.item.id,
            this.item.count,
            this.item.data
        );
        alert(`item was dropped`);
    }

    private debug(): void {
        const id = World.getBlockID(this.itemMover.Coords.x, this.itemMover.Coords.y, this.itemMover.Coords.z);
        const cls = PipeIdMap.getClassById(id);
        Game.tipMessage(`on coords ${JSON.stringify(this.itemMover.Coords)} is pipe ${cls} block is ${id}`);
    }
}
