class IronPipeClient {
	private renderConnector: IronPipeRenderConnector

	public readonly dimension: number;
	public x: number;
	public y: number;
	public z: number;

	constructor(private renderer: PipeRenderer, private texture: PipeTexture, private connector: PipeConnector) { }

	public load() {
		const id = BlockSource.getDefaultForDimension(this.dimension).getBlockId(this.x, this.y, this.z);
		const pipe = PipeIdMap.getClassById(id);
		this.renderConnector = new IronPipeRenderConnector(pipe, this, this.renderer, this.connector, this.texture);
		// @ts-ignore
		this.renderConnector.ConnectionSide = this.networkData.getInt("orientation");
		// @ts-ignore
		this.networkData.addOnDataChangedListener((networkData, isExternalChange) => {
			this.renderConnector.ConnectionSide = networkData.getInt("orientation");
		});
	}

	public unload() {
		this.renderConnector.destroy();
	}
}
