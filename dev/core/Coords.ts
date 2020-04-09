interface IBlockPos {x: number, y: number, z: number}
class BlockPos implements IBlockPos{
    constructor(public readonly x: number, public readonly y: number, public readonly z: number){}
}