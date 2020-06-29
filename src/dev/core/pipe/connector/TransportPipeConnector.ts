/// <reference path="IPipeConnector.ts" />
class TransportPipeConnector implements IPipeConnector {
    public canPipesConnect(coords0: Vector, coords1: Vector){
        return false;
    }

    public get data(): object {
        return {};
    }
}