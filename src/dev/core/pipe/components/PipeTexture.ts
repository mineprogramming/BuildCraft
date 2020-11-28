type TexturePair = {
    name: string
    data: number
}
class PipeTexture {
    constructor(public block: TexturePair, public connection: TexturePair, public containerConnection: TexturePair = connection){}
}