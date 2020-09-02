type ConnectionRule = {
    name: string;
    exclude: boolean;
    isANDrule: boolean;
};
abstract class PipeConnector {
    abstract canPipesConnect(coords0: Vector, coords1: Vector): boolean;
    abstract canConnectToGroup(groupName: string): boolean;
    abstract getConnectionRules(): ConnectionRule[];

    public canConnectToPipe(targetConnector: PipeConnector): boolean {
        const rules = targetConnector.getConnectionRules();
        return true;
    }
}