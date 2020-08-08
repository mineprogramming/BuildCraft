class WoodenPipeItemEjector {
    private side: number | null;
    private container: { source, slots } | null;
    constructor(public readonly x: number, public readonly y: number, public readonly z: number) { }

    public getExtractionTargetsCount(maxItems: number): number {
        if (!this.container) return -1;

        let id = 0;
        let count = 0;

        for (const i of this.container.slots) {
            const slot = this.container.source.getSlot(i);

            if (slot.id == 0) continue;

            if (id == 0 && slot.id != 0) {
                id = slot.id;
            }

            if (id == slot.id && count < maxItems) {
                count = Math.min(count + slot.count, maxItems);
            }

            if (count == maxItems) break;
        }

        return count;
    }

    public extractItems(count: number): void {
        const pipeTile = World.getTileEntity(this.x, this.y, this.z);
        const side = World.getInverseBlockSide(this.side);
        StorageInterface.extractItemsFromContainer(pipeTile, this.container.source, side, count, true);
    }

    public set connectionSide(value: number | null) {
        this.side = value;
        const coords = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
        const sourceContainer = World.getContainer(coords.x, coords.y, coords.z);
        const containerSide = World.getInverseBlockSide(value);
        this.container = {
            source: sourceContainer,
            slots: StorageInterface.getContainerSlots(sourceContainer, 1, containerSide)
        }
    }

    public get connectionSide(): number | null {
        return this.side;
    }
}