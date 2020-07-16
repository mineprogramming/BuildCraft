/// <reference path="abstract/TransportPipeConnector.ts" />
class CobblePipeConnector extends TransportPipeConnector {
    get connectionGroupNames(): {name: string, exclude: boolean}[] {
        return [
            {name: "BCPipeStone", exclude: true}
        ]
    };
}