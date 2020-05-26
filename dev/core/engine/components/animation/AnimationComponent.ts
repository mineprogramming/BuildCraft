/// <reference path="../../model/render/EngineRender.ts" />
class AnimationComponent {
    protected readonly animation;
    public readonly coords: Vector;

    constructor(pos: Vector, public render: EngineRender){
        this.coords = {x: pos.x + .5, y: pos.y + 15 / 16, z: pos.z + .5};
        this.animation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.animation.describe({render: this.render.getID()});
        this.animation.load();
    }

    public updateRender(render: EngineRender): void {
        this.render.stash();
        this.render = render;
        this.animation.describe({render: this.render.getID()});
        this.animation.refresh();
    }

    public destroy(): void{
        this.render.stash();
        this.animation.destroy();
    }
}