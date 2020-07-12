/// <reference path="PipeConnector.ts" />
class TransportPipeConnector implements PipeConnector {
    public canConnectToGroup(groupName: string): boolean {
        return groupName == "ItemMachine"
    }

    get connectionGroupNames(): {name: string, exclude: boolean}[] {
        return [
            {name: "BCPipeCobble", exclude: true}
        ]
    };

    public getModifiedModel(box: any, pipeTexture: PipeTexture): BlockRenderer.BlockModel {
        // Connecting to TileEntities
        const model = BlockRenderer.createModel();
        const texture = pipeTexture.containerConnection;
        model.addBox(box.box[0], box.box[1], box.box[2], box.box[3], box.box[4], box.box[5], texture.name, texture.data);
        return model;
    }

    public getModelCondition(box: any): ICRenderCondition {
        return ICRender.BLOCK(box.side[0], box.side[1], box.side[2], ICRender.getGroup("ItemMachine"), false);
    }

    public canPipesConnect(coords0: Vector, coords1: Vector){
        return false;
    }

    public get data(): object {
        return {};
    }
}