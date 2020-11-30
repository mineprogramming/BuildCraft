/// <reference path="./core-engine.d.ts" />

declare namespace StorageInterface {
    const directionsBySide: Vector[];
    function getRelativeCoords(coords: Vector, side: number): Vector;
    function setSlotMaxStackPolicy(container: ItemContainer, slotName: string, maxCount: number): void;
    function setSlotValidatePolicy(container: ItemContainer, slotName: string, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    function setGlobalValidatePolicy(container: ItemContainer, func: (name: string, id: number, amount: number, data: number, extra: ItemExtraData, container: ItemContainer, playerUid: number) => boolean): void;
    function createInterface(id: number, interface: any): void;
    function addItemToSlot(item: ItemInstance, slot: ItemInstance, count: number): number;
    function getNearestContainers(coords: Vector, side: number, excludeSide?: boolean, region?: BlockSource): {};
    function getNearestLiquidStorages(coords: Vector, side: number, excludeSide?: boolean, region?: BlockSource): {};
    function putItems(items: ItemInstance[], containers: any): void;
    function putItemToContainer(item: ItemInstance, container: NativeTileEntity | UI.Container | ItemContainer, side: number, maxCount?: number): number;
    function extractItemsFromContainer(inputTile: TileEntity, container: NativeTileEntity | UI.Container | ItemContainer, side: number, maxCount?: number, oneStack?: boolean): number;
    function extractLiquid(liquid: string, maxAmount: number, input: TileEntity, output: TileEntity, inputSide: number): void;
    function transportLiquid(liquid: string, maxAmount: number, output: TileEntity, input: TileEntity, outputSide: number): void;
    function getContainerSlots(container: NativeTileEntity | UI.Container | ItemContainer, mode?: number, side?: number): (string | number)[];
    function checkHoppers(tile: TileEntity): void;
    function extractItems(items: ItemInstance[], containers: any, tile: TileEntity): void;
}
