/// <reference path="../abstract/BCTransportPipe.ts" />
class PipeGold extends BCTransportPipe {
    constructor() {
        super();
        this.pipeSpeed = new PipeSpeed(0.25, 0.07);
    }

    public get material(): string {
        return "gold"
    }

    protected get pipeTexture(): PipeTexture {
        const textureName = `pipe_${this.transportType}_${this.material}`
        if (!this.texture) this.texture = new PipeTexture({ name: textureName, data: 0 }, { name: textureName, data: 1 });
        return this.texture;
    }

    protected getIngredientForRecipe(): ItemInstance {
        return { id: VanillaItemID.gold_ingot, count: 1, data: 0 }
    }
}