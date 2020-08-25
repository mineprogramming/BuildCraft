/// <reference path="../travelingItem/TravelingItem.ts" />
class WoodenPipeItemEjector {
    private side: number | null;
    private container: { source; slots } | null;
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly z: number
    ) {}

    public set connectionSide(value: number | null) {
        this.side = value;
        const coords = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
        const sourceContainer = World.getContainer(coords.x, coords.y, coords.z);
        const containerSide = World.getInverseBlockSide(value);
        this.container = {
            source: sourceContainer,
            slots: StorageInterface.getContainerSlots(sourceContainer, 1, containerSide),
        };
    }

    public get connectionSide(): number | null {
        return this.side;
    }

    public getExtractionTargetsCount(maxItems: number): number {
        if (!this.container) return -1;

        let id = 0;
        let data = null;
        let count = 0;

        for (const i of this.container.slots) {
            const slot = this.container.source.getSlot(i);

            if (slot.id == 0) continue;

            if (id == 0 && slot.id != 0) {
                id = slot.id;
                data = slot.data;
            }

            if (id == slot.id && data == slot.data && count < maxItems) {
                count = Math.min(count + slot.count, maxItems);
            }

            if (count == maxItems) break;
        }

        return count;
    }

    public extractItems(count: number): void {
        const item = this.getExtractionPack(this.container, count);
        const containerCoords = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
        const itemCoords = {
            x: containerCoords.x + .5,
            y: containerCoords.y + .5,
            z: containerCoords.z + .5
        };
        const travelingItem = new TravelingItem(itemCoords, item);
        // *DEBUG value is 1/40
        travelingItem.moveSpeed = 1/40;
        travelingItem.moveVectorIndex = World.getInverseBlockSide(this.connectionSide);
    }

    private getItemMoveVector(containerCoords: Vector): Vector {
        const vector = {
            x: this.x - containerCoords.x,
            y: this.y - containerCoords.y,
            z: this.z - containerCoords.z
        }
        return vector
    }

    public getExtractionPack(containerData: { source; slots }, count: number) {
        let itemID = 0;
        let itemData = null;
        let gettedCount = 0;

        for (const i of containerData.slots) {
            const slot = containerData.source.getSlot(i);
            if (slot.id == 0) continue;

            if (itemID == 0 && slot.id != 0) {
                itemID = slot.id;
                itemData = slot.data;
            }

            if (itemID == slot.id && gettedCount < count) {
                const add = Math.min(slot.count, count - gettedCount);
                containerData.source.setSlot(i, slot.id, slot.count - add, slot.data);
                gettedCount += add;
            }

            if (gettedCount == count) break;
        }

        return {
            id: itemID,
            count: gettedCount,
            data: itemData
        }
    }
}