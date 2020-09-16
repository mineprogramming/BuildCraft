/// <reference path="../abstract/TransportPipeConnector.ts" />
class QuartzPipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        const old = super.getConnectionRules();
        old.push({name: "BCPipeStone", exclude: true, isANDrule: true});
        old.push({name: "BCPipeCobble", exclude: true, isANDrule: true});
        return old;
    }
}