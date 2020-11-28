/// <reference path="../../PipeSpeed.ts" />
class TravelingItemMover {
    private coords: Vector;
    private prevCoords: Vector;

    private prevCoordsTime: number;
    private nextCoordsTime: number;

    constructor(
        initialCoords: Vector,
        private progressPart: number,
        private moveVectorIndex: number,
        private item: ItemInstance,
        private pipeSpeed: PipeSpeed = BCPipe.StandartPipeSpeed,
        private moveSpeed: number
    ) {
        this.coords = this.coordsToFixed(initialCoords);
        if (!this.moveSpeed) {
            this.moveSpeed = this.pipeSpeed.Target;
        }
        this.updateCoordsTime();
        this.updatePrevCoords();
    }

    public get Coords(): Vector {
        return this.coords;
    }

    public get PrevCoords(): Vector {
        return this.prevCoords;
    }

    public get NextCoords(): Vector {
        const prev = this.PrevCoords;
        const vec = this.getVectorBySide(this.MoveVectorIndex);
        prev.x += vec.x;
        prev.y += vec.y;
        prev.z += vec.z;
        return prev;
    }

    public get ProgressPart(): number {
        return this.progressPart;
    }

    public get Time(): number {
        return java.lang.System.currentTimeMillis();
    }

    public get TravelTime(): number {
        return this.nextCoordsTime - this.prevCoordsTime;
    }

    public get PipeSpeed(): PipeSpeed {
        return this.pipeSpeed;
    }

    public set PipeSpeed(speed: PipeSpeed) {
        this.pipeSpeed = speed;
    }

    public get MoveSpeed(): number {
        return this.moveSpeed;
    }

    public get MoveVectorIndex(): number {
        return this.moveVectorIndex;
    }

    public get AbsoluteCoords(): Vector {
        const { x, y, z } = this.Coords;
        return {
            x: Math.floor(x),
            y: Math.floor(y),
            z: Math.floor(z),
        };
    }

    public hasReached(): boolean {
        return this.Time >= this.nextCoordsTime;
    }

    public move(): void {
        if (this.moveSpeed <= 0 || this.moveVectorIndex == null) return;
        const moveVector = this.getVectorBySide(this.MoveVectorIndex);

        const moveTime = this.nextCoordsTime - this.prevCoordsTime;
        const timePassed = this.Time - this.prevCoordsTime;
        this.progressPart = Math.min(timePassed / moveTime, 1);

        const newCoords = {
            x: this.prevCoords.x + moveVector.x * this.ProgressPart,
            y: this.prevCoords.y + moveVector.y * this.ProgressPart,
            z: this.prevCoords.z + moveVector.z * this.ProgressPart
        };

        this.coords = this.coordsToFixed(newCoords);
    }

    public findNewMoveVector(region: BlockSource): boolean {
        const nextPipes = this.filterPaths(this.getRelativePaths(region), region);
        const keys = Object.keys(nextPipes);

        if (keys.length > 0) {
            const keyIndex = this.random(keys.length);
            this.moveVectorIndex = parseInt(keys[keyIndex]);
            // ? should I delete fitCoords?
            this.fitCoordsToCenter();
            this.prevCoords = this.Coords;
            this.updateMoveSpeed(region);
            this.updateCoordsTime();
            return true;
        }

        return false;
    }

    /**
     * @param progressPart use only saves reading
     */
    private updateCoordsTime(progressPart: number = 0): void {
        const speedInMs = this.MoveSpeed / 50;
        const totalTimeInMs = 1 / speedInMs;
        this.prevCoordsTime = this.Time - totalTimeInMs * progressPart;
        this.nextCoordsTime = this.Time + totalTimeInMs * (1 - progressPart);
    }
    /**
     * use only saves reading
     */
    private updatePrevCoords(): void {
        const moveVector = this.getVectorBySide(this.MoveVectorIndex);
        const relativePrevCoords = {
            x: this.Coords.x - moveVector.x * this.ProgressPart,
            y: this.Coords.y - moveVector.y * this.ProgressPart,
            z: this.Coords.z - moveVector.z * this.ProgressPart
        };
        this.prevCoords = this.coordsToFixed(relativePrevCoords);
    }

    public updateMoveSpeed(region: BlockSource): void {
        // update pipeSpeed
        this.pipeSpeed = this.getClassOfCurrentPipe(region).PipeSpeed;

        if (this.MoveSpeed < this.PipeSpeed.Target) {
            this.moveSpeed += this.PipeSpeed.Delta;
        } else if (this.MoveSpeed > this.PipeSpeed.Target) {
            this.moveSpeed -= this.PipeSpeed.Delta;
        }
    }

    /**
     * @returns {object} which looks like {"sideIndex": pipeClass | container}
     */
    private getRelativePaths(region: BlockSource): object {
        const pipes = {};
        for (let i = 0; i < 6; i++) {
            const backVectorIndex = World.getInverseBlockSide(this.moveVectorIndex);
            if (i != backVectorIndex) {
                const curX = this.AbsoluteCoords.x;
                const curY = this.AbsoluteCoords.y;
                const curZ = this.AbsoluteCoords.z;
                const { x, y, z } = World.getRelativeCoords(curX, curY, curZ, i);
                const pipeBlockID = region.getBlockId(x, y, z);
                const pipeBlockData = region.getBlockData(x, y, z);
                const relativePipeClass = PipeIdMap.getClassById(pipeBlockID);
                const currentConnector = this.getClassOfCurrentPipe(region)?.pipeConnector;
                if (relativePipeClass != null && currentConnector?.canConnectToPipe(relativePipeClass)) {
                    pipes[i] = relativePipeClass;
                    continue;
                }

                const container = World.getContainer(x, y, z, region);
                if (container != null && this.isValidContainer(container) && !currentConnector?.hasBlacklistBlockID(pipeBlockID, pipeBlockData)) {
                    pipes[i] = container;
                }
            }
        }
        return pipes;
    }

    public isValidContainer(container): boolean {
        const slots = StorageInterface.getContainerSlots(container, 1, 0);
        let trueSlotsLength = slots.length;
        if (trueSlotsLength > 0 && typeof slots[0] == "string") {
            // ! tileEntity container has jsonSaverId in slots[0]
            trueSlotsLength -= 1;
        }
        return trueSlotsLength > 0;
    }

    /**
     * @param {object} is returnable from getRelativePaths
     */
    private filterPaths(paths: object, region: BlockSource): object {
        const { x, y, z } = this.AbsoluteCoords;
        const tileEntity = World.getTileEntity(x, y, z, region);
        if (tileEntity && tileEntity.canItemGoToSide) {
            const keys = Object.keys(paths);
            for (const t in keys) {
                const index = keys[t];
                // ? canItemGoToSide(item: ItemInstance, index: number): boolean
                if (!tileEntity.canItemGoToSide(this.item, index)) {
                    delete paths[index];
                }
            }
        }
        return paths;
    }

    private fitCoordsToCenter(): void {
        const absCoords = this.AbsoluteCoords;
        this.coords = {
            x: absCoords.x + .5,
            y: absCoords.y + .5,
            z: absCoords.z + .5
        };
    }

    public getClassOfCurrentPipe(region: BlockSource): BCPipe | null {
        const { x, y, z } = this.AbsoluteCoords;
        const blockID = region.getBlockId(x, y, z);
        return PipeIdMap.getClassById(blockID);
    }

    public isInsidePipe(region: BlockSource): boolean {
        const { x, y, z } = this.Coords;
        const isChunkLoaded = region.isChunkLoaded(Math.floor(x / 16), Math.floor(z / 16));
        return !isChunkLoaded || this.getClassOfCurrentPipe(region) != null;
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
