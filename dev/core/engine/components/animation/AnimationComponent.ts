/// <reference path="../../model/render/EngineRender.ts" />
/// <reference path="../../../Coords.ts" />
class AnimationComponent {
    protected readonly animation;
    public readonly coords: IBlockPos;

    constructor(pos: IBlockPos, public render: EngineRender){
        this.coords = {x: pos.x + .5, y: pos.y + 15 / 16, z: pos.z + .5};
        this.animation = new Animation.Base(this.coords.x, this.coords.y, this.coords.z);
        this.animation.describe({render: this.render.getID()});
        this.animation.load();
    }

    debug(){
        // alert("particle");
        Particles.addFarParticle(Native.ParticleType.flame, this.coords.x, this.coords.y, this.coords.z, 0,.05,0);
    }

    updateRender(render: EngineRender): void {
        this.render.stash();
        this.render = render;
        this.animation.describe({render: this.render.getID()});
        this.animation.refresh();
    }

    rotate(rotation: IBlockPos): void {
        if(!this.animation.render) return;
        this.animation.render.transform.clear();
        this.animation.render.transform.translate(0, 1.62, 0);
        this.animation.render.transform.rotate(rotation.x, rotation.y, rotation.z);
        this.animation.render.transform.translate(0, -1.62, 0);
        this.render.rebuild();
    }

    destroy(): void{
        this.render.stash();
        this.animation.destroy();
    }
}