/// <reference path="../ModelTexture.ts" />
/// <reference path="RenderManager.ts" />
abstract class EngineRender {
    private readonly render;
    protected readonly texture: ModelTexture;

    constructor(protected readonly type: string){
        this.texture = new ModelTexture(this.getTextureOffset());
        this.render = new Render({skin: "model/" + this.texture.getTexture()});
        this.render.setPart("head", this.getModelData(), this.texture.getSize());
    }

    getGroupName(){
        return EngineRender.getGroupPrefix() + this.type;
    }

    protected getTextureOffset(): object {
        return TexturesOffset.engine.base[this.type];
    }

    protected static getGroupPrefix(){
        return "EngineRender"
    }

    stash(){
        // RenderManager.addToGroup(this.getGroupName(), this);
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