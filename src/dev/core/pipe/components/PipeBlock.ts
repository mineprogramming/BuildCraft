const pipeBlockType = {
    base: 1
};
// TODO complete blockType before release

class PipeBlock {
    public readonly id: number;
    public readonly stringId: string;

    constructor(public readonly material: string, public readonly transportType: string, private texture: PipeTexture){
        this.stringId = `pipe_${this.transportType}_${this.material}`;
        this.registerBlock();
        this.id = BlockID[this.stringId];
        this.registerShape();
    }

    private registerBlock(): void {
        IDRegistry.genBlockID(this.stringId);
        Block.createBlock(this.stringId,
            [{name: this.stringId, texture: [this.texture.block], inCreative: true}], pipeBlockType);
    }

    private registerShape(): void {
        Block.setBlockShape(this.id, {x: .25, y: .25, z: .25}, {x: 0.75, y: 0.75, z: 0.75});
    }
}