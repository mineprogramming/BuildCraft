interface IBlockPos {x: number, y: number, z: number}
class BlockPos implements IBlockPos{
    constructor(public readonly x: number, public readonly y: number, public readonly z: number){}
    static getCoords(variable): BlockPos {
        return new BlockPos(parseInt(variable.x), parseInt(variable.y), parseInt(variable.z))
    }
}