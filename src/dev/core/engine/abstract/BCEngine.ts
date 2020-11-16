/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/model/EngineItemModel.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
abstract class BCEngine {
    protected block: EngineBlock;

    protected engineItemModel: EngineItemModel;

    public get engineType(): string {
        return null
    }

    protected abstract requireTileEntity(): object

    constructor() {
        this.block = new EngineBlock(this.engineType);
        this.engineItemModel = new EngineItemModel(this.texture);
        Block.setupAsRedstoneReceiver(this.block.stringId, true)
        TileEntity.registerPrototype(this.block.id, this.requireTileEntity());
        this.registerHandModel();
        this.registerDrop();
        this.registerNeighbourChangeFunction();
    }

    protected get texture(): EngineTexture {
        return null;
    }

    private registerHandModel(): void {
        ItemModel.getFor(this.block.id, 1).setModel(this.engineItemModel.Model);
    }

    private registerNeighbourChangeFunction(): void {
        Block.registerNeighbourChangeFunctionForID(this.block.id, (coords, block, changeCoords, region: BlockSource) => {
            const tile = World.getTileEntity(coords.x, coords.y, coords.z, region);
            if (tile) tile.checkOrientation = true;
        });
    }

    private registerDrop(): void {
        Block.registerDropFunction(this.block.stringId, () => {
            return [[this.block.id, 1, 1]]
        });
    }
}