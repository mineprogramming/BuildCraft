/// <reference path="connector/IPipeConnector.ts" />
class PipeRenderer {
    constructor(private connector: IPipeConnector){}

    public get standartICrender(){
        const render = new ICRender.Model();
        return render;
    }

    public renderAt(coords: Vector){}

    public getICrenderAtCoords(coords: Vector){

    }
}
