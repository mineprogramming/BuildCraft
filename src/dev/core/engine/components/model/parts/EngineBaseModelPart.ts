/// <reference path="../IEnginePartModel.ts" />
/// <reference path="../ModelBox.ts" />
class EngineBaseModelPart implements IEnginePartModel {
	constructor(private textureSet: BlockRenderer.ModelTextureSet) { }

	public requireModelBox(): ModelBox {
		return {
			x1: 0, y1: 0, z1: 0,
			x2: 1, y2: .25, z2: 1,
			descr: this.textureSet
		}
	}
}