/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="QuartzPipeConnector.ts" />
class PipeQuartz extends BCTransportPipe {
    constructor () {
        super();
        this.pipeSpeed = new PipeSpeed(0.01, 0.002);
    }

    public get material(): string {
        return "quartz"
    }

    public get pipeConnector(): PipeConnector {
        if(!this.connector) this.connector = new QuartzPipeConnector();
        return this.connector;
    }

    public get renderGroups(): {main: ICRenderGroup, addition?: ICRenderGroup} {
        return {
            main: ICRender.getGroup("BCTransportPipe"),
            addition: ICRender.getGroup("BCPipeQuartz")
        };
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if(!this.texture) this.texture = new PipeTexture({name: textureName, data: 0}, {name: textureName, data: 1});
        return this.texture;
    }
}