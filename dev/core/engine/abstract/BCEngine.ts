/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/EngineItem.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../../Coords.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
abstract class BCEngine {
    protected block: EngineBlock;
    protected item: EngineItem;

    protected maxHeat: number = 100;
    protected tileEntity: BCEngineTileEntity;

    protected engineTexture: EngineTexture;
    constructor(){
        this.block = new EngineBlock(this.engineType);
        this.item = new EngineItem(this.engineType, this.block);

        this.registerTileEntity();
        TileEntity.registerPrototype(this.block.id, this.tileEntity);
        this.registerUse();
        this.registerDrop();
    }

    public get engineType(): string{
        return null
    }

    protected get texture(): EngineTexture {
        return this.engineTexture;
    }

    protected registerTileEntity(){
        this.tileEntity = new BCEngineTileEntity(this.maxHeat, this.texture);
    }

    private registerUse(): void {
        Item.registerUseFunction(this.item.stringId, (coords, item, block) => {
            Player.decreaseCarriedItem();
            this.setBlock(coords.relative);
        });
    }

    private registerDrop(): void {
        Block.registerDropFunction(this.block.stringId, () => {
            return [[this.item.id, 1, 0]]
        });
    }

    private setBlock(coords: Vector): void {
        World.setBlock(coords.x, coords.y, coords.z, this.block.id, 0);
        World.addTileEntity(coords.x, coords.y, coords.z);
    }
}