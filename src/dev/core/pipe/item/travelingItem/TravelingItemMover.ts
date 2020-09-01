class TravelingItemMover {
    // public moveVectorIndex: number = null;
    // public moveSpeed: number = 0;
    private coords: Vector;
    private timeBeforeContainerExit = 40;

    constructor(initialCoords: Vector, private moveSpeed: number, private moveVectorIndex: number) {
        this.coords = this.coordsToFixed(initialCoords);
    }

    public get Coords(): Vector {
        return this.coords
    }

    public get MoveSpeed(): number {
        return this.moveSpeed
    }

    /* public set MoveSpeed(speed: number) {
        if (speed > 0) this.moveSpeed = speed;
    } */

    public get MoveVectorIndex(): number {
        return this.moveSpeed
    }

    /* public set MoveVectorIndex(index: number) {
        if (index > 0 && index < 6) this.moveVectorIndex = index;
    } */

    public get TimeBeforeContainerExit(): number {
        return this.timeBeforeContainerExit;
    }

    /*
      *  For "Saver.registerObjectSaver" use only
     */
    public set TimeBeforeContainerExit(time: number) {
        if (time > 0) this.timeBeforeContainerExit = time;
    }

    public move(): void {
        const moveVector = this.getVectorBySide(this.moveVectorIndex);
        if (this.moveSpeed <= 0 || this.moveVectorIndex == null) return;

        const newCoords = {
            x: this.coords.x + moveVector.x * this.moveSpeed,
            y: this.coords.y + moveVector.y * this.moveSpeed,
            z: this.coords.z + moveVector.z * this.moveSpeed,
        };

        this.coords = this.coordsToFixed(newCoords);

        this.checkMoveVectorChange();
    }

    private checkMoveVectorChange(): void {
        if (this.timeBeforeContainerExit > 0) {
            this.timeBeforeContainerExit--;
            return;
        }

        if (this.isInCoordsCenter(this.coords)) {
            this.moveVectorIndex = this.findNewMoveVector();
        }
    }

    // TODO make this sht find containers
    private findNewMoveVector(): number {
        // Debug.m(`finding new Vector`);
        let vctr = this.moveVectorIndex;
        const nextPipes = this.filterPaths(this.getRelativePaths());
        const keys = Object.keys(nextPipes);
        // Debug.m(`finded nearby pipes ${keys.length}`);

        if (keys.length > 0) {
            const keyIndex = this.random(keys.length);
            vctr = parseInt(keys[keyIndex]);
        }

        return vctr;
    }

    /**
     * @returns {object} which looks like {"sideIndex": pipeClass | container}
     */
    private getRelativePaths(): object {
        const pipes = {};
        for (let i = 0; i < 6; i++) {
            const backVectorIndex = World.getInverseBlockSide(this.moveVectorIndex);
            if (i != backVectorIndex) {
                const {x, y, z} = World.getRelativeCoords(this.coords.x, this.coords.y, this.coords.z, i);
                const pipeID = World.getBlockID(x, y, z);
                const cls = PipeIdMap.getClassById(pipeID);
                if (cls != null) {
                    // TODO check pipes capatibility
                    pipes[i] = cls;
                    continue;
                }

                const container = World.getContainer(x, y, z);
                if (container) {
                    pipes[i] = container;
                }
            }
        }
        return pipes;
    }

    /**
     * @param {object} is returnable from getRelativePaths
     */
    private filterPaths(paths: object): object {
        // TODO check special pipes like a wooden or diamond
        return paths;
    }

    private random(max: number): number {
        return Math.floor(Math.random() * max);
    }

    // *Heh-heh cunning Nikolai won
    private getVectorBySide(side: number): Vector {
        return World.getRelativeCoords(0, 0, 0, side);
    }

    public isInCoordsCenter(coords: Vector): boolean {
        const isInCenterByX = coords.x % 0.5 == 0 && coords.x % 1 != 0;
        const isInCenterByY = coords.y % 0.5 == 0 && coords.y % 1 != 0;
        const isInCenterByZ = coords.z % 0.5 == 0 && coords.z % 1 != 0;
        return isInCenterByX && isInCenterByY && isInCenterByZ;
    }

    private coordsToFixed(coords: Vector): Vector {
        return {
            x: Math.floor(coords.x * 100) / 100,
            y: Math.floor(coords.y * 100) / 100,
            z: Math.floor(coords.z * 100) / 100,
        };
    }
}
