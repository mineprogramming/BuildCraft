/// <reference path="TravelingItemAnimation.ts" />
/// <reference path="TravelingItemMover.ts" />
/// <reference path="../../components/PipeIdMap.ts" />
/// <reference path="TravelingItemNetworkEntity.ts" />
const ITEM_DROP_VELOCITY = +__config__.getNumber("item_drop_velocity");
const ITEM_COOLDOWN_TIME = 100;
const DESTROY_CHECK_FREQUENCY = 3;
class TravelingItem {
    // ! its just a Updatable flag
    public remove: boolean = false;
    private readonly itemMover: TravelingItemMover;

    public blockSource: BlockSource;
    private networkEntity: NetworkEntity;

    private cooldown = 0;

    public static saverId = Saver.registerObjectSaver("TravelingItemSaver", {
        save(travelingItem: TravelingItem) {
            const dataToSave = {
                dimension: travelingItem.dimension,
                coords: travelingItem.itemMover.Coords,
                moveIndex: travelingItem.itemMover.MoveVectorIndex,
                moveSpeed: travelingItem.itemMover.MoveSpeed,
                targetSpeed: travelingItem.itemMover.PipeSpeed.Target,
                deltaSpeed: travelingItem.itemMover.PipeSpeed.Delta,
                progressPart: travelingItem.itemMover.ProgressPart,
                item: travelingItem.item,
            };
            return dataToSave;
        },

        read(scope) {
            const item = new TravelingItem(
                scope.coords,
                scope.dimension,
                scope.item,
                scope.moveIndex,
                scope.moveSpeed,
                new PipeSpeed(scope.targetSpeed, scope.deltaSpeed),
                scope.progressPart
            );
        }
    });

    constructor(
        coords: Vector,
        private dimension: number,
        private item: ItemInstance,
        moveVectorIndex: number,
        moveSpeed: number = null,
        pipeSpeed: PipeSpeed = BCPipe.StandartPipeSpeed,
        progressPart: number = 0
    ) {
        this.itemMover = new TravelingItemMover(coords, progressPart, moveVectorIndex, this.item, pipeSpeed, moveSpeed);
        Saver.registerObject(this, TravelingItem.saverId);
        Updatable.addUpdatable(this);
    }

    public get Coords(): Vector {
        return this.itemMover.Coords;
    }

    public get VisualItem(): {id, count, data} {
        return {
            id: this.item.id,
            count: this.item.count,
            data: this.item.data
        };
    }

    public get MoveData(): TravelingItemMoveData {
        return {
            coordsFrom: this.itemMover.PrevCoords,
            vectorIndex: this.itemMover.MoveVectorIndex,
            time: this.itemMover.TravelTime
        }
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        if (this.cooldown-- > 0) {
            return;
        }

        if (!this.blockSource) {
            this.blockSource = BlockSource.getDefaultForDimension(this.dimension);
            if (!this.blockSource){
                this.cooldown = ITEM_COOLDOWN_TIME;
                return;
            } else {
                
                this.networkEntity = new NetworkEntity(TravelingItemNetworkType, this);
                this.updateMoveData();
            }
        }

        const { x, y, z } = this.itemMover.AbsoluteCoords;
        /**
         * If an object moves in an unloaded chunk,
         * then it can exit its pipe network and fall into another
         * that is not connected to the past
         */
        if (!this.blockSource.isChunkLoaded(Math.floor(x / 16), Math.floor(z / 16))){
            this.cooldown = ITEM_COOLDOWN_TIME;
            return;
        }

        if (this.itemMover.hasReached()) {
            /*
            * checking for block destroy
            * I think this way is more convenient than array of travelingItems
            * and DestroyBlock check
            */
            if (this.blockSource.getBlockId(x, y, z) == 0) {
                this.destroy(true);
                return;
            }

            const container = World.getContainer(x, y, z, this.blockSource);
            if (this.modifyByPipe()) {
                this.destroy();
                return;
            }
            if (container != null && this.itemMover.isValidContainer(container)) {
                const pushedCount = StorageInterface.putItemToContainer(this.item, container,
                                    this.itemMover.MoveVectorIndex, this.item.count);
                if (pushedCount > 0) {
                    this.destroy();
                    return;
                }
            }

            
            this.networkEntity.getClients().setupDistancePolicy(x, y, z, this.blockSource.getDimension(), 32);
            if (this.itemMover.findNewMoveVector(this.blockSource)) {
                this.updateMoveData();
            } else {
                this.destroy(true);
                return;
            }
        }

        this.itemMover.move();
    };

    /**
     * @returns {boolean} should destroy item
     */
    private modifyByPipe(): boolean {
        const {x, y, z} = this.itemMover.AbsoluteCoords;
        const tile = World.getTileEntity(x, y, z, this.blockSource)
        if (!tile) return false;

        // ? modifyTravelingItem(item: TravelingItem): boolean
        return tile.modifyTravelingItem ? tile.modifyTravelingItem(this) : false;
    }

    private updateMoveData(): void {
        
        this.networkEntity.send("moveData", this.MoveData);
    }


    private destroy(drop: boolean = false): void {
        if (drop) this.drop();
        this.remove = true;
        
        this.networkEntity.remove();
    }

    private drop(): void {
        const { x, y, z } = this.itemMover.Coords;
        const { id, count, data, extra} = this.item;
        const entity = this.blockSource.spawnDroppedItem(x, y, z, id, count, data, extra || null);

        const speed = ITEM_DROP_VELOCITY;
        const velVec = this.itemMover.getVectorBySide(this.itemMover.MoveVectorIndex);
        Entity.addVelocity(entity, velVec.x * speed, velVec.y * speed, velVec.z * speed);
    }
}
