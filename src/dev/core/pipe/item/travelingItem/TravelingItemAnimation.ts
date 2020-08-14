class TravelingItemAnimation {
    private readonly animation: any;
    constructor(coords: Vector, id: number) {
        this.animation = new Animation.Item(coords.x, coords.y + 1, coords.z);
        this.describe(id);
        this.animation.load();
        alert(`animation loaded!`);
    }

    private describe(numberId: number): void {
        this.animation.describeItem({
            id: numberId,
            count: 1,
            data: 0,
            size: 1
       });
    }

    public updateCoords(x: number, y: number, z: number): void {
        this.animation.setPos(x, y, z);
    }
}