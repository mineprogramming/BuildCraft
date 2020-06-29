/// <reference path="BCPipe.ts" />
class BCTransportPipe extends BCPipe {
    protected get pipeConnector(): IPipeConnector {
        if(!this.connector) this.connector = new TransportPipeConnector();
        return this.connector;
    }
    public get transportType(): string {
        return "item"
    }
}