class City extends BABYLON.Mesh {

    public static XValue: number = 0.18;
    public static YValue: number = 0.15;
    
    public towers: Tower[] = [];
    public xEnd: number = 0;
    public hologramMaterial: HoloMaterial;

    constructor(scene: BABYLON.Scene) {
        super("City", scene);
        this.hologramMaterial = new HoloMaterial("CityHologram", scene);
    }

    public Initialize(
        heights: number[]
    ): void {
        console.log("Initialize City");
        this.towers = [];
        this.position.x = - (heights.length - 1) / 2 * City.XValue;
        this.xEnd = (heights.length - 1) * City.XValue;
        heights.forEach(
            (
                h: number,
                i: number
            ) => {
                let tower: Tower = new Tower(this);
                tower.position.x = i * 0.18;
                this.freezeWorldMatrix();
                tower.Initialize(i, h);
                this.towers[i] = tower;
            }
        );
    }

    public Dispose(): void {
        this.towers.forEach(
            (t: Tower) => {
                t.Dispose();
            }
        )
    }

    public IsDestroyed(): boolean {
        for (let i: number = 0; i < this.towers.length; i++) {
            if (this.towers[i].blocks.length > 0) {
                return false;
            }
        }
        return true;
    }

    public ExplodeAt(
        count: number,
        coordinates: BABYLON.Vector3
    ): void {
        for (let i: number = 0; i < count; i++) {
            let explode: BABYLON.Mesh = new BABYLON.Mesh("Explode", this.getScene());
            BlockLoader.blockData.get(BlockType.Explode).applyToMesh(explode);
            explode.parent = this;
            explode.material = this.hologramMaterial;
            CityCoordinates.CoordinatesToCityPositionToRef(coordinates, explode.position);
            let dir: BABYLON.Vector3 = new BABYLON.Vector3(
                Math.random() - 0.5,
                (Math.random() - 0.5) * 0.3,
                Math.random() - 0.5
            );
            explode.rotation.copyFromFloats(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
            dir.scaleInPlace(0.025);
            let k = 0;
            let update = () => {
                explode.rotation.addInPlace(dir);
                explode.position.addInPlace(dir);
                explode.position.y += (20 - k) / 60 * 0.05;
                k++;
                if (k > 60) {
                    this.getScene().unregisterBeforeRender(update);
                    explode.dispose();
                }
            }
            this.getScene().registerBeforeRender(update);
        }
    }

    public static CreateCityData(size: number, min: number, max: number): number[] {
        let heights: number[] = [];
        for (let i: number = 0; i < size; i++) {
            heights.push(
                Math.floor(Math.random() * (max - min) + min)
            );
        }
        return heights;
    }
}