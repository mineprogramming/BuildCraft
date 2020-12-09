/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="SandstonePipeConnector.ts" />
class PipeSandstone extends BCTransportPipe {
    public get material(): string {
        return "sandstone"
    }

    public get pipeConnector(): PipeConnector {
        if (!this.connector) this.connector = new SandstonePipeConnector();
        return this.connector;
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if (!this.texture) this.texture = new PipeTexture({ name: textureName, data: 0 }, { name: textureName, data: 1 });
        return this.texture;
    }

    protected getIngredientForRecipe(): ItemInstance {
        return { id: VanillaBlockID.sandstone, count: 1, data: 0 }
    }
}
const sandstonePipe = new PipeSandstone();