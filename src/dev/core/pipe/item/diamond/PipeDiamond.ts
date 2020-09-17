/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="DiamondPipeTileEntity.ts" />
/// <reference path="DiamondPipeRenderer.ts" />

class PipeDiamond extends BCTransportPipe {
    constructor() {
        super();
        this.renderer = new DiamondPipeRenderer(this.pipeConnector, this.pipeTexture, this.renderGroups.main);
        this.renderer.enableRender(this.block.id, 0);
        TileEntity.registerPrototype(this.block.id,
            new DiamondPipeTileEntity(this.pipeRenderer, this.texture)
        );

        StorageInterface.createInterface(this.block.id, {
            isValidInput: (item) => false
        });
    }

    public get material(): string {
        return "diamond";
    }

    protected get pipeTexture(): PipeTexture {
        const textre = `pipe_${this.transportType}_${this.material}`;
        if (!this.texture) {
            this.texture = new PipeTexture(
                { name: textre, data: 0 },
                { name: textre, data: 1 }
            );
        }
        return this.texture;
    }
}