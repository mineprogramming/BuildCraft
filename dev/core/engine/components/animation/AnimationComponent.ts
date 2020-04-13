/// <reference path="../../model/render/EngineRender.ts" />
/// <reference path="../../../Coords.ts" />
class AnimationComponent {
    protected readonly animation;
    public readonly coords: IBlockPos;

    constructor(pos: IBlockPos, private readonly render: EngineRender){
        this.coords = {x: pos.x + .5, y: pos.y +.5, z: pos.z + .5};
        this.animation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.animation.describe({render: this.render.getID()});
        this.animation.load();
    }

    rotate(rotation: IBlockPos): void{
        this.animation.render.transform.rotate(rotation.x, rotation.y, rotation.z);
        this.render.rebuild();
    }

    destroy(): void{
        this.render.stash();
        this.animation.destroy();
    }
}