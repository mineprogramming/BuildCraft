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
                targetSpeed: travelingItem.itemMover.PipeSpeed.Target,
                deltaSpeed: travelingItem.itemMover.PipeSpeed.Delta,
                timeToDest: travelingItem.itemMover.TimeToDest,
                item: travelingItem.item,
            };
        },

        read(scope) {
            const item = new TravelingItem(
                scope.coords,
                scope.item,
                scope.moveIndex,
                new PipeSpeed(scope.targetSpeed, scope.deltaSpeed),
                scope.timeToDest
            );
        }
    });

    constructor(
        coords: Vector,
        private item: ItemInstance,
        moveVectorIndex: number,
        pipeSpeed: PipeSpeed = BCPipe.StandartPipeSpeed,
        timeToDest: number = 0
    ) {
        this.itemMover = new TravelingItemMover(coords, moveVectorIndex, this.item, pipeSpeed, timeToDest);
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
        if (World.getBlockID(x, y, z) == 0) {
            this.destroy(true);
            return;
        }

        if (this.itemMover.TimeToDest <= 0) {
            const container = World.getContainer(x, y, z);
            if (this.modifyByPipe()) {
                this.destroy();
                return;
            }
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

    /**
     * @returns {boolean} should destroy item
     */
    private modifyByPipe(): boolean {
        const {x, y, z} = this.itemMover.AbsoluteCoords;
        const tile = World.getTileEntity(x, y, z)
        if (!tile) return false;

        // ? modifyTravelingItem(item: TravelingItem): boolean
        return tile.modifyTravelingItem ? tile.modifyTravelingItem(this) : false;
    }

    private destroy(drop: boolean = false): void {
        if (drop) this.drop();
        this.itemAnimation.destroy();
        this.remove = true;
    }

    private drop(): void {
        const { x, y, z } = this.itemMover.Coords;
        const { id, count, data } = this.item;
        const entity = World.drop(x, y, z, id, count, data);

        const speed = .25;
        const velVec = this.itemMover.getVectorBySide(this.itemMover.MoveVectorIndex);
        Entity.addVelocity(entity, velVec.x * speed, velVec.y * speed, velVec.z * speed);
    }
}
