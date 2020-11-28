/// <reference path="EngineIngredients.ts" />
class EngineRecipe {
	public readonly gear: ItemInstance;
	public readonly ingot: ItemInstance;

	constructor(ingredients: EngineIngredients) {
		this.gear = ingredients.gear;
		this.ingot = ingredients.ingot;
	}

	public registerFor(item: ItemInstance): void {
		Recipes.addShaped(item, this.Pattern, this.PatternData);
	}

	private get Pattern(): string[] {
		return [
			"aaa",
			" b ",
			"oxo"
		];
	}

	private get PatternData(): (string | number)[] {
		return [
			"x", VanillaBlockID.piston, -1,
			"a", this.ingot.id, this.ingot.data,
			"b", VanillaBlockID.glass, -1,
			"o", this.gear.id, this.gear.data
		];
	}
}