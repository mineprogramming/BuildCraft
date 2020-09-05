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
            };
        },

        read(scope) {
            const item = new TravelingItem(
                scope.coords,
                scope.item,
                scope.moveSpeed,
                scope.moveIndex
            );
        },
    });

    constructor(
        coords: Vector,
        private item: ItemInstance,
        moveSpeed: number,
        moveVectorIndex: number
    ) {
        this.itemMover = new TravelingItemMover(coords, moveSpeed, moveVectorIndex, this.item);
        this.itemAnimation = new TravelingItemAnimation(this.itemMover.Coords, item);

        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        const { x, y, z } = this.itemMover.AbsoluteCoords;
        if (!World.isChunkLoadedAt(x, y, z)) return;
        /*
         * checking for block destroy
         * I think this way is more convenient than array of travelingItems
         * and DestroyBlock check
         */
        if (World.getBlockID(x, y, z) == 0) this.destroy(true);

        if (this.itemMover.isInCoordsCenter()) {
            const container = World.getContainer(x, y, z);
            if (container != null && this.itemMover.isValidContainer(container)) {
                StorageInterface.putItemToContainer(this.item, container, this.itemMover.MoveVectorIndex, this.item.count);
                this.destroy();
                return;
            } else if (!this.itemMover.findNewMoveVector()) {
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
        const { x, y, z } = this.itemMover.Coords;
        const speed = this.itemMover.MoveSpeed * 25;
        const velVec = this.itemMover.getVectorBySide(this.itemMover.MoveVectorIndex);
        const { id, count, data } = this.item;
        const entity = World.drop(x, y, z, id, count, data);
        Entity.addVelocity(entity, velVec.x * speed, velVec.y * speed, velVec.z * speed);
    }

    private debug(): void {
        const x = Math.floor(this.itemMover.Coords.x);
        const y = Math.floor(this.itemMover.Coords.y);
        const z = Math.floor(this.itemMover.Coords.z);
        const id = World.getBlockID(x, y, z);
        Game.tipMessage(
            `on coords ${JSON.stringify(this.itemMover.Coords)}
            index ${this.itemMover.MoveVectorIndex} block is ${id}`
        );
    }
}
