class WoodenPipeItemEjector {
    private side: number;

    public set connectionSide(value: number){
        this.side = value;
    }

    public get connectionSide(): number {
        return this.side;
    }
}