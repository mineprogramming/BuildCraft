class PipeRecipe {
	constructor(private readonly ingredient: ItemInstance) { }

	public registerFor(item: ItemInstance): void {
		Recipes.addShaped(item, this.Pattern, this.PatternData);
	}

	protected get Pattern(): string[] {
		return [
			"aba"
		];
	}

	protected get PatternData(): (string | number)[] {
		return [
			"b", VanillaBlockID.glass, -1,
			"a", this.ingredient.id, this.ingredient.data
		];
	}
}