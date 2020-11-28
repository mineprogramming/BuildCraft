/// <reference path="../components/recipe/EngineRecipe.ts" />
/// <reference path="../components/recipe/EngineIngredients.ts" />
class CreativeEngineRecipe extends EngineRecipe {
	private static staticRecipe: CreativeEngineRecipe = null;
	private static ingredients: EngineIngredients = new EngineIngredients({ id: 0, count: 0, data: 0 }, { id: 0, count: 0, data: 0 });

	public static get Recipe(): CreativeEngineRecipe {
		if (!this.staticRecipe) {
			this.staticRecipe = new CreativeEngineRecipe(this.ingredients);
		}
		return this.staticRecipe;
	}

	public registerFor(item: ItemInstance): void { }
}