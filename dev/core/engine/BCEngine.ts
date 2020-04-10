/// <reference path="components/EngineBlock.ts" />
/// <reference path="components/EngineItem.ts" />
/// <reference path="components/EngineAnimation.ts" />
/// <reference path="EngineHeat.ts" />
/// <reference path="EngineType.ts" />
/// <reference path="../Coords.ts" />

abstract class BCEngine {
    protected block: EngineBlock;
    protected item: EngineItem;

    constructor(public readonly type: EngineType){
        this.block = new EngineBlock(this.type);
        this.item = new EngineItem(this.type, this.block);

        TileEntity.registerPrototype(this.block.id, this.tileEntityObject);

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
        animation: null,

        init: function(){
            alert("init ");
            Debug.m(this.type);
            this.animation = new EngineAnimation(BlockPos.getCoords(this), this.type);
        },

        tick: function(){
            this.animation.update();
        }
    };
}