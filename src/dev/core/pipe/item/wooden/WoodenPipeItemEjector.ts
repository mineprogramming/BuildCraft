/// <reference path="../travelingItem/TravelingItem.ts" />
class WoodenPipeItemEjector {
    private side: number | null;
    private containerData: { source: Storage; slots } | null;
    constructor(
        public readonly region: BlockSource,
        public readonly x: number,
        public readonly y: number,
        public readonly z: number
    ) { }

    public set connectionSide(value: number) {
        this.side = value;
        if (value > 0) {
            const coords = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
            // update to BlockSource
            const storage = StorageInterface.getStorage(this.region, coords.x, coords.y, coords.z);
            this.containerData = {
                source: storage,
                slots: storage.getOutputSlots(),
            };
        } else {
            this.containerData = null;
        }
    }

    public get connectionSide(): number | null {
        return this.side;
    }

    public getExtractionTargetsCount(maxItems: number): number {
        if (!this.containerData) return -1;

        let id = 0;
        let data = null;
        let count = 0;

        for (const i of this.containerData.slots) {
            const slot = this.containerData.source.getSlot(i);

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
        const item = this.getExtractionPack(this.containerData, count);
        const containerCoords = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
        const vectorIndex = World.getInverseBlockSide(this.connectionSide);
        const offsetVector = World.getRelativeCoords(0, 0, 0, vectorIndex);

        // ? should I add offsetDistance to config?
        const offsetDistance = +__config__.getNumber("travelingItem_offset_distance");
        /*
            If you want to create items not on source block center
            change "travelingItem_offset_distance" in config
        */

        const itemCoords = {
            x: containerCoords.x + 0.5 + offsetDistance * offsetVector.x,
            y: containerCoords.y + 0.5 + offsetDistance * offsetVector.y,
            z: containerCoords.z + 0.5 + offsetDistance * offsetVector.z,
        };
        const travelingItem = new TravelingItem(itemCoords, this.region.getDimension(), item, vectorIndex);
    }

    public getExtractionPack(containerData: { source; slots }, count: number): ItemInstance {
        const gettedItem = {
            id: 0,
            count: 0,
            data: 0,
            extra: null,
        };

        const { source, slots } = containerData;

        for (const i of slots) {
            const slot = source.getSlot(i);
            if (slot.id == 0) continue;

            if (gettedItem.extra != null) break;

            const needToAdd = count - gettedItem.count;
            if (needToAdd > 0) {
                // * MineExplorer thanks for StorageInterface
                StorageInterface.addItemToSlot(slot, gettedItem, needToAdd);
                source.setSlot(i, slot.id, slot.count, slot.data, slot.extra);
            } else break;
        }
        return gettedItem;
    }
}