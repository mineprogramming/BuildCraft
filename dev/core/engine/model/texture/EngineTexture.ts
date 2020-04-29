/// <reference path="../../EngineHeat.ts" />
/// <reference path="../EngineRotation.ts" />
/// <reference path="ITexture.ts" />
interface Vector2 {
    x: number;
    y: number;
}

const STANDART_TEXTURE = "model/buildcraft_engine_atlas.png";
const STANDART_SIZE = {width: 512, height: 512};

class EngineTexture {
    constructor(public readonly name: string, private readonly baseOffset, public readonly size: ITexture){}

    public getTrunkUV(heat: EngineHeat, rotation: EngineRotation): Vector2 {
        return {x: 64 * rotation, y: 32 * HeatOrder.indexOf(heat)}
    }

    public getBaseUV(rotation: EngineRotation): Vector2 {
        return {x: this.baseOffset.x + 64 * rotation, y: this.baseOffset.y}
    }
}