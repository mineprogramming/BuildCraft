/// <reference path="../../components/TravelerSet.ts" />
class WoodenPipeItemEjector {
    private side: number;
    private items: TravelerSet = new TravelerSet(this);
    constructor(public readonly x: number, public readonly y: number, public readonly z: number){}

    private get container(){
        const {x, y, z} = World.getRelativeCoords(this.x, this.y, this.z, this.connectionSide);
        return World.getContainer(x, y, z);
    }

    public getContainerItems(){

    }

    public getNumberOfStacks(){

    }

    public injectItem(){

    }

    public set connectionSide(value: number){
        this.side = value;
    }

    public get connectionSide(): number {
        return this.side;
    }
}