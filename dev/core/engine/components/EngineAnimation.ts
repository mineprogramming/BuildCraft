/// <reference path="../EngineHeat.ts" />
/// <reference path="../EngineType.ts" />
/// <reference path="../model/render/RenderManager.ts" />
/// <reference path="../model/render/BaseRender.ts" />
/// <reference path="../model/render/PistonRender.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />

enum EngineRotation {// from legacy
    X = 1,
    Y = 0,
    Z = 2
}
class EngineAnimation {
    private readonly base: BaseAnimation;
    private readonly piston: PistonAnimation;

    private pistonPosition: number = 0;// TODO make setter
    private pushingMultiplier: number = 1;

    private meta = 1;// connected side index

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
        this.meta = value;
        this.rotateByMeta();
    }

    public get connectionSide(): number {
        return this.meta;
    }

    constructor(public readonly coords: IBlockPos, private readonly type: EngineType, private heatStage: EngineHeat){
        this.piston = new PistonAnimation(coords, this.type);
        this.base = new BaseAnimation(coords, this.type, this.heatStage);
    }

    createPiston(rotation: EngineRotation, direction: number) {
        const coords = {
            x: 0,
            y: 0,
            z: 0
        };

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
        baseRender.rotation = rotation;// updating uv

        // base boxes configuration
        baseRender.baseCoords = {
            x: 0 + coords.x * 6,
            y: yOffset + coords.y * 6,
            z: 0 + coords.z * 6,
        }
        baseRender.baseSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        }

        // trunk boxes configuration
        baseRender.trunkCoords = {
            x: 0 - coords.x * .1,
            y: yOffset - coords.y * .1,
            z: 0 - coords.z * .1
        }
        baseRender.trunkSize = {
            x: 8 + 8 * (Math.abs(coords.x)),
            y: 8 + 8 * (Math.abs(coords.y)),
            z: 8 + 8 * (Math.abs(coords.z))
        }
        baseRender.refresh();

        // piston Move Vector setup
        this.piston.direction = -direction;
        this.piston.rotation = rotation;

        // piston boxes configuration
        const pistonRender = this.piston.render;
        pistonRender.rotation = rotation;

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
        pistonRender.refresh();
    }

    public update(power: number, heat: EngineHeat): void {
        if(this.heatStage !== heat){
            this.base.updateHeat(heat);
            this.heatStage = heat;
        }

        // this.base.debug();

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
        const data = this.directions[this.meta]
        this.createPiston(data.rotation, data.direction);
        Debug.m(`rotated by meta ${this.meta}`);
        /*const rotatation = this.getRotation();
        this.base.rotate(rotatation);
        this.piston.rotate(rotatation);
        Debug.m(rotatation)*/
    }

    destroy(): void {
        this.base.destroy();
        this.piston.destroy();
    }
}