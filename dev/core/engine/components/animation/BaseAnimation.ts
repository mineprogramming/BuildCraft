/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
/// <reference path="../../EngineHeat.ts" />
/// <reference path="../../model/texture/EngineTexture.ts" />
class BaseAnimation extends AnimationComponent {
    public render: BaseRender;

    constructor(pos: Vector, engineTexture: EngineTexture){
        const render = new BaseRender(engineTexture);
        super(pos, render);
    }
}