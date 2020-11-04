class ObsidianPipeTargetConnector {
    constructor(public pipeClass: BCPipe, private coords: Vector, private pipeConnector: PipeConnector) { }

    public getTargetSide(): number | null {
        let findedTarget = null;
        for (let side = 0; side < 6; side++) {
            const { x, y, z } = World.getRelativeCoords(this.coords.x, this.coords.y, this.coords.z, side);
            const isContainer = this.isValidContainerAtCoords(x, y, z);
            let isValidPipe = false;
            if (this.pipeClass && this.pipeConnector.canConnectToPipe(this.pipeClass)) isValidPipe = true;

            if (isContainer || isValidPipe) {
                if (findedTarget == null) {
                    findedTarget = side;
                } else {
                    return null;
                }
            }
        }
        return findedTarget
    }

    private isValidContainerAtCoords(x: number, y: number, z: number): boolean {
        const container = World.getContainer(x, y, z);
        if (!container) return false;
        // ! container.slots contain not only slots. It containt saverID too.
        // ! container.slots.length = 1 means that container has 0 slots
        if (!container.slots || container.slots.length > 1) return true;
    }
}