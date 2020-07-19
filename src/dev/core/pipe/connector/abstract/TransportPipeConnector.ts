/// <reference path="PipeConnector.ts" />
class TransportPipeConnector extends PipeConnector {
    public canConnectToGroup(groupName: string): boolean {
        return groupName == "ItemMachine"
    }

    public canPipesConnect(coords0: Vector, coords1: Vector){
        return false;
    }

    public getConnectionRules(): ConnectionRule[] {
        return [
            {name: "ItemMachine", exclude: false, isANDrule: false}
        ]
    }
}