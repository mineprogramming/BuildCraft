declare var BLOCK_TYPE_LIQUID: any;
declare var LiquidLib: {
    liquids: {};
    registerLiquid: (liquidId: any, texture: any, fluidity: any) => void;
};
declare function buildFlowMesh(texture: any, direction: any, from: any, to: any): any;
declare function getRotationMatrix(direction: any): number[][];
declare var SIDES: number[][];
declare var LiquidUpdater: {
    blocks: any[];
    updates: any[];
    update: (x: any, y: any, z: any) => void;
    tick: () => void;
};
