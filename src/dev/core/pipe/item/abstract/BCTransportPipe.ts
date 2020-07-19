/// <reference path="../../abstract/BCPipe.ts" />
/// <reference path="../../abstract/PipeConnector.ts" />
class BCTransportPipe extends BCPipe {
    protected get pipeConnector(): PipeConnector {
        if(!this.connector) this.connector = new TransportPipeConnector();
        return this.connector;
    }

    protected get renderGroups(): {main: ICRenderGroup, addition?: ICRenderGroup} {
        return {
            main: ICRender.getGroup("BCTransportPipe")
        };
    }

    public get transportType(): string {
        return "item"
    }
}