/// <reference path="DiamondPipeGUI.ts" />
class DiamondPipeTileEntity {
    constructor(protected renderer: PipeRenderer, protected texture: PipeTexture) { }
    private container: any;

    // !TileEntity event
    public getGuiScreen(): UI.StandartWindow {
        return diamondPipeUI;
    }

    public canItemGoToSide(item: ItemInstance, index: number): boolean {
        let hasFilter = false;
        for (let i = 0; i < 9; i++) {
            const slot = this.container.getSlot("slot_" + index + "_" + i);
            if (slot.id == 0) continue;
            if (!hasFilter) hasFilter = true;
            if (slot.id == item.id && slot.data == item.data) return true;
        }
        return !hasFilter;
    }
}