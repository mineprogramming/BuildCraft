class EngineItemModelTexture {
	private trunkTextureName = "engine_trunk";
	constructor(private textureName: string) { }

	get BaseBoxTextureSet(): BlockRenderer.ModelTextureSet {
		return [
			[this.textureName, 0],
			[this.textureName, 0],
			[this.textureName, 1],
			[this.textureName, 1],
			[this.textureName, 1],
			[this.textureName, 1]
		]
	}

	get TrunkBoxTextureSet(): BlockRenderer.ModelTextureSet {
		return [
			[this.trunkTextureName, 1],
			[this.trunkTextureName, 1],
			[this.trunkTextureName, 0],
			[this.trunkTextureName, 0],
			[this.trunkTextureName, 0],
			[this.trunkTextureName, 0]
		]
	}

	get PistonBoxTextureSet(): BlockRenderer.ModelTextureSet {
		return [
			[this.textureName, 0],
			[this.textureName, 0],
			[this.textureName, 2],
			[this.textureName, 2],
			[this.textureName, 2],
			[this.textureName, 2]
		]
	}
}