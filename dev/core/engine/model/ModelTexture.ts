const TexturesOffset = {
    engine: {
        base: {
            creative: {x: 320, y: 96},
            iron : "iron",
            redstone : "redstone",
            stirling : "stirling",
            custom : "custom"
        },
        piston: {

        }
    },
    trunk: {
        BLUE : {x: 64, y: 0},
        GREEN : {x: 64, y: 32},
        ORANGE : {x: 64, y: 64},
        RED: {x: 64, y: 96},
        BLACK: {x: 64, y: 128}
    }
}
class ModelTexture {
    private readonly name = "buildcraft_engine_atlas.png";
    constructor(private readonly offset){
    }

    getUV(){
        return this.offset;
    }

    getSize(){
        return  {width: 512, height: 512};
    }

    getTexture(){
        return this.name;
    }

    textureMatches(texture){
        return this.name == texture.name;
    }
}