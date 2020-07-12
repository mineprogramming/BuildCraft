/// <reference path="BCPipe.ts" />
class BCTransportPipe extends BCPipe {
    protected get pipeConnector(): PipeConnector {
        if(!this.connector) this.connector = new TransportPipeConnector();
        return this.connector;
    }

    protected get renderGroup(): ICRenderGroup {
        return ICRender.getGroup("BCTransportPipe");
    }

    public get transportType(): string {
        return "item"
    }
}