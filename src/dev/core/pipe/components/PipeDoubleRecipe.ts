class PipeDoubleRecipe extends PipeRecipe {
	constructor(private readonly ingredient0: ItemInstance, private readonly ingredient1: ItemInstance) {
		super(ingredient0);
	}

	protected get Pattern(): string[] {
		return [
			"abc"
		];
	}

	protected get PatternData(): (string | number)[] {
		return [
			"b", VanillaBlockID.glass, -1,
			"a", this.ingredient0.id, this.ingredient0.data,
			"c", this.ingredient1.id, this.ingredient1.data,
		];
	}
}