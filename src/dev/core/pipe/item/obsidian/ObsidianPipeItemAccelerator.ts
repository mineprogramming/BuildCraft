/// <reference path="AxisBoxes.ts" />
const OBSIDIAN_PIPE_DROP_VELOCITY = __config__.getNumber("obsidian_pipe_drop_velocity");
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
		if (this.ConnectionSide === null || count <= 0) return;
		const target = this.coords;
		const side = this.ConnectionSide;
		const box = this.getMovedAxisBoxBySide(target, side);
		// Particles.addFarParticle(Native.ParticleType.flame, box.start.x, box.start.y, box.start.z, 0,0,0,0);
		// Particles.addFarParticle(Native.ParticleType.flame, box.end.x, box.end.y, box.end.z, 0,0,0,0);
		const entities = this.getItems(box);

		for (const entity of entities) {
			Entity.moveToTarget(entity, this.getMoveTarget(), {speed: OBSIDIAN_PIPE_DROP_VELOCITY});
			// Debug.m(`for with ${entity}`);
			// Debug.m(Entity.getDroppedItem(entity));
			// const splittedDrop = this.splitEntity(entity, count);
			// Entity.moveToTarget(splittedDrop, this.getMoveTarget(), {speed: OBSIDIAN_PIPE_DROP_VELOCITY});
			const item = Entity.getDroppedItem(entity);
			/*if (item.count <= count) {
				Entity.moveToTarget(entity, this.getMoveTarget(), {speed: OBSIDIAN_PIPE_DROP_VELOCITY});
				Debug.m(`small`);
			} else {
				const { x, y, z } = Entity.getPosition(entity);
				// Entity.remove(entity);
				// Debug.m(`removed ${entity}`);
				// const needed = World.drop(x + .1, y + .1, z + .1, item.id, count, item.data, item.extra);
				// Debug.m(`needed ${needed} ${JSON.stringify( Entity.getDroppedItem(needed))} `);
				Entity.moveToTarget(needed, this.getMoveTarget(), {speed: OBSIDIAN_PIPE_DROP_VELOCITY});
				//item.count = 0;
				//Entity.setMobile(entity, false);
				// TODO maybe add entity in nextTick?
				const additive = World.drop(x - .1, y - .1, z - .1, item.id, item.count - count, item.data, item.extra);
				//Debug.m(`additive ${additive} ${JSON.stringify( Entity.getDroppedItem(additive))}`);
			}*/
			return;
		}
	}

	private getItems(box: BoxPoints): number[] {
		return Entity.getAllInsideBox(box.start, box.end, 64, false);
	}

	private getMoveTarget(): Vector {
		const x = this.coords.x + .5;
		const y = this.coords.y + .5;
		const z = this.coords.z + .5;
		return { x, y, z };
	}

	private splitEntity(entity: number, count: number): number {
		// return { entity, count };
		// Debug.m(`entity ${Entity.getDroppedItem(entity)}`);
		const item = Entity.getDroppedItem(entity);
		let neededEntity: number;

		if (item.count <= count) {
			neededEntity = entity;
			
		} else {
			const { x, y, z } = Entity.getPosition(entity);
			Entity.remove(entity);
			Debug.m(`removed ${entity}`);
			neededEntity = World.drop(x + .1, y + .1, z + .1, item.id, count, item.data, item.extra);
			Debug.m(`needed ${neededEntity} ${JSON.stringify( Entity.getDroppedItem(neededEntity))} `);

			const additiveEntity = World.drop(x - .1, y - .1, z - .1, item.id, item.count - count, item.data, item.extra);
			Debug.m(`additive ${additiveEntity} ${JSON.stringify( Entity.getDroppedItem(additiveEntity))}`);
		}

		return neededEntity;
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