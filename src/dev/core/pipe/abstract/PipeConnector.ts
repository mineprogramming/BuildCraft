type ConnectionRule = {
    name: string;
    exclude: boolean;
    isANDrule: boolean;
};
abstract class PipeConnector {
    abstract canPipesConnect(coords0: Vector, coords1: Vector): boolean;
    abstract canConnectToGroup(groupName: string): boolean;
    abstract getConnectionRules(): ConnectionRule[];

    /**
     * For vanila block ID
     */
    protected getBlacklistConnectedBlock(): Tile[] {
        return []
    }

    public hasBlacklistBlockID(block: Tile): boolean {
        for (const bl of this.getBlacklistConnectedBlock()) {
            if (block.id == bl.id && (bl.data < 0 || bl.data == block.data)) return true;
        }
        return false;
    }

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