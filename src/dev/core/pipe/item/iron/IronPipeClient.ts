class IronPipeClient {
	private renderConnector: IronPipeRenderConnector

	public x: number;
	public y: number;
	public z: number;

	constructor(private renderer: PipeRenderer, private texture: PipeTexture, private connector: PipeConnector) { }

	public load() {
		this.renderConnector = new IronPipeRenderConnector(this, this.renderer, this.connector, this.texture);
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
