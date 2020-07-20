class WoodenPipeTileEntity {
    protected data: any = {// * it will be rewriten during runtime

    }

    protected defaultValues: any = {// * it will be rewriten during runtime

    }

    public x: number;
    public y: number;
    public z: number;

    // !TileEntity event
    public tick(){
        Game.tipMessage("tick");
    }
}