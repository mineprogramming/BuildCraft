/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="../model/EngineRotation.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />

class EngineAnimation {
    private readonly base: BaseAnimation;
    private readonly piston: PistonAnimation;

    private pistonPosition: number = 0;// TODO make setter
    private pushingMultiplier: number = 1;

    private side = 1;// connected side index

    private directions = [
        {rotation: EngineRotation.Y, direction: -1},
        {rotation: EngineRotation.Y, direction: 1},
        {rotation: EngineRotation.Z, direction: -1},
        {rotation: EngineRotation.Z, direction: 1},
        {rotation: EngineRotation.X, direction: 1},
        {rotation: EngineRotation.X, direction: -1}
    ];

    public set connectionSide(value: number){
        alert(`meta setted to ${value}`);
        this.side = value;
        this.rotateByMeta();
    }

    public get connectionSide(): number {
        return this.side;
    }
    // TODO remove this.type
    constructor(public readonly coords: IBlockPos, private heatStage: EngineHeat, private engineTexture: EngineTexture){
        // alert(typeof(this.texture)+"   EngineAnimation");
        this.piston = new PistonAnimation(coords, engineTexture);
        this.base = new BaseAnimation(coords, engineTexture);
    }

    // Legacy, but it still work
    createPiston(rotation: EngineRotation, direction: number) {
        const coords = {x: 0, y: 0, z: 0};

        const yOffset = 31;// magic const

        switch (rotation){
            case EngineRotation.X:
                coords.x = direction;
            break;
            case EngineRotation.Y:
                coords.y = direction;
            break;
            case EngineRotation.Z:
                coords.z = direction;
            break;
        };

        const baseRender = this.base.render;
        // base boxes configuration
        baseRender.baseCoords = {
            x: coords.x * 6,
            y: yOffset + coords.y * 6,
            z: coords.z * 6,
        }
        baseRender.baseSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        }

        baseRender.baseUV = this.engineTexture.getBaseUV(rotation);

        // trunk boxes configuration
        baseRender.trunkCoords = {
            x: -coords.x * .1,
            y: yOffset - coords.y * .1,
            z: -coords.z * .1
        }
        baseRender.trunkSize = {
            x: 8 + 8 * (Math.abs(coords.x)),
            y: 8 + 8 * (Math.abs(coords.y)),
            z: 8 + 8 * (Math.abs(coords.z))
        }

        baseRender.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, rotation);
        baseRender.refresh();

        // piston Move Vector setup
        this.piston.direction = -direction;
        this.piston.rotation = rotation;

        const pistonRender = this.piston.render;
        // piston boxes configuration
        pistonRender.pistonCoords = {
            x: coords.x * 2,
            y: yOffset + coords.y * 2,
            z: coords.z * 2
        };
        pistonRender.pistonSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        }
        pistonRender.pistonUV = this.engineTexture.getBaseUV(rotation);
        pistonRender.refresh();
    }

    public update(power: number, heat: EngineHeat): void {
        if(this.heatStage !== heat){
            this.heatStage = heat;
            this.base.render.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, this.directions[this.side].rotation);
            this.base.render.refresh();
        }

        this.pushingMultiplier = this.pistonPosition < 0 ? 1 : this.pushingMultiplier;
        this.pistonPosition += power * this.pushingMultiplier / 64; // 64 is magical multiplier

        this.piston.setPosition(this.pistonPosition);
    }

    isReadyToGoBack(): boolean {
        return this.pistonPosition > .5
    }

    goBack(): void {
        this.pushingMultiplier = -1;
    }

    rotateByMeta(): void {
        const data = this.directions[this.side]
        this.createPiston(data.rotation, data.direction);
        Debug.m(`rotated by meta ${this.side}`);
    }

    destroy(): void {
        this.base.destroy();
        this.piston.destroy();
    }
}