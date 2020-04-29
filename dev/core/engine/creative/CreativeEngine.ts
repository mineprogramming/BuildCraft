/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="CreativeEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
class CreativeEngine extends BCEngine {
    public get engineType(): string {
        return "creative"
    }
    protected registerTileEntity(){
        const baseOffset = {x: 256, y: 96};
        this.tileEntity = new BCCreativeEngineTileEntity(this.maxHeat, new EngineTexture(STANDART_TEXTURE, baseOffset, STANDART_SIZE));
    }
}