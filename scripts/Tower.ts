class Tower extends BABYLON.Mesh {
    public city: City;
    private blocks: Block[] = [];

    constructor(city: City) {
        super("Tower", city.getScene());
        this.city = city;
        this.parent = city;
    }

    public Initialize(h: number) {
        for (let i: number = 0; i < h; i++) {
            this.blocks[i] = new Block(BlockType.Block, this);
            this.blocks[i].parent = this;
            this.blocks[i].position.y = 0.15 * i;
        }
        this.blocks[h] = new Block(BlockType.Top, this);
        this.blocks[h].position.y = 0.15 * (h);
    }
}