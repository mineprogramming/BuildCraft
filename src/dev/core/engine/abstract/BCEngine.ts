/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/EngineItem.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
abstract class BCEngine {
    protected block: EngineBlock;
    protected item: EngineItem;

    protected maxHeat: number = 100;

    protected engineTexture: EngineTexture;

    public get engineType(): string {
        return null
    }

    protected abstract requireTileEntity(): object

    constructor() {
        this.block = new EngineBlock(this.engineType);
        this.item = new EngineItem(this.engineType, this.block);
        Block.setupAsRedstoneReceiver(this.block.stringId, true)
        TileEntity.registerPrototype(this.block.id, this.requireTileEntity());
        this.registerUse();
        this.registerDrop();
        this.registerNeighbourChangeFunction();
    }

    protected get texture(): EngineTexture {
        return this.engineTexture;
    }

    private registerUse(): void {
        // TODO fix coords when update declarations
        Item.registerUseFunction(this.item.stringId, (coords: any, item: ItemInstance, block: Tile, player: number) => {
            const { x, y, z } = coords.relative;
            const region = BlockSource.getDefaultForActor(player);
            if (region.getBlockId(x, y, z) == 0) {
                Entity.setCarriedItem(player, item.id, item.count - 1, item.data);
                this.setBlock(region, coords.relative);
            }
        });
    }

    private registerNeighbourChangeFunction(): void {
        Block.registerNeighbourChangeFunctionForID(this.block.id, (coords, block, changeCoords, region: BlockSource) => {
            const tile = World.getTileEntity(coords.x, coords.y, coords.z, region);
            if (tile) tile.checkOrientation = true;
        });
    }

    private registerDrop(): void {
        Block.registerDropFunction(this.block.stringId, () => {
            return [[this.item.id, 1, 0]]
        });
    }

    private setBlock(region: BlockSource, coords: Vector): void {
        region.setBlock(coords.x, coords.y, coords.z, this.block.id, 1);
        World.addTileEntity(coords.x, coords.y, coords.z, region);
        World.playSound(coords.x, coords.y, coords.z, "dig.stone", 1, 0.8);
    }
}