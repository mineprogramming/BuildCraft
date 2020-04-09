/// <reference path="components/EngineBlock.ts" />
/// <reference path="components/EngineItem.ts" />
/// <reference path="EngineType.ts" />
/// <reference path="TileEntityProvider.ts" />
/// <reference path="../Coords.ts" />

abstract class BCEngine {
    protected block: EngineBlock;
    protected item: EngineItem;

    private tileEntityProvider: TileEntityProvider;

    private animationBase: object;
    private animationPiston: object;

    constructor(public readonly type: EngineType){
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);
        this.tileEntityProvider = new TileEntityProvider(this.block.id, this.tileEntityObject);
        let self = this;
        Item.registerUseFunction(this.item.stringId, function(coords, item, block){
            Debug.m(coords.relative);
            self.setBlock(coords.relative);
        });
    }

    private setBlock(coords: IBlockPos): void {
        World.setBlock(coords.x, coords.y, coords.z, this.block.id, 0);
        World.addTileEntity(coords.x, coords.y, coords.z);
    }

    protected tileEntityObject: object = {
        init: this.init,
        tick: this.tick
    };

    //TileEntity
    protected init(): void {}
    protected tick(): void {}
}