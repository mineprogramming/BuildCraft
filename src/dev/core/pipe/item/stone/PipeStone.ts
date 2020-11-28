/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="StonePipeConnector.ts" />
class PipeStone extends BCTransportPipe {
    public get material(): string {
        return "stone"
    }

    public get pipeConnector(): PipeConnector {
        if (!this.connector) this.connector = new StonePipeConnector();
        return this.connector;
    }

    public get renderGroups(): RenderGroups {
        return {
            main: ICRender.getGroup("BCTransportPipe"),
            addition: ICRender.getGroup("BCPipeStone")
        };
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if (!this.texture) this.texture = new PipeTexture({ name: textureName, data: 0 }, { name: textureName, data: 1 });
        return this.texture;
    }

    protected getIngredientForRecipe(): ItemInstance {
        return { id: VanillaBlockID.stone, count: 1, data: 0 }
    }
}