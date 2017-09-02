class Main {
    constructor(canvasElement) {
        this.canvas = document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.resize();
        this.light = new BABYLON.HemisphericLight("Light", BABYLON.Vector3.Up(), this.scene);
        this.light.diffuse.copyFromFloats(1, 1, 1);
        this.light.groundColor.copyFromFloats(0.4, 0.4, 0.4);
        this.camera = new BABYLON.ArcRotateCamera("MenuCamera", 0, 0, 1, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas);
        this.camera.setPosition(new BABYLON.Vector3(2, 1, 2));
        this.camera.wheelPrecision *= 50;
        this.camera.minZ = 0.05;
    }
    animate() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        window.addEventListener("resize", () => {
            this.resize();
        });
    }
    resize() {
        this.engine.resize();
    }
}
window.addEventListener("DOMContentLoaded", () => {
    let game = new Main("render-canvas");
    game.createScene();
    game.animate();
    BABYLON.SceneLoader.ImportMesh("", "./datas/test.babylon", "", game.scene, (meshes) => {
        meshes.forEach((m) => {
            if (m.name === "Hologram") {
                m.material = new HoloMaterial("Holo", game.scene);
            }
            if (m.name.startsWith("Babylon")) {
                m.material = new HoloMaterial("Holo", game.scene);
                let k = 0.01;
                game.scene.registerBeforeRender(() => {
                    m.rotation.x += k;
                    m.rotation.y += 2 * k;
                });
            }
            if (m.name === "Grid") {
                let gridMaterial = new BABYLON.StandardMaterial("Grid", this.scene);
                gridMaterial.diffuseTexture = new BABYLON.Texture("./datas/grid.png", this.scene);
                gridMaterial.opacityTexture = gridMaterial.diffuseTexture;
                m.material = gridMaterial;
                let k = 0;
                game.scene.registerBeforeRender(() => {
                    gridMaterial.alpha = 0.85 + 0.15 * Math.cos(k / 10);
                    k++;
                });
            }
            if (m.material instanceof BABYLON.StandardMaterial) {
                if (m.material.ambientTexture) {
                    m.material.lightmapTexture = m.material.ambientTexture;
                    m.material.useLightmapAsShadowmap;
                }
            }
        });
    });
});
class HoloMaterial extends BABYLON.ShaderMaterial {
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
        this.setFloat("height", this._height);
    }
    get stripeLength() {
        return this._stripeLength;
    }
    set stripeLength(v) {
        this._stripeLength = v;
        this.setFloat("stripeLength", this._stripeLength);
    }
    get stripeTex() {
        return this._stripeTex;
    }
    set stripeTex(t) {
        this._stripeTex = t;
        this.setTexture("stripeTex", this._stripeTex);
    }
    get baseColor() {
        return this._baseColor;
    }
    set baseColor(c) {
        this._baseColor = c;
        this.setColor3("baseColor", this._baseColor);
    }
    get borderColor() {
        return this._borderColor;
    }
    set borderColor(c) {
        this._borderColor = c;
        this.setColor3("borderColor", this._borderColor);
    }
    get fresnelBias() {
        return this._fresnelBias;
    }
    set fresnelBias(v) {
        this._fresnelBias = v;
        this.setFloat("fresnelBias", this._fresnelBias);
    }
    get fresnelPower() {
        return this._fresnelPower;
    }
    set fresnelPower(v) {
        this._fresnelPower = v;
        this.setFloat("fresnelPower", this._fresnelPower);
    }
    constructor(name, scene) {
        super(name, scene, "shield", {
            attributes: ["position", "normal", "uv"],
            uniforms: ["world", "worldView", "worldViewProjection"],
            needAlphaBlending: true
        });
        this.backFaceCulling = false;
        this.stripeLength = 0.02;
        this.height = 0;
        this.baseColor = BABYLON.Color3.FromHexString("#75ceff");
        this.borderColor = BABYLON.Color3.FromHexString("#77ff9b");
        this.fresnelBias = 2;
        this.fresnelPower = 16;
        this.stripeTex = new BABYLON.Texture("./datas/gradient.png", scene);
        let k = 0;
        scene.registerBeforeRender(() => {
            this.setVector3("cameraPosition", scene.activeCamera.position);
            k++;
            this.height = Math.cos(k / 1000);
        });
    }
}
