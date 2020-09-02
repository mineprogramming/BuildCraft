/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="TravelingItemMover.ts" />
/// <reference path="../../components/PipeIdMap.ts" />
class TravelingItem {
    // ! its just a Updatable flag
    public remove: boolean = false;
    private readonly itemAnimation: TravelingItemAnimation;
    private readonly itemMover: TravelingItemMover;
    public static saverId = Saver.registerObjectSaver("TravelingItemSaver", {
        save(travelingItem: TravelingItem) {
            return {
                coords: travelingItem.itemMover.Coords,
                moveIndex: travelingItem.itemMover.MoveVectorIndex,
                moveSpeed: travelingItem.itemMover.MoveSpeed,
                item: travelingItem.item,
                timeBeforeContainerExit: travelingItem.itemMover.TimeBeforeContainerExit,
            };
        },

        read(scope) {
            const item = new TravelingItem(scope.coords, scope.item, scope.moveSpeed, scope.moveIndex);
            item.itemMover.TimeBeforeContainerExit = scope.timeBeforeContainerExit;
        }
    });

    constructor(coords: Vector, private item: ItemInstance, moveSpeed: number, moveVectorIndex: number) {
        this.itemMover = new TravelingItemMover(coords, moveSpeed, moveVectorIndex);
        this.itemAnimation = new TravelingItemAnimation(this.itemMover.Coords, item);

        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        this.debug();

        if (this.itemMover.TimeBeforeContainerExit == 0) {
            const {x, y, z} = this.itemMover.Coords;
            const container = World.getContainer(x, y, z);

            if (container != null) {
                StorageInterface.putItemToContainer(this.item, container, this.itemMover.MoveVectorIndex, this.item.count);
                this.destroy();
                return;
            } else if (!this.itemMover.isInsidePipe()) {
                this.destroy(true);
                return;
            }
        }

        this.itemMover.move();
        this.itemAnimation.updateCoords(this.itemMover.Coords);
    };

    private destroy(drop: boolean = false): void {
        if (drop) this.drop();
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
