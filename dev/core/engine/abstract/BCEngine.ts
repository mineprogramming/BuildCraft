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

    constructor(){
        this.block = new EngineBlock(this.engineType);
        this.item = new EngineItem(this.engineType, this.block);
        TileEntity.registerPrototype(this.block.id, this.requireTileEntity());
        this.registerUse();
        this.registerDrop();
    }

    protected get texture(): EngineTexture {
        return this.engineTexture;
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