class TravelingItemMover {
    private coords: Vector;
    private timeBeforeContainerExit = 40;

    constructor(initialCoords: Vector, private moveSpeed: number, private moveVectorIndex: number, private item: ItemInstance) {
        this.coords = this.coordsToFixed(initialCoords);
    }

    public get Coords(): Vector {
        return this.coords
    }

    public get MoveSpeed(): number {
        return this.moveSpeed
    }

    public get MoveVectorIndex(): number {
        return this.moveVectorIndex
    }

    public get TimeBeforeContainerExit(): number {
        return this.timeBeforeContainerExit;
    }

    /*
     * For "Saver.registerObjectSaver" use only
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

        const { x, y, z } = this.Coords;
        if (this.isInCoordsCenter(this.coords) && World.isChunkLoadedAt(x, y, z)) {
            Debug.m(`finded ${this.findNewMoveVector()}`);
            this.moveVectorIndex = this.findNewMoveVector();
        }
    }

    private findNewMoveVector(): number {
        let vctr = this.moveVectorIndex;
        const nextPipes = this.filterPaths(this.getRelativePaths());
        const keys = Object.keys(nextPipes);

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
                const {x, y, z} = World.getRelativeCoords(this.Coords.x, this.Coords.y, this.Coords.z, i);
                const pipeID = World.getBlockID(x, y, z);
                const relativePipeClass = PipeIdMap.getClassById(pipeID);
                const currentConnector = this.getClassOfCurrentPipe().pipeConnector;
                if (relativePipeClass != null && currentConnector.canConnectToPipe(relativePipeClass)) {
                    pipes[i] = relativePipeClass;
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
        const {x, y, z} = this.Coords;
        const tileEntity = World.getTileEntity(x, y, z);

        if (tileEntity && tileEntity.canItemGoFromSide) {
            const keys = Object.keys(paths);
            for (const t of keys) {
                const index = keys[t];
                // ? canItemGoToSide(item: ItemInstance, index: number): boolean
                if (!tileEntity.canItemGoToSide(this.item, index)) {
                    delete paths[index];
                }
            }
        }

        return paths;
    }

    public getClassOfCurrentPipe(): BCPipe | null {
        const {x, y, z} = this.Coords;
        const blockID = World.getBlockID(x, y, z);
        return PipeIdMap.getClassById(blockID);
    }

    public isInsidePipe(): boolean {
        const { x, y, z } = this.Coords;
        const isChunkLoaded = World.isChunkLoadedAt(x, y, z);
        return !isChunkLoaded || this.getClassOfCurrentPipe() != null;
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
            x: Math.round(coords.x * 100) / 100,
            y: Math.round(coords.y * 100) / 100,
            z: Math.round(coords.z * 100) / 100,
        };
    }
}