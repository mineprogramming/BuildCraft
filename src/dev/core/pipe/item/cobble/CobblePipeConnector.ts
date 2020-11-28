/// <reference path="../abstract/TransportPipeConnector.ts" />
class CobblePipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        const old = super.getConnectionRules();
        old.push({name: "BCPipeStone", exclude: true, isANDrule: true});
        old.push({name: "BCPipeQuartz", exclude: true, isANDrule: true});
        return old;
    }
}