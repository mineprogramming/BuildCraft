/// <reference path="abstract/BCTransportPipe.ts" />
class PipeGold extends BCTransportPipe {
    public get material(): string {
        return "gold"
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 1});
        return this.texture;
    }
}