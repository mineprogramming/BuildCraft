/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />

class WoodEngine extends BCEngine {
    public get engineType(): string {
        alert("WOODEN");
        return "wooden"
    }

    protected requireTileEntity(){
        return new BCWoodEngineTileEntity(this.maxHeat, new EngineTexture(STANDART_TEXTURE, {x: 256, y: 96}, STANDART_SIZE));
    }
    /*protected registerTileEntity(){
        const baseOffset = {x: 256, y: 96};
        this.tileEntity = new BCCreativeEngineTileEntity(this.maxHeat, new EngineTexture(STANDART_TEXTURE, baseOffset, STANDART_SIZE));
    }*/
}