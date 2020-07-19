/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="WoodenPipeConnector.ts" />
class PipeWooden extends BCTransportPipe {
    public get material(): string {
        return "wood"
    }

    protected get pipeConnector(): PipeConnector {
        if(!this.connector) this.connector = new WoodenPipeConnector();
        return this.connector;
    }

    protected get renderGroups(): {main: ICRenderGroup, addition?: ICRenderGroup} {
        return {
            main: ICRender.getGroup("BCTransportPipe"),
            addition: ICRender.getGroup("BCPipeWooden")
        };
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 1});
        return this.texture;
    }
}