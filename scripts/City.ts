class City extends BABYLON.Mesh {

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
        let x0: number = - (heights.length - 1) / 2 * 0.18;
        heights.forEach(
            (
                h: number,
                i: number
            ) => {
                let tower: Tower = new Tower(this);
                tower.Initialize(h);
                tower.position.x = x0 + i * 0.18;
                this.towers[i] = tower;
            }
        );
    }
}