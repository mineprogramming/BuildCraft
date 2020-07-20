/// <reference path="../components/PipeBlock.ts" />
/// <reference path="../components/PipeTexture.ts" />
/// <reference path="PipeConnector.ts" />
abstract class BCPipe {
    protected block: PipeBlock;
    protected connector: PipeConnector;
    protected texture: PipeTexture;
    protected renderer: PipeRenderer;

    constructor(){
        this.block = new PipeBlock(this.material, this.transportType, this.pipeTexture);
        this.renderer = new PipeRenderer(this.pipeConnector, this.pipeTexture, this.renderGroups.main);
        this.registerBlockToGroup();
        this.renderer.enableRender(this.block.id, 0);
    }

    protected registerBlockToGroup(): void {
        const groups = this.renderGroups;
        groups.main.add(this.block.id, -1);
        if(groups.addition)
            groups.addition.add(this.block.id, -1);
    }

    protected get ICRenderGroup(): ICRenderGroup {
        return null
    }

    protected get pipeConnector(): PipeConnector {
        alert("BCPipeConnector");
        return null;
    }

    protected get renderGroups(): {main: ICRenderGroup, addition?: ICRenderGroup} {
        return {
            main: ICRender.getGroup("BCPipe")
        };
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