/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="../components/recipe/EngineRecipe.ts" />
/// <reference path="../components/recipe/EngineIngredients.ts" />
/// <reference path="WoodEngineTileEntity.ts" />
/// <reference path="../EngineTextures.ts" />
/// <reference path="../../../item/gears.ts" />

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

    protected getIngredientsForRecipe(): EngineIngredients {
        return new EngineIngredients({ id: ItemID.gear_wood, count: 1, data: 0 }, { id: VanillaBlockID.planks, count: 1, data: -1 });
    }
}
const woodenEngine = new WoodEngine();