/// <reference path="../IEnginePartModel.ts" />
/// <reference path="../ModelBox.ts" />
class EngineChamberModelPart implements IEnginePartModel {
	constructor(private textureSet: BlockRenderer.ModelTextureSet) { }

	public requireModelBox(): ModelBox {
		return {
			x1: .125, y1: 0, z1: .125,
			x2: .875, y2: .5, z2: .875,
			descr: this.textureSet
		}
	}
}