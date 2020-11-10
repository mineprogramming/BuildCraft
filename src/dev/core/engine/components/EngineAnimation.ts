/// <reference path="../EngineHeat.ts" />
/// <reference path="../model/EngineRotation.ts" />
/// <reference path="animation/PistonAnimation.ts" />
/// <reference path="animation/BaseAnimation.ts" />

class EngineAnimation {
    private readonly base: BaseAnimation;
    private readonly piston: PistonAnimation;

    private readonly yOffset: number = 31;// magic const
    private coords: Vector;

    private side: number = null;// connected side index

    private directions = [
        {rotation: EngineRotation.Y, direction: -1},
        {rotation: EngineRotation.Y, direction: 1},
        {rotation: EngineRotation.Z, direction: -1},
        {rotation: EngineRotation.Z, direction: 1},
        {rotation: EngineRotation.X, direction: 1},
        {rotation: EngineRotation.X, direction: -1}
    ];

    public set ConnectionSide(value: number){
        let rotate = false;
        if (this.side != value) rotate = true;
        this.side = value;
        if (rotate) this.rotateByMeta();
    }

    public get ConnectionSide(): number {
        return this.side;
    }

    constructor(public readonly position: Vector, private heatStage: EngineHeat, private engineTexture: EngineTexture){
        this.piston = new PistonAnimation(position, engineTexture);
        this.base = new BaseAnimation(position, engineTexture);
    }

    public update(progress: number, heat: EngineHeat): void {
        if (progress > 0.5) progress = 1 - progress;

        this.updateTrunkHeat(heat);
        this.piston.setPosition(progress);
        // *will be finished coming soon
        // this.updateChamberPosition(progress);
    }

    private updateTrunkHeat(heat: EngineHeat): void {
        if(this.heatStage !== heat){
            this.heatStage = heat;
            this.base.render.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, this.directions[this.ConnectionSide].rotation);
            this.base.render.refresh();
        }
    }

    private updateChamberPosition(progress: number): void {
        // progress : [0, .5]
        const realPos = 5 + -Math.ceil(10 * progress);
        this.base.render.chamberCoords = {
            x: this.coords.x * realPos,
            y: this.yOffset +  this.coords.y * realPos,
            z: this.coords.z * realPos
        };
        this.base.render.chamberSize = {
            x: 4 + (this.coords.x ? 2*Math.ceil(10 * progress) * Math.abs(this.coords.x): 6),
            y: 4 + (this.coords.y ? 2*Math.ceil(10 * progress) * Math.abs(this.coords.y): 6),
            z: 4 + (this.coords.z ? 2*Math.ceil(10 * progress) * Math.abs(this.coords.z): 6)
        };
        this.base.render.refreshChamber();
    }

    private rotateByMeta(): void {
        const data = this.directions[this.ConnectionSide];
        this.createPiston(data.rotation, data.direction);
    }

    public destroy(): void {
        this.base.destroy();
        this.piston.destroy();
    }

    // Legacy, but it still work
    private createPiston(rotation: EngineRotation, direction: number): void {
        const coords = {x: 0, y: 0, z: 0};

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

        this.coords = coords;

        this.setupBaseBoxes(coords);
        const baseRender = this.base.render;
        baseRender.baseUV = this.engineTexture.getBaseUV(rotation);

        this.setupTrunkBoxes(coords);
        baseRender.trunkUV = this.engineTexture.getTrunkUV(this.heatStage, rotation);
        baseRender.refresh();

        // *will be finished coming soon
        // baseRender.chamberUV = this.engineTexture.getChamberUV();
        // baseRender.refreshChamber();

        this.setupPistonBoxes(coords);
        const pistonRender = this.piston.render;
        pistonRender.pistonUV = this.engineTexture.getBaseUV(rotation);
        pistonRender.refresh();

        // piston Move Vector setup
        this.piston.direction = -direction;
        this.piston.rotation = rotation;
    }

    private setupBaseBoxes(coords: Vector): void {
        this.base.render.baseCoords = {
            x: coords.x * 6,
            y: this.yOffset + coords.y * 6,
            z: coords.z * 6
        }
        this.base.render.baseSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        }
    }

    private setupTrunkBoxes(coords: Vector): void {
        this.base.render.trunkCoords = {
            x: -coords.x * .1,
            y: this.yOffset - coords.y * .1,
            z: -coords.z * .1
        }
        this.base.render.trunkSize = {
            x: 8 + 8 * (Math.abs(coords.x)),
            y: 8 + 8 * (Math.abs(coords.y)),
            z: 8 + 8 * (Math.abs(coords.z))
        }
    }

    private setupPistonBoxes(coords: Vector): void {
        this.piston.render.pistonCoords = {
            x: coords.x * 2,
            y: this.yOffset + coords.y * 2,
            z: coords.z * 2
        };
        this.piston.render.pistonSize = {
            x: 4 + 12 * (1 - Math.abs(coords.x)),
            y: 4 + 12 * (1 - Math.abs(coords.y)),
            z: 4 + 12 * (1 - Math.abs(coords.z))
        }
    }
}