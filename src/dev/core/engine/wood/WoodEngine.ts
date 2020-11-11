/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../EngineTextures.ts" />

class WoodEngine extends BCEngine {
    public get engineType(): string {
        return "wooden"
    }

    protected get texture(): EngineTexture {
        return EngineTextures.wood;
    }

    protected requireTileEntity() {
        return new BCWoodEngineTileEntity(this.texture);
    }
}