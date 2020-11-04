/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="WoodenPipeConnector.ts" />
/// <reference path="WoodenPipeTileEntity.ts" />

type RenderGroups = {
    main: ICRenderGroup;
    addition?: ICRenderGroup;
};

class PipeWooden extends BCTransportPipe {
    constructor() {
        super();
        TileEntity.registerPrototype(this.block.id,
            new WoodenPipeTileEntity(this.pipeRenderer, this.texture)
        );
        EnergyTileRegistry.addEnergyTypeForId(this.block.id, RF);
        Block.registerNeighbourChangeFunctionForID(this.block.id, (coords, block, changeCoords, region: BlockSource) => {
                const tile = World.getTileEntity(coords.x, coords.y, coords.z, region);
                if (tile && TileEntity.isTileEntityLoaded(tile)) {
                    tile.checkConnection();
                }
            }
        );
    }

    public get material(): string {
        return "wood";
    }

    public get pipeConnector(): PipeConnector {
        if (!this.connector) this.connector = new WoodenPipeConnector();
        return this.connector;
    }

    public get renderGroups(): RenderGroups {
        return {
            main: ICRender.getGroup("BCTransportPipe"),
            addition: ICRender.getGroup("BCPipeWooden"),
        };
    }

    protected get pipeTexture(): PipeTexture {
        const textre = `pipe_${this.transportType}_${this.material}`;
        if (!this.texture) {
            this.texture = new PipeTexture(
                { name: textre, data: 0 },
                { name: textre, data: 1 },
                { name: textre, data: 2 }
            );
        }
        return this.texture;
    }
}