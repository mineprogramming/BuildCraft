/// <reference path="../ModelTexture.ts" />
class EngineRender {
    private readonly render;

    constructor(protected readonly texture: ModelTexture){
        this.render = new Render({skin: "model/" + this.texture.getTexture()});
        this.render.setPart("head", this.getModelData(), this.texture.getSize());
    }

    getID(): number {
        return this.render.getId();
    }

    public rebuild(){
        this.render.rebuild();
    }

    protected getModelData(): object{
        return []
    }
}