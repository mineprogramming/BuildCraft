/// <reference path="AxisBoxes.ts" />
class ObsidianPipeItemAccelerator {
	constructor(private coords: Vector) { }

	private side: number = null;

	public set ConnectionSide(value: number) {
		this.side = value;
	}

	public get ConnectionSide(): number {
		return this.side;
	}

	public accelerate(count: number): void {
		if (this.ConnectionSide === null) return;
		const target = this.coords;
		const side = this.ConnectionSide;
		const box = this.getMovedAxisBoxBySide(target, side);
		Particles.addFarParticle(Native.ParticleType.flame, box.start.x, box.start.y, box.start.z, 0,0,0,0);
		Particles.addFarParticle(Native.ParticleType.flame, box.end.x, box.end.y, box.end.z, 0,0,0,0);
	}

	private getStandartBoxPoints(side: number): BoxPoints {
		switch (side) {
			case 0:
			case 1:
				return AxisBoxes.Y;
			case 2:
			case 3:
				return AxisBoxes.Z;
			case 4:
			case 5:
				return AxisBoxes.X;
		}
	}

	private getMovedAxisBoxBySide(target: Vector, side: number): BoxPoints {
		let box = this.getStandartBoxPoints(side);
		const movVector = this.getVectorBySide(side);
		box = {
			start: {
				x: target.x + movVector.x + box.start.x,
				y: target.y + movVector.y + box.start.y,
				z: target.z + movVector.z + box.start.z
			},
			end: {
				x: target.x + movVector.x + box.end.x,
				y: target.y + movVector.y + box.end.y,
				z: target.z + movVector.z + box.end.z
			}
		};

		return box;
	}

	private getVectorBySide(side: number): Vector {
		const invertedSide = World.getInverseBlockSide(side);
		return World.getRelativeCoords(0, 0, 0, invertedSide);
	}
}