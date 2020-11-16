/// <reference path="../components/EngineBlock.ts" />
/// <reference path="../components/model/EngineItemModel.ts" />
/// <reference path="../components/recipe/EngineRecipe.ts" />
/// <reference path="../components/recipe/EngineIngredients.ts" />
/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/texture/EngineTexture.ts" />
/// <reference path="BCEngineTileEntity.ts" />
abstract class BCEngine {
    protected block: EngineBlock;

    protected engineItemModel: EngineItemModel;

    protected recipe: EngineRecipe;

    public get engineType(): string {
        return null
    }

    protected abstract requireTileEntity(): object

    constructor() {
        this.block = new EngineBlock(this.engineType);
        this.engineItemModel = new EngineItemModel(this.texture);
        this.recipe = this.getRecipe(this.getIngredientsForRecipe());
        this.recipe.registerFor({ id: this.block.id, count: 1, data: 0 });
        Block.setupAsRedstoneReceiver(this.block.stringId, true)
        TileEntity.registerPrototype(this.block.id, this.requireTileEntity());
        this.registerHandModel();
        this.registerDrop();
        this.registerNeighbourChangeFunction();
    }

    protected get texture(): EngineTexture {
        return null;
    }

    /**
     * it a method because we need this in constructor
     */
    protected getRecipe(ingredients: EngineIngredients): EngineRecipe {
        return new EngineRecipe(ingredients);
    }

    /**
     * it a method because we need this in constructor
     */
    protected abstract getIngredientsForRecipe(): EngineIngredients

    private registerHandModel(): void {
        ItemModel.getFor(this.block.id, 1).setModel(this.engineItemModel.Model);
    }

    private registerNeighbourChangeFunction(): void {
        Block.registerNeighbourChangeFunctionForID(this.block.id, (coords, block, changeCoords, region: BlockSource) => {
            const tile = World.getTileEntity(coords.x, coords.y, coords.z, region);
            if (tile) tile.checkOrientation = true;
        });
    }

    private registerDrop(): void {
        Block.registerDropFunction(this.block.stringId, () => {
            return [[this.block.id, 1, 1]]
        });
    }
}