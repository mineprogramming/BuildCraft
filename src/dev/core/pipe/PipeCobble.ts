/// <reference path="abstract/BCTransportPipe.ts" />
/// <reference path="connector/TransportPipeConnector.ts" />
class PipeCobble extends BCTransportPipe {
    public get material(): string {
        return "cobble"
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 0});
        return this.texture;
    }
}