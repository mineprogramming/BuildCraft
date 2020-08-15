class TravelingItemAnimation {
    private readonly animation: any;
    constructor(coords: Vector, id: number) {
        this.animation = new Animation.Item(
            coords.x + 0.5,
            coords.y + 0.5,
            coords.z + 0.5
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

    public updateCoords(x: number, y: number, z: number): void {
        this.animation.setPos(x, y, z);
    }

    public destroy(): void {
        this.animation.destroy();
    }
}
