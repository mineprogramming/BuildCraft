/// <reference path="../components/PipeBlock.ts" />
abstract class BCPipe {
    protected block: PipeBlock;

    public get material(): string {
        return null
    }

    public get transportType(): string {
        return null
    }

    protected canConnectToPipe(): boolean {
        return false
    }

    public renderConnections(): void {

    }

    constructor(){
        this.block = new PipeBlock(this.material, this.transportType);
    }
}