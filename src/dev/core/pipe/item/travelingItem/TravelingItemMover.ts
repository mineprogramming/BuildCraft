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

    public get AbsoluteCoords(): Vector {
        const { x, y, z } = this.Coords;
        return {
            x: Math.floor(x),
            y: Math.floor(y),
            z: Math.floor(z)
        }
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

        // this.checkMoveVectorChange();
    }

    private checkMoveVectorChange(): void {
        if (this.timeBeforeContainerExit > 0) {
            this.timeBeforeContainerExit--;
            return;
        }
        if (this.isInCoordsCenter()) {
            this.findNewMoveVector();
        }
    }

    public findNewMoveVector(): boolean {
        const nextPipes = this.filterPaths(this.getRelativePaths());
        const keys = Object.keys(nextPipes);

        if (keys.length > 0) {
            const keyIndex = this.random(keys.length);
            this.moveVectorIndex = parseInt(keys[keyIndex]);
            return true;
        }

        return false;
    }

    /**
     * @returns {object} which looks like {"sideIndex": pipeClass | container}
     */
    private getRelativePaths(): object {
        const pipes = {};
        for (let i = 0; i < 6; i++) {
            const backVectorIndex = World.getInverseBlockSide(this.moveVectorIndex);
            if (i != backVectorIndex) {
                const curX = Math.floor(this.Coords.x);
                const curY = Math.floor(this.Coords.y);
                const curZ = Math.floor(this.Coords.z);
                const {x, y, z} = World.getRelativeCoords(curX, curY, curZ, i);
                const pipeID = World.getBlockID(x, y, z);
                const relativePipeClass = PipeIdMap.getClassById(pipeID);
                const currentConnector = this.getClassOfCurrentPipe().pipeConnector;
                if (relativePipeClass != null && currentConnector.canConnectToPipe(relativePipeClass)) {
                    pipes[i] = relativePipeClass;
                    continue;
                }

                const container = World.getContainer(x, y, z);
                if (container != null && this.isValidContainer(container)) {
                    pipes[i] = container;
                }
            }
        }
        return pipes;
    }

    public isValidContainer(container): boolean {
        const slots = StorageInterface.getContainerSlots(container, 1, 0);
        let trueSlotsLength = slots.length;
        if (trueSlotsLength > 0 && typeof(slots[0]) == "string") {
            // ! tileEntity container contain jsonSaverId in slots[0]
            trueSlotsLength -= 1;
        }
        return trueSlotsLength > 0;
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
        const x = Math.floor(this.Coords.x);
        const y = Math.floor(this.Coords.y);
        const z = Math.floor(this.Coords.z);

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
    public getVectorBySide(side: number): Vector {
        return World.getRelativeCoords(0, 0, 0, side);
    }

    public isInCoordsCenter(): boolean {
        const coords = this.Coords;
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