/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="CobblePipeConnector.ts" />
class PipeCobble extends BCTransportPipe {
    public get material(): string {
        return "cobble"
    }

    public get pipeConnector(): PipeConnector {
        if(!this.connector) this.connector = new CobblePipeConnector();
        return this.connector;
    }

    protected get renderGroups(): {main: ICRenderGroup, addition?: ICRenderGroup} {
        return {
            main: ICRender.getGroup("BCTransportPipe"),
            addition: ICRender.getGroup("BCPipeCobble")
        };
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 1});
        return this.texture;
    }
}