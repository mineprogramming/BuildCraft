/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />

class WoodEngine extends BCEngine {
    public get engineType(): string {
        alert("WOODEN");
        return "wooden"
    }

    protected requireTileEntity(){
        return new BCWoodEngineTileEntity(this.maxHeat, new EngineTexture(STANDART_TEXTURE, {x: 256, y: 0}, STANDART_SIZE));
    }
}