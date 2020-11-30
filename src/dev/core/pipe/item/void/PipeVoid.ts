
/// <reference path="../abstract/BCTransportPipe.ts" />
/// <reference path="../../components/PipeDoubleRecipe.ts" />
/// <reference path="VoidPipeTileEntity.ts" />
class PipeVoid extends BCTransportPipe {
    constructor() {
        super();
        TileEntity.registerPrototype(this.block.id,
            new VoidPipeTileEntity()
        );
    }

    public get material(): string {
        return "void"
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if (!this.texture) this.texture = new PipeTexture({ name: textureName, data: 0 }, { name: textureName, data: 1 });
        return this.texture;
    }

    protected getRecipe(ingredient: ItemInstance): PipeRecipe {
        const ingredients = this.Ingredients;
        return new PipeDoubleRecipe(ingredients[0], ingredients[1]);
    }

    protected get Ingredients(): ItemInstance[] {
        return [
            { id: VanillaItemID.redstone, count: 1, data: 0 },
            { id: VanillaItemID.dye, count: 1, data: 0 }
        ]
    }

    protected getIngredientForRecipe(): ItemInstance {
        return null
    }
}
const voidPipe = new PipeVoid();