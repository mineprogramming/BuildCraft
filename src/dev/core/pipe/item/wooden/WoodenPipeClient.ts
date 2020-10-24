class WoodenPipeClient {
	private storageConnector: WoodenPipeStorageConnector

	public x: number;
	public y: number;
	public z: number;

	constructor(private renderer: PipeRenderer, private texture: PipeTexture) { }

	public load() {
		this.storageConnector = new WoodenPipeStorageConnector(this, this.renderer, this.texture);
		// @ts-ignore
		this.storageConnector.ConnectionSide = this.networkData.getInt("orientation");
		// @ts-ignore
		this.networkData.addOnDataChangedListener((networkData, isExternalChange) => {
			this.storageConnector.ConnectionSide = networkData.getInt("orientation");
		});
	}

	public unload() {
		this.storageConnector.destroy();
	}
}