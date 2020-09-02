type ConnectionRule = {
    name: string;
    exclude: boolean;
    isANDrule: boolean;
};
abstract class PipeConnector {
    abstract canPipesConnect(coords0: Vector, coords1: Vector): boolean;
    abstract canConnectToGroup(groupName: string): boolean;
    abstract getConnectionRules(): ConnectionRule[];

    public canConnectToPipe(target: BCPipe): boolean {
        const targetGroups = target.renderGroups;
        for (const rule of this.getConnectionRules()) {
            if (rule.name == targetGroups.main.name) {
                if (rule.exclude) return false;
            }
            const secondary = targetGroups.addition;
            if (secondary && rule.name == secondary.name) {
                if (rule.exclude) return false;
            }
        }
        return true;
    }
}