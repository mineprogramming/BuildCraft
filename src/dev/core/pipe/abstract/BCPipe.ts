/// <reference path="../components/PipeBlock.ts" />
/// <reference path="../components/PipeTexture.ts" />
/// <reference path="../components/PipeIdMap.ts" />
/// <reference path="../PipeSpeed.ts" />
/// <reference path="PipeConnector.ts" />
abstract class BCPipe {
    protected block: PipeBlock;
    protected connector: PipeConnector;
    protected texture: PipeTexture;
    protected renderer: PipeRenderer;
    protected pipeSpeed: PipeSpeed = BCPipe.StandartPipeSpeed;
    protected static standartSpeed: PipeSpeed = new PipeSpeed(0.01, 0.02);

    constructor(){
        this.block = new PipeBlock(this.material, this.transportType, this.pipeTexture);
        this.renderer = new PipeRenderer(this.pipeConnector, this.pipeTexture, this.renderGroups.main);
        this.registerBlockToGroup();
        this.renderer.enableRender(this.block.id, 0);
        PipeIdMap.assignIdAsClass(this.block.id, this);
    }

    protected registerBlockToGroup(): void {
        const groups = this.renderGroups;
        groups.main.add(this.block.id, -1);
        if(groups.addition)
            groups.addition.add(this.block.id, -1);
    }

    protected get ICRenderGroup(): ICRender.Group {
        return null
    }

    public get pipeConnector(): PipeConnector {
        alert("BCPipeConnector");
        return null;
    }

    public get renderGroups(): RenderGroups {
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

    public get PipeSpeed(): PipeSpeed {
        return this.pipeSpeed;
    }

    public static get StandartPipeSpeed(): PipeSpeed {
        return this.standartSpeed;
    }
}