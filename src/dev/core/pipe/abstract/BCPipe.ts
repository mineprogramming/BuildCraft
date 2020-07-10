/// <reference path="../components/PipeBlock.ts" />
/// <reference path="../components/PipeTexture.ts" />
/// <reference path="../connector/IPipeConnector.ts" />
abstract class BCPipe {
    private block: PipeBlock;
    protected connector: IPipeConnector;
    protected texture: PipeTexture;
    private renderer: PipeRenderer;

    constructor(){
        this.block = new PipeBlock(this.material, this.transportType, this.pipeTexture);
        this.renderer = new PipeRenderer(this.pipeConnector, this.pipeTexture);
        this.registerBlockToGroup();
    }

    protected registerBlockToGroup(): void {
        ICRender.getGroup(this.renderGroup).add(this.block.id, -1);
        alert(`block registered for group ${this.renderGroup}`);
    }

    protected get pipeConnector(): IPipeConnector {
        alert("BCPipeConnector");
        return null;
    }

    protected get renderGroup(): string {
        return "BCPipe";
    }

    protected get pipeTexture(): PipeTexture {
        alert("BCpipeTexture");
        return null;
    }

    protected get pipeRenderer(): PipeRenderer {
        return this.renderer;
    }

    public get material(): string {
        return null
    }

    public get transportType(): string {
        return null
    }
}