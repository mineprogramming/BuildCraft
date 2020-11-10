/// <reference path="AxisBoxes.ts" />
const OBSIDIAN_PIPE_DROP_VELOCITY = +__config__.getNumber("obsidian_pipe_drop_velocity");
class ObsidianPipeItemAccelerator {
	constructor(private region: BlockSource, private coords: Vector) { }

	private side: number = null;

	public set ConnectionSide(value: number) {
		this.side = value;
	}

	public get ConnectionSide(): number {
		return this.side;
	}

	public accelerate(count: number): void {
		if (this.ConnectionSide === null || count <= 0) return;
		const target = this.coords;
		const side = this.ConnectionSide;
		const box = this.getMovedAxisBoxBySide(target, side);
		const entities = this.getItems(box, this.region);

		for (const entity of entities) {
			Entity.moveToTarget(entity, this.getMoveTarget(), {speed: OBSIDIAN_PIPE_DROP_VELOCITY});
			return;
		}
	}

	private getItems(box: BoxPoints, region: BlockSource): number[] {
		const { x, y, z } = box.start;
		const end = box.end;
		return region.listEntitiesInAABB(x, y, z, end.x, end.y, end.z, 64, false);
	}

	private getMoveTarget(): Vector {
		const x = this.coords.x + .5;
		const y = this.coords.y + .5;
		const z = this.coords.z + .5;
		return { x, y, z };
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