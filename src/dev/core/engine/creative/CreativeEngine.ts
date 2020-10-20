/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="CreativeEngineTileEntity.ts" />
/// <reference path="../EngineTextures.ts" />
class CreativeEngine extends BCEngine {
    public get engineType(): string {
        return "creative"
    }

    protected requireTileEntity(){
        return new BCCreativeEngineTileEntity(EngineTextures.creative);
    }
}