/// <reference path="parts/EngineBaseModelPart.ts" />
class EngineItemModel {
	private model: BlockRenderer.Model;

	private baseModel: IEnginePartModel;
	private trunkModel: IEnginePartModel;
	private pistonModel: IEnginePartModel;
	private chamberModel: IEnginePartModel;

	constructor(private engineTexture: EngineTexture) {
		this.model = new BlockRenderer.Model();
		this.setupModels();

		for (const box of this.Boxes) {
			const { x1, y1, z1, x2, y2, z2, descr } = box;
			this.model.addBox(x1, y1, z1, x2, y2, z2, descr);
		}
	}

	private get Boxes(): ModelBox[] {
		return [
			this.baseModel.requireModelBox()
		]
	}

	get Model(): BlockRenderer.Model {
		return this.model;
	}

	private setupModels(): void {
		const texture = this.engineTexture.getItemModelTexture()
		this.baseModel = new EngineBaseModelPart(texture.BaseBoxTextureSet);
	}
}