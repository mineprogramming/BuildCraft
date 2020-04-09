class TileEntityProvider{
    constructor(public readonly blockId: number, public readonly model: object){
        TileEntity.registerPrototype(blockId, model);
    }
}