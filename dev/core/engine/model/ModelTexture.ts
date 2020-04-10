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