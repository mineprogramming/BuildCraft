/// <reference path="../abstract/BCEngine.ts" />
/// <reference path="CreativeEngineRecipe.ts" />
/// <reference path="../components/recipe/EngineIngredients.ts" />
/// <reference path="CreativeEngineTileEntity.ts" />
/// <reference path="../EngineTextures.ts" />
class CreativeEngine extends BCEngine {

    public get engineType(): string {
        return "creative"
    }

    protected get texture(): EngineTexture {
        return EngineTextures.creative;
    }

    protected getRecipe(ingredients: EngineIngredients): EngineRecipe {
        return CreativeEngineRecipe.Recipe;
    }

    protected requireTileEntity() {
        return new BCCreativeEngineTileEntity(EngineTextures.creative);
    }

    protected getIngredientsForRecipe(): EngineIngredients {
        return null;
    }
}
const creativeEngine = new CreativeEngine();