class ObsidianPipeItemEjector {
	constructor(private region: BlockSource, private coords: Vector) { }

	public set ConnectionSide(value: number) {
		this.side = value;
	}

	public get ConnectionSide(): number {
		return this.side;
	}

	private side: number = null;
	public collectEntities(maxCount: number): void {
		const boxEnd = {
			x: this.coords.x + 1,
			y: this.coords.y + 1,
			z: this.coords.z + 1
		};

		const { x, y, z } = this.coords;
		const entitiesToCollect = this.region.listEntitiesInAABB(x, y, z, boxEnd.x, boxEnd.y, boxEnd.z, 64, false);
        for (const entity of entitiesToCollect) {
			if (!Entity.isExist(entity)) return;

			const item = Entity.getDroppedItem(entity);
            if (item.count <= maxCount) {
				const speed = this.getItemSpeed(entity);
				this.extractItem(item, speed);
				Entity.remove(entity);
            }
        }
	}

	private extractItem(item: ItemInstance, speed: number) : void {
        const offsetVector = World.getRelativeCoords(0, 0, 0, this.ConnectionSide);

        // ? should I add offsetDistance to config?
        const offsetDistance =
            __config__.getNumber("travelingItem_offset_distance") || 0.01;

        const itemCoords = {
            x: this.coords.x + 0.5 + offsetDistance * offsetVector.x,
            y: this.coords.y + 0.5 + offsetDistance * offsetVector.y,
            z: this.coords.z + 0.5 + offsetDistance * offsetVector.z,
		};
		const travelingItem = new TravelingItem(itemCoords, this.region.getDimension(), item, this.ConnectionSide, speed);
	}

	private getItemSpeed(entity: number): number {
		const distance = Entity.getDistanceToCoords(entity, this.coords);
		return Math.max(distance / 50, BCPipe.StandartPipeSpeed.Target);
	}
}