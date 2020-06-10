/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="CreativeEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
class CreativeEngine extends BCEngine {
    public get engineType(): string {
        return "creative"
    }

    protected requireTileEntity(){
        return new BCCreativeEngineTileEntity(new EngineTexture(STANDART_TEXTURE, {x: 256, y: 96}, STANDART_SIZE));
    }
}