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
        this.camera = new BABYLON.ArcRotateCamera("MenuCamera", 0, 0, 1, new BABYLON.Vector3(0, 1.2, 0), this.scene);
        this.camera.attachControl(this.canvas);
        this.camera.setPosition(new BABYLON.Vector3(1, 1.8, -2));
        this.camera.wheelPrecision *= 50;
        this.camera.minZ = 0.05;
        let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 100.0 }, this.scene);
        skybox.rotation.y = Math.PI / 2;
        skybox.infiniteDistance = true;
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./datas/skyboxes/green-nebulae", this.scene, ["-px.png", "-py.png", "-pz.png", "-nx.png", "-ny.png", "-nz.png"]);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
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
                let gridMaterial = new BABYLON.StandardMaterial("Grid", game.scene);
                gridMaterial.diffuseTexture = new BABYLON.Texture("./datas/grid.png", game.scene);
                gridMaterial.opacityTexture = gridMaterial.diffuseTexture;
                m.material = gridMaterial;
                let k = 0;
                game.scene.registerBeforeRender(() => {
                    gridMaterial.alpha = 0.85 + 0.15 * Math.cos(k / 10);
                    k++;
                });
            }
            if (m.material instanceof BABYLON.StandardMaterial) {
                if (m.material.name.endsWith("LightBox")) {
                    m.material.lightmapTexture = new BABYLON.Texture("./datas/textures/LightBox-ao.png", game.scene);
                    m.material.useLightmapAsShadowmap;
                }
                if (m.material.name.endsWith("MachineBox")) {
                    m.material.lightmapTexture = new BABYLON.Texture("./datas/textures/MachineBox-ao.png", game.scene);
                    m.material.useLightmapAsShadowmap;
                }
                if (m.material.name.endsWith("MachineFrame")) {
                    m.material.diffuseTexture = new BABYLON.Texture("./datas/textures/metal.jpg", game.scene);
                    m.material.diffuseTexture.uScale = 5;
                    m.material.diffuseTexture.vScale = 5;
                    m.material.diffuseColor.copyFromFloats(0.5, 0.5, 0.5);
                    m.material.specularColor.copyFromFloats(0.5, 0.5, 0.5);
                    m.material.bumpTexture = new BABYLON.Texture("./datas/textures/MachineFrame-bump.png", game.scene);
                }
            }
            else if (m.material instanceof BABYLON.MultiMaterial) {
                m.material.subMaterials.forEach((sm) => {
                    if (sm.name.endsWith("WallFrame")) {
                        if (sm instanceof BABYLON.StandardMaterial) {
                            sm.diffuseTexture = new BABYLON.Texture("./datas/textures/metal.jpg", game.scene);
                            sm.diffuseTexture.uScale = 5;
                            sm.diffuseTexture.vScale = 5;
                            sm.diffuseColor.copyFromFloats(0.25, 0.25, 0.25);
                            sm.specularColor.copyFromFloats(0.5, 0.5, 0.5);
                        }
                    }
                    if (sm.name.endsWith("WallBox")) {
                        if (sm instanceof BABYLON.StandardMaterial) {
                            sm.diffuseColor.copyFromFloats(0.25, 0.25, 0.25);
                            sm.specularColor.copyFromFloats(0.5, 0.5, 0.5);
                        }
                    }
                });
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
