enum BlockType {
    Block,
    Top,
    Ruin
};

class Block extends BABYLON.Mesh {

    public get city(): City {
        return this.tower.city;
    }
    public tower: Tower;
    public blockType: BlockType;
    
    constructor(
        type: BlockType,
        tower: Tower
    ) {
        super("Block-" + BlockType[type], tower.getScene());
        console.log("Create Block " + BlockType[type]);
        this.blockType = type;
        this.tower = tower;
        this.parent = tower;
        BlockLoader.blockData.get(this.blockType).applyToMesh(this);
        this.material = this.city.hologramMaterial;
    }

    public SetType(type: BlockType) {
        this.blockType = type;
        BlockLoader.blockData.get(this.blockType).applyToMesh(this);
    }
}