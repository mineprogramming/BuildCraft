class TravelingItemAnimation {
    private readonly animation: any;
    private readonly randomOffset = Math.random() / 100;
    constructor(coords: Vector, item: ItemInstance) {
        this.animation = new Animation.Item(coords.x, coords.y, coords.z);
        this.describe(item);
        this.animation.load();
        this.animation.setInterpolationEnabled(true);
    }

    private describe(item: ItemInstance): void {
        this.animation.describeItem({
            id: item.id,
            count: 1,
            data: item.data,
            notRandomize: true,
            size: 0.3,
        });
    }

    public updateCoords(coords: Vector): void {
        // removing visual collisions
        const x = coords.x + this.randomOffset;
        const y = coords.y + this.randomOffset;
        const z = coords.z + this.randomOffset;
        this.animation.setPos(x, y, z);
    }

    public destroy(): void {
        this.animation.destroy();
    }
}
