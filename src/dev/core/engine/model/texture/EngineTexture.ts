/// <reference path="../../EngineHeat.ts" />
/// <reference path="../EngineRotation.ts" />
/// <reference path="ITexture.ts" />
/// <reference path="../../components/model/EngineItemModelTexture.ts" />
interface Vector2 {
    x: number;
    y: number;
}

const STANDART_TEXTURE = "model/buildcraft_engine_atlas.png";
const STANDART_SIZE = { width: 512, height: 512 };

class EngineTexture {
    private engineItemModelTexture: EngineItemModelTexture;
    constructor(itemModelTexture: string, public readonly name: string, private readonly baseOffset, public readonly size: ITexture) {
        this.engineItemModelTexture = new EngineItemModelTexture(itemModelTexture);
    }

    public getTrunkUV(heat: EngineHeat, rotation: EngineRotation): Vector2 {
        return { x: 64 * rotation, y: 32 * HeatOrder.indexOf(heat) }
    }

    public getBaseUV(rotation: EngineRotation): Vector2 {
        return { x: this.baseOffset.x + 64 * rotation, y: this.baseOffset.y }
    }

    public getChamberUV(): Vector2 {
        return { x: 192, y: 0 }
    }

    public getItemModelTexture(): EngineItemModelTexture {
        return this.engineItemModelTexture;
    }
}