/// <reference path="./AnimationComponent.ts" />
/// <reference path="../../EngineType.ts" />
/// <reference path="../../EngineHeat.ts" />
class BaseAnimation extends AnimationComponent {
    protected render: BaseRender;

    constructor(pos: IBlockPos, type: EngineType, heat: EngineHeat){
        const render = new BaseRender(type, heat);
        super(pos, render);
    }

    updateHeat(heat: EngineHeat){
        this.render.updateHeatStage(heat);
    }
}