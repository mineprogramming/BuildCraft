/// <reference path="../IEnginePartModel.ts" />
/// <reference path="../ModelBox.ts" />
class EngineTrunkModelPart implements IEnginePartModel {
	constructor(private textureSet: BlockRenderer.ModelTextureSet) { }

	public requireModelBox(): ModelBox {
		return {
			x1: .25, y1: 0, z1: .25,
			x2: .75, y2: 1, z2: .75,
			descr: this.textureSet
		}
	}
}