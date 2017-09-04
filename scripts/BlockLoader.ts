class BlockLoader {
    public static blockData: Map<BlockType, BABYLON.VertexData> = new Map<BlockType, BABYLON.VertexData>();

    public static LoadBlockData(scene: BABYLON.Scene, callback: () => void): void {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "./datas/blocks.babylon",
            "",
            scene,
            (
                meshes: BABYLON.AbstractMesh[]
            ) => {
                meshes.forEach(
                    (m: BABYLON.AbstractMesh) => {
                        if (m instanceof BABYLON.Mesh) {
                            if (m.name === "Ruin") {
                                BlockLoader.blockData.set(
                                    BlockType.Ruin,
                                    BABYLON.VertexData.ExtractFromMesh(m)
                                );
                            }
                            if (m.name === "Block") {
                                BlockLoader.blockData.set(
                                    BlockType.Block,
                                    BABYLON.VertexData.ExtractFromMesh(m)
                                );
                            }
                            if (m.name === "Top") {
                                BlockLoader.blockData.set(
                                    BlockType.Top,
                                    BABYLON.VertexData.ExtractFromMesh(m)
                                );
                            }
                            if (m.name === "Explode") {
                                BlockLoader.blockData.set(
                                    BlockType.Explode,
                                    BABYLON.VertexData.ExtractFromMesh(m)
                                );
                            }
                            m.dispose();
                        }
                    }
                );
                if (callback) {
                    callback();
                }
            }
        )
    }
}