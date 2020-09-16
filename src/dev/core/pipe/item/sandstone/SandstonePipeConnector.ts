/// <reference path="../abstract/TransportPipeConnector.ts" />
/// <reference path="../ItemMachines.ts" />
class SandstonePipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        return [];
    }

    protected getBlacklistConnectedBlock(): Tile[] {
        return ITEM_MACHINES;
    }
}