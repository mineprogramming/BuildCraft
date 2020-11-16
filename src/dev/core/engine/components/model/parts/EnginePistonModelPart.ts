/// <reference path="../IEnginePartModel.ts" />
/// <reference path="../ModelBox.ts" />
class EnginePistonModelPart implements IEnginePartModel {
	constructor(private textureSet: BlockRenderer.ModelTextureSet) { }

	public requireModelBox(): ModelBox {
		return {
			x1: 0, y1: .5, z1: 0,
			x2: 1, y2: .75, z2: 1,
			descr: this.textureSet
		}
	}
}