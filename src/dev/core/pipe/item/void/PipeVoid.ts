
/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="VoidPipeTileEntity.ts" />
class PipeVoid extends BCTransportPipe {
    constructor() {
        super();
        TileEntity.registerPrototype(this.block.id,
            new VoidPipeTileEntity()
        );
    }

    public get material(): string {
        return "void"
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 1});
        return this.texture;
    }
}