/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../EngineTextures.ts" />

class WoodEngine extends BCEngine {
    public get engineType(): string {
        return "wooden"
    }

    protected requireTileEntity(){
        return new BCWoodEngineTileEntity(EngineTextures.wood);
    }
}