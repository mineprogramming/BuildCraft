class EngineRender {
    private readonly render;

    constructor(protected readonly texture: ModelTexture){
        this.render = new Render({skin: "model/" + this.texture.getTexture()});
        this.render.setPart("body", this.getModelData(), this.texture.getSize());
    }

    getID(): number {
        return this.render.getId();
    }

    protected getModelData(): object{
        return []
    }
}