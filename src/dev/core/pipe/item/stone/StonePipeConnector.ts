/// <reference path="../abstract/TransportPipeConnector.ts" />
class StonePipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        const old = super.getConnectionRules();
        old.push({name: "BCPipeCobble", exclude: true, isANDrule: true});
        old.push({name: "BCPipeQuartz", exclude: true, isANDrule: true});
        return old;
    }
}