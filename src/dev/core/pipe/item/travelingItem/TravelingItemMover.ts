/// <reference path="../../PipeSpeed.ts" />
class TravelingItemMover {
    private coords: Vector;
    private moveSpeed: number;

    constructor(
        initialCoords: Vector,
        private moveVectorIndex: number,
        private item: ItemInstance,
        private pipeSpeed: PipeSpeed = BCPipe.StandartPipeSpeed,
        private timeToDest: number = 0
    ) {
        this.coords = this.coordsToFixed(initialCoords);
        this.moveSpeed = this.pipeSpeed.Target;
        this.updateTimeToDest();
    }

    public get Coords(): Vector {
        return this.coords;
    }

    public get PipeSpeed(): PipeSpeed {
        return this.pipeSpeed;
    }

    public set PipeSpeed(speed: PipeSpeed) {
        this.pipeSpeed = speed;
    }

    public get TimeToDest(): number {
        return this.timeToDest;
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

    public move(): void {
        const moveVector = this.getVectorBySide(this.moveVectorIndex);
        if (this.moveSpeed <= 0 || this.moveVectorIndex == null) return;

        const newCoords = {
            x: this.coords.x + moveVector.x * this.moveSpeed,
            y: this.coords.y + moveVector.y * this.moveSpeed,
            z: this.coords.z + moveVector.z * this.moveSpeed,
        };

        this.coords = this.coordsToFixed(newCoords);

        this.timeToDest--;
    }

    public findNewMoveVector(): boolean {
        const nextPipes = this.filterPaths(this.getRelativePaths());
        const keys = Object.keys(nextPipes);

        if (keys.length > 0) {
            const keyIndex = this.random(keys.length);
            this.moveVectorIndex = parseInt(keys[keyIndex]);
            this.fitCoordsToCenter();
            this.updateMoveSpeed();
            this.updateTimeToDest();
            return true;
        }

        return false;
    }

    private updateTimeToDest(): void {
        const add = this.getVectorBySide(this.MoveVectorIndex);
        const targetCoords = {
            x: this.AbsoluteCoords.x + add.x + .5,
            y: this.AbsoluteCoords.y + add.y + .5,
            z: this.AbsoluteCoords.z + add.z + .5
        };
        let travelDistance: number;

        switch (this.MoveVectorIndex) {
            case 0:
            case 1:
                travelDistance = targetCoords.y - this.Coords.y
                break;
            case 2:
            case 3:
                travelDistance = targetCoords.z - this.Coords.z
                break;
            case 4:
            case 5:
                travelDistance = targetCoords.x - this.Coords.x
                break;
        }

        const travelTime = Math.floor(Math.abs(travelDistance) / this.MoveSpeed);
        this.timeToDest = travelTime;
    }

    public updateMoveSpeed(): void {
        // update pipeSpeed
        this.pipeSpeed = this.getClassOfCurrentPipe().PipeSpeed;

        if (this.MoveSpeed < this.PipeSpeed.Target) {
            this.moveSpeed += this.PipeSpeed.Delta;
        } else if (this.MoveSpeed > this.PipeSpeed.Target){
            this.moveSpeed -= this.PipeSpeed.Delta;
        }
    }

    /**
     * @returns {object} which looks like {"sideIndex": pipeClass | container}
     */
    private getRelativePaths(): object {
        const pipes = {};
        for (let i = 0; i < 6; i++) {
            const backVectorIndex = World.getInverseBlockSide(this.moveVectorIndex);
            if (i != backVectorIndex) {
                const curX = this.AbsoluteCoords.x;
                const curY = this.AbsoluteCoords.y;
                const curZ = this.AbsoluteCoords.z;
                const { x, y, z } = World.getRelativeCoords(curX, curY, curZ, i);
                const pipeBlock = World.getBlock(x, y, z);
                const relativePipeClass = PipeIdMap.getClassById(pipeBlock.id);
                const currentConnector = this.getClassOfCurrentPipe().pipeConnector;

                if (relativePipeClass != null && currentConnector.canConnectToPipe(relativePipeClass)) {
                    pipes[i] = relativePipeClass;
                    continue;
                }

                const container = World.getContainer(x, y, z);
                if (container != null && this.isValidContainer(container) && !currentConnector.hasBlacklistBlockID(pipeBlock)) {
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
            // ! tileEntity container contain jsonSaverId in slots[0]
            trueSlotsLength -= 1;
        }
        return trueSlotsLength > 0;
    }

    /**
     * @param {object} is returnable from getRelativePaths
     */
    private filterPaths(paths: object): object {
        const { x, y, z } = this.AbsoluteCoords;
        const tileEntity = World.getTileEntity(x, y, z);
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

    public getClassOfCurrentPipe(): BCPipe | null {
        const {x, y, z} = this.AbsoluteCoords;
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