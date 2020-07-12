/// <reference path="TransportPipeConnector.ts" />
class CobblePipeConnector extends TransportPipeConnector {
    get connectionGroupNames(): {name: string, exclude: boolean}[] {
        return [
            {name: "BCTransportPipe", exclude: true}
        ]
    };
}