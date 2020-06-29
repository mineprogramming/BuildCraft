/// <reference path="../components/PipeBlock.ts" />
abstract class BCPipe {
    protected block: PipeBlock;

    constructor(){
        this.block = new PipeBlock(this.material, this.transportType);
    }

    public get material(): string {
        return null
    }

    public get transportType(): string {
        return null
    }

    protected canConnectToPipe(): boolean {
        return false
    }
}