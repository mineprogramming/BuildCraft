class TravelingItemAnimation {
    private readonly animation: any;
    constructor(coords: Vector, item: ItemInstance) {
        this.animation = new Animation.Item(coords.x, coords.y, coords.z);
        this.describe(item);
        this.animation.load();
        alert(`animation loaded for ${item.id}!`);
    }

    private describe(item: ItemInstance): void {
        this.animation.describeItem({
            id: item.id,
            count: item.count,
            data: item.data,
            notRandomize: true,
            size: 0.3,
        });
    }

    public updateCoords(coords: Vector): void {
        this.animation.setPos(coords.x, coords.y, coords.z);
    }

    public destroy(): void {
        this.animation.destroy();
    }
}
