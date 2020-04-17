/// <reference path="../ModelTexture.ts" />
/// <reference path="RenderManager.ts" />
abstract class EngineRender {
    private readonly render;
    protected readonly texture: ModelTexture;

    constructor(protected readonly type: string){
        this.texture = new ModelTexture(this.getTextureOffset());
        this.render = RenderManager.getRender(this.getGroupName()) || this.createNewRender();
    }

    private createNewRender(): Render{
        const render = new Render({skin: "model/" + this.texture.getTexture()});
        render.setPart("head", this.getModelData(), this.texture.getSize());
        return render
    }

    protected getGroupPrefix(): string {
        return "EngineRender"
    }

    protected getGroupName(): string{
        return this.getGroupPrefix() + this.type;
    }

    protected getTextureOffset(): object {
        return TexturesOffset.engine.base[this.type];
    }

    stash(): void {
        RenderManager.addToGroup(this.getGroupName(), this.render);
    }

    getID(): number {
        return this.render.getId();
    }

    public rebuild(): void {
        this.render.rebuild();
    }

    protected getModelData(): PartObject[] {
        return []
    }
}