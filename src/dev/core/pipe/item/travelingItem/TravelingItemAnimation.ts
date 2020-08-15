class TravelingItemAnimation {
    private readonly animation: any;
    constructor(coords: Vector, id: number) {
        this.animation = new Animation.Item(
            coords.x,
            coords.y,
            coords.z
        );
        this.describe(id);
        this.animation.load();
        alert(`animation loaded for ${id}!`);
    }

    private describe(numberId: number): void {
        this.animation.describeItem({
            id: numberId,
            count: 1,
            data: 0,
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
