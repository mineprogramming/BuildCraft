abstract class PipeConnector {
    abstract canPipesConnect(coords0: Vector, coords1: Vector): boolean
    abstract canConnectToGroup(groupName: string): boolean
    abstract getModifiedModel(box: any, pipeTexture: PipeTexture): BlockRenderer.BlockModel
    abstract getModelCondition(box: any): ICRenderCondition
    abstract get connectionGroupNames(): {name: string, exclude: boolean}[]
}