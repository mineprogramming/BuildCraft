class PipeSpeed {
    constructor(private target: number, private delta: number) {}

    public get Target(): number {
        return this.target;
    }

    public get Delta(): number {
        return this.delta;
    }
}