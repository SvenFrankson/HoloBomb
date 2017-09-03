enum BlockType {
    Block,
    Top,
    Ruin
};

class Block extends BABYLON.Mesh {

    constructor(
        type: BlockType,
        scene: BABYLON.Scene
    ) {
        super("Block-" + BlockType[type], scene);
    }
}