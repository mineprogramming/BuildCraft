/// <reference path="abstract/TransportPipeConnector.ts" />
class StonePipeConnector extends TransportPipeConnector {
    get connectionGroupNames(): {name: string, exclude: boolean}[] {
        return [
            {name: "BCPipeCobble", exclude: true}
        ]
    };
}