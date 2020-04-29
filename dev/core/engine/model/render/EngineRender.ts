/// <reference path="../texture/EngineTexture.ts" />
/// <reference path="RenderManager.ts" />
abstract class EngineRender {
    protected readonly render: Render;
    protected boxes = [];

    constructor(protected engineTexture: EngineTexture){
        this.render = RenderManager.getRender() || new Render({skin: this.engineTexture.name});
    }

    public refresh(): void {
        alert("refresh");
        this.render.setPart("head", this.getModelData(), this.engineTexture.size);
    }

    public stash(): void {
        RenderManager.store(this.render);
    }

    public getID(): number {
        return this.render.getId();
    }

    protected getModelData(): PartObject[] {
        return this.boxes;
    }
}