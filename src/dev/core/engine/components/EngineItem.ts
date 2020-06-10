class EngineItem {
    public readonly id: number;
    public readonly stringId: string;

    constructor(private readonly registryId: string, public readonly engineBlock: EngineBlock){
        this.stringId = "engine" + this.registryId;
        this.registerItem();
        this.id = ItemID[this.stringId];
    }
    private registerItem(): void {
        IDRegistry.genItemID(this.stringId);
        Item.createItem(this.stringId, this.getName(), {name: "engine_" + this.registryId});
    }
    public getName(): string {
        return this.registryId + " Engine"
    };
}