class WoodenPipeStorageConnector {
    constructor() {

    }

    private side: number = 1;// connected side index

    public set connectionSide(value: number){
        this.side = value;
    }

    public get connectionSide(): number {
        return this.side;
    }
}