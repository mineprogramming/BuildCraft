var ModelHelper = {
    Texture: function(name, offset, size) {
        this.name = name;
        this.offset = offset;
        this.size = size;
        
        this.getUV = function(){
            return this.offset;
        }
        
        this.getSize = function(){
            return this.size;
        }
        
        this.getTexture = function(){
            return this.name;
        }
        
        this.textureMatches = function(texture){
            return this.name == texture.name;
        }
    } 
}