/// <reference path="../abstract/TransportPipeConnector.ts" />
class ObsidianPipeConnector extends TransportPipeConnector {
    public getConnectionRules(): ConnectionRule[] {
        const old = super.getConnectionRules();
        old.push({name: "BCPipeObsidian", exclude: true, isANDrule: true});
        return old;
    }
}