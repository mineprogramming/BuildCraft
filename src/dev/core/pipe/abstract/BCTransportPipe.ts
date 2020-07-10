/// <reference path="BCPipe.ts" />
class BCTransportPipe extends BCPipe {
    protected get pipeConnector(): IPipeConnector {
        if(!this.connector) this.connector = new TransportPipeConnector();
        return this.connector;
    }

    protected get renderGroup(): string {
        return "BCTransportPipe";
    }

    public get transportType(): string {
        return "item"
    }
}