class Tower extends BABYLON.Mesh {
    public xCoordinates: number = 0;
    public city: City;
    public blocks: Block[] = [];

    constructor(city: City) {
        super("Tower", city.getScene());
        this.city = city;
        this.parent = city;
    }

    public Initialize(x: number, h: number) {
        this.xCoordinates = x;
        for (let i: number = 0; i < h; i++) {
            this.blocks[i] = new Block(BlockType.Block, this);
            this.blocks[i].parent = this;
            this.blocks[i].position.y = 0.15 * i;
        }
        this.blocks[h] = new Block(BlockType.Top, this);
        this.blocks[h].position.y = 0.15 * (h);
    }

    public TakeHit(): void {
        if (this.blocks.length > 0) {
            this.blocks.pop().dispose();
            if (this.blocks.length > 0) {
                this.blocks[this.blocks.length - 1].SetType(BlockType.Ruin);
                this.city.ExplodeAt(6, new BABYLON.Vector3(this.xCoordinates, this.blocks.length - 1, 0));
            }
        }
    }
}