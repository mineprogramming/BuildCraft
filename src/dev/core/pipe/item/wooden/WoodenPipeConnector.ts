/// <reference path="../abstract/TransportPipeConnector.ts" />
class WoodenPipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        const old = super.getConnectionRules();
        old.push({name: "BCPipeWooden", exclude: true, isANDrule: true});
        return old;
    }
}