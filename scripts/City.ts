class City extends BABYLON.Mesh {

    public x0: number = 0;
    public xEnd: number = 0;
    public towers: Tower[] = [];
    public hologramMaterial: HoloMaterial;

    constructor(scene: BABYLON.Scene) {
        super("City", scene);
        this.hologramMaterial = new HoloMaterial("CityHologram", scene);
    }

    public Initialize(
        heights: number[]
    ): void {
        console.log("Initialize City");
        this.x0 = - (heights.length - 1) / 2 * 0.18;
        this.xEnd = -this.x0;
        heights.forEach(
            (
                h: number,
                i: number
            ) => {
                let tower: Tower = new Tower(this);
                tower.Initialize(h);
                tower.position.x = this.x0 + i * 0.18;
                this.towers[i] = tower;
            }
        );
    }
}