/// <reference path="TravelingItemMoveData.ts" />
const IS_INTERPOLATION_ENABLED = __config__.getBool(
    "animation_movement_interpolation"
);
const AVERAGE_PING = __config__.getFloat("relative_max_ping");
interface TimedVector extends Vector {
    time: number;
}

class TravelingItemAnimation {
    private readonly animation: any;
    private readonly randomOffset = Math.random() / 100;
    private remove: boolean = false;

    private time: 0;
    private startPos: Vector;
    private targetPos1: TimedVector;
    private targetPos2: TimedVector;

    constructor(private coords: Vector, item: ItemInstance) {
        this.animation = new Animation.Item(coords.x, coords.y, coords.z);
        this.describe(item);
        this.animation.load();
        this.animation.setInterpolationEnabled(IS_INTERPOLATION_ENABLED);
    }

    public get Coords(): Vector {
        return this.coords;
    }

    public update = () => {
        if (this.time < this.targetPos2.time) {
            if (this.time < this.targetPos1.time) {
                // go to targetPos1
                const progress = Math.min(this.time / this.targetPos1.time, 1);
                this.updateCoords(
                    this.interpolateBetweenPositions(
                        this.startPos,
                        this.targetPos1,
                        progress
                    )
                );
            } else {
                // go to targetPos2
                const progress = Math.min(1,
                    (this.time - this.targetPos1.time) / (this.targetPos2.time - this.targetPos1.time)
                );
                this.updateCoords(
                    this.interpolateBetweenPositions(
                        this.targetPos1,
                        this.targetPos2,
                        progress
                    )
                );
            }
        }
        this.time++;

        const { x, y, z } = this.Coords;
        this.animation.setPos(x, y, z);
    };

    public updateMoveData(packet: TravelingItemMoveData): void {
        const moveVector = this.getVectorBySide(packet.vectorIndex);

        this.time = 0;
        this.startPos = this.Coords;

        const totalTime = Math.min(
            packet.time * 1.5,
            packet.time + AVERAGE_PING
        );

        // axis is "x", "y" or "z"
        const axis = this.getAxisByIndex(packet.vectorIndex);
        const distance = Math.abs(
            packet.coordsFrom[axis] - this.startPos[axis]
        );

        // dis1To2 is always 1
        const speed = (distance + 1) / totalTime;
        const time1 = distance / speed / 50;

        this.targetPos1 = {
            x: packet.coordsFrom.x,
            y: packet.coordsFrom.y,
            z: packet.coordsFrom.z,
            time: time1,
        };

        const time2 = totalTime / 50;
        this.targetPos2 = {
            x: this.targetPos1.x + moveVector.x,
            y: this.targetPos1.y + moveVector.y,
            z: this.targetPos1.z + moveVector.z,
            time: time2,
        };
    }

    /**
     * Thanks Zheka2304
     */
    private interpolateBetweenPositions(pos1: Vector, pos2: Vector, f: number) {
        f = Math.min(Math.max(0, f), 1);
        return {
            x: pos1.x * (1 - f) + pos2.x * f,
            y: pos1.y * (1 - f) + pos2.y * f,
            z: pos1.z * (1 - f) + pos2.z * f,
        };
    }

    private describe(item: ItemInstance): void {
        this.animation.describeItem({
            id: Network.serverToLocalId(item.id),
            count: 1,
            data: item.data,
            notRandomize: true,
            size: 0.3,
        });
    }

    public updateCoords(coords: Vector): void {
        // removing visual collisions
        this.coords = {
            x: coords.x + this.randomOffset,
            y: coords.y + this.randomOffset,
            z: coords.z + this.randomOffset,
        };
    }

    // *Heh-heh cunning Nikolai won
    public getVectorBySide(side: number): Vector {
        return World.getRelativeCoords(0, 0, 0, side);
    }

    private getAxisByIndex(side: number): string {
        switch (side) {
            case 0:
            case 1:
                return "y";
            case 2:
            case 3:
                return "z";
            case 4:
            case 5:
                return "x";
        }
    }

    public destroy(): void {
        this.animation.destroy();
        this.remove = true;
    }
}
