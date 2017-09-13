class Bombardier extends BABYLON.Mesh {

    public city: City;
    public bomb: BABYLON.Mesh;
    private _coordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public get coordinates(): BABYLON.Vector3 {
        CityCoordinates.CityPositionToCoordinatesToRef(this.position, this._coordinates);
        return this._coordinates;
    }
    private _bombCoordinates: BABYLON.Vector3 = BABYLON.Vector3.Zero();
    public get bombCoordinates(): BABYLON.Vector3 {
        CityCoordinates.CityPositionToCoordinatesToRef(this.bomb.position, this._bombCoordinates);
        return this._bombCoordinates;
    }

    constructor(city: City) {
        super("Bombardier", city.getScene());
        this.city = city;
        this.parent = this.city;
        this.material = this.city.hologramMaterial;
        if (Main.instance.isVR) {
            this._inputDelay = Infinity;
        }
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
                this.position.copyFromFloats(- 0.18, h0 * 0.15, 0);
                if (callback) {
                    callback();
                }
            }
        )
    }

    public Start() {
        this.getScene().registerBeforeRender(this.Update);
        window.addEventListener("keydown", this.InputDown);
        window.addEventListener("pointerdown", this.InputDown);
        window.addEventListener("keyup", this.DropBomb);
        window.addEventListener("pointerup", this.DropBomb);
    }

    private k: number = 0;
    private _hasWon: boolean = false;
    public Update = () => {
        // Update plane.
        // Move plane.
        this.k += 0.01;
        if (this._hasWon) {
            this.position.x += 0.005;
            this.position.y += 0.005;
            this.rotation.x += 0.01;
            this.rotation.z += 0.005;
            if (this.position.x > this.city.xEnd + 0.18) {
                this.position.y += 0.15;
                this.position.x = - 0.18;
            }
        } else {
            (this.getChildren()[0] as BABYLON.Mesh).position.y = 0.05 * Math.cos(this.k);
            this.rotation.x = Math.PI / 8 * Math.cos(this.k);
            this.rotation.z = Math.PI / 32 * Math.cos(this.k);
            this.position.x += 0.005;
            if (this.position.x > this.city.xEnd + 0.18) {
                this.position.y -= 0.15;
                this.position.x = - 0.18;
            }
        }
        // Check Bombardier collision.
        let xBombardier: number = this.coordinates.x;
        let tBombardier: Tower = this.city.towers[xBombardier];
        if (tBombardier) {
            let yBombardier: number = this._coordinates.y;
            let bBombardier: Block = tBombardier.blocks[yBombardier];
            if (bBombardier) {
                this.city.ExplodeAt(32, this._coordinates);
                this.Dispose();
                setTimeout(
                    () => {
                        Main.instance.GoToMainMenu();
                    },
                    2000
                );
            }
        }
        // Update bomb.
        // Move bomb.
        this.bomb.position.y -= 0.005;
        if (this.bomb.position.y < 0) {
            this.bomb.position.y = -1;
        }
        // Check bomb collision.
        let xBomb: number = this.bombCoordinates.x;
        let tBomb: Tower = this.city.towers[xBomb];
        if (tBomb) {
            let yBomb: number = this._bombCoordinates.y;
            let bBomb: Block = tBomb.blocks[yBomb];
            if (bBomb) {
                tBomb.TakeHit();
                this.bomb.position.y = -1;
                // Check for victory.
                if (this.city.IsDestroyed()) {
                    this._hasWon = true;
                    setTimeout(
                        () => {
                            this.Dispose();
                            Main.instance.GoToMainMenu();
                        },
                        3000
                    );
                }
            }
        }
    }

    private _downTime: number = 0;
    private _inputDelay: number = 500;
    public InputDown = () => {
        this._downTime = (new Date()).getTime();
    }
    public DropBomb = () => {
        let upTime: number = (new Date()).getTime();
        if (upTime - this._downTime < this._inputDelay) {
            if (this.bomb.position.y < 0) {
                console.log("Bombardier DropBomb");
                this.bomb.position.copyFrom(this.coordinates);
                this.bomb.position.x *= 0.18;
                this.bomb.position.y *= 0.15;
            }
        }
    }

    public Dispose(): void {
        this.dispose();
        this.bomb.dispose();
        this.getScene().unregisterBeforeRender(this.Update);
        window.removeEventListener("keydown", this.InputDown);
        window.removeEventListener("pointerdown", this.InputDown);
        window.removeEventListener("keyup", this.DropBomb);
        window.removeEventListener("pointerup", this.DropBomb);
    }
}