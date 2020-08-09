type ItemSource = {
    id: number
    count: number
    data: number
}

class TravelingItem {
    //! its just a Updatable flag
    public remove: boolean = false;

    private coords: Vector;
    public moveVector: Vector;
    public moveSpeed: number = 0;
    constructor(x: number, y: number, z: number, private item: ItemSource) {
        this.coords = {
            x: x,
            y: y,
            z: z
        }
        Debug.m(`item created on coords`);
        Debug.m(this.coords);
    }

    // * We need this to pass this["update"] existing
    public update = () => {
        if (!this.isInsideBlock()) {
            this.drop();
            return;
        }
        this.move();
    }

    private move() {
        this.coords.x += this.moveVector.x * this.moveSpeed;
        this.coords.y += this.moveVector.y * this.moveSpeed;
        this.coords.z += this.moveVector.z * this.moveSpeed;
    }

    private isInsideBlock(): boolean {
        return World.getBlockID(this.coords.x, this.coords.y, this.coords.z) != 0;
    }

    private drop() {
        Debug.m(`item was dropped`);
        this.remove = true;
    }
}
