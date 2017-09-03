class Bombardier extends BABYLON.Mesh {

    public city: City;
    public bomb: BABYLON.Mesh;
    private _coordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public get coordinates(): BABYLON.Vector3 {
        this._coordinates.x = Math.round((this.position.x - this.city.x0) / 0.18);
        this._coordinates.y = Math.round(this.position.y / 0.15);
        return this._coordinates;
    }

    constructor(city: City) {
        super("Bombardier", city.getScene());
        this.city = city;
        this.parent = this.city;
        this.material = this.city.hologramMaterial;
    }

    public Initialize(
        h0: number,
        callback: () => void
    ): void {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "./datas/bombardier.babylon",
            "",
            this.getScene(),
            (
                meshes: BABYLON.AbstractMesh[]
            ) => {
                meshes.forEach(
                    (m: BABYLON.AbstractMesh) => {
                        if (m instanceof BABYLON.Mesh) {
                            if (m.name === "Bombardier") {
                                m.parent = this;
                                m.material = this.material;
                            } else if (m.name === "Bomb") {
                                m.parent = this.city;
                                m.material = this.material;
                                this.bomb = m;
                                this.bomb.position.copyFromFloats(0, -1, 0);
                            }
                        }
                    }
                );
                this.position.copyFromFloats(this.city.x0 - 0.18, h0 * 0.15, 0);
                if (callback) {
                    callback();
                }
            }
        )
    }

    public Start() {
        this.getScene().registerBeforeRender(this.Update);
        window.addEventListener("keydown", this.DropBomb);
    }

    private k: number = 0;
    public Update = () => {
        this.k += 0.01;
        (this.getChildren()[0] as BABYLON.Mesh).position.y = 0.05 * Math.cos(this.k);
        this.rotation.x = Math.PI / 8 * Math.cos(this.k);
        this.rotation.z = Math.PI / 32 * Math.cos(this.k);
        this.position.x += 0.005;
        if (this.position.x > this.city.xEnd + 0.18) {
            this.position.y -= 0.15;
            this.position.x = this.city.x0 - 0.18;
        }
        this.bomb.position.y -= 0.005;
        if (this.bomb.position.y < 0) {
            this.bomb.position.y = -1;
        }
    }

    public DropBomb = () => {
        if (this.bomb.position.y < 0) {
            console.log("Bombardier DropBomb");
            this.bomb.position.copyFrom(this.coordinates);
            this.bomb.position.x *= 0.18;
            this.bomb.position.x += this.city.x0;
            this.bomb.position.y *= 0.15;
        }
    }
}