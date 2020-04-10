/// <reference path="BCEngine.ts" />
/// <reference path="EngineType.ts" />
class CreativeEngine extends BCEngine {
    constructor(){
        super(EngineType.creative)
    }
    /*protected init(): void {
        alert("init CreativeEngine")
    }
    protected tick(): void {
        if(World.getThreadTime() % 100 == 0){
            alert("CreativeEngine");
        }
    }*/
}