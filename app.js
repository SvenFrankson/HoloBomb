var BlockType;
(function (BlockType) {
    BlockType[BlockType["Block"] = 0] = "Block";
    BlockType[BlockType["Top"] = 1] = "Top";
    BlockType[BlockType["Ruin"] = 2] = "Ruin";
})(BlockType || (BlockType = {}));
;
class Block extends BABYLON.Mesh {
    get city() {
        return this.tower.city;
    }
    constructor(type, tower) {
        super("Block-" + BlockType[type], tower.getScene());
        console.log("Create Block " + BlockType[type]);
        this.blockType = type;
        this.tower = tower;
        this.parent = tower;
        BlockLoader.blockData.get(this.blockType).applyToMesh(this);
        this.material = this.city.hologramMaterial;
    }
    SetType(type) {
        this.blockType = type;
        BlockLoader.blockData.get(this.blockType).applyToMesh(this);
    }
}
class BlockLoader {
    static LoadBlockData(scene, callback) {
        BABYLON.SceneLoader.ImportMesh("", "./datas/blocks.babylon", "", scene, (meshes) => {
            meshes.forEach((m) => {
                if (m instanceof BABYLON.Mesh) {
                    if (m.name === "Ruin") {
                        BlockLoader.blockData.set(BlockType.Ruin, BABYLON.VertexData.ExtractFromMesh(m));
                    }
                    if (m.name === "Block") {
                        BlockLoader.blockData.set(BlockType.Block, BABYLON.VertexData.ExtractFromMesh(m));
                    }
                    if (m.name === "Top") {
                        BlockLoader.blockData.set(BlockType.Top, BABYLON.VertexData.ExtractFromMesh(m));
                    }
                    m.dispose();
                }
            });
            if (callback) {
                callback();
            }
        });
    }
}
BlockLoader.blockData = new Map();
class Bombardier extends BABYLON.Mesh {
    constructor(city) {
        super("Bombardier", city.getScene());
        this._coordinates = BABYLON.Vector3.Zero();
        this.k = 0;
        this.Update = () => {
            this.k += 0.01;
            this.getChildren()[0].position.y = 0.05 * Math.cos(this.k);
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
        };
        this.DropBomb = () => {
            if (this.bomb.position.y < 0) {
                console.log("Bombardier DropBomb");
                this.bomb.position.copyFrom(this.coordinates);
                this.bomb.position.x *= 0.18;
                this.bomb.position.x += this.city.x0;
                this.bomb.position.y *= 0.15;
            }
        };
        this.city = city;
        this.parent = this.city;
        this.material = this.city.hologramMaterial;
    }
    get coordinates() {
        this._coordinates.x = Math.round((this.position.x - this.city.x0) / 0.18);
        this._coordinates.y = Math.round(this.position.y / 0.15);
        return this._coordinates;
    }
    Initialize(h0, callback) {
        BABYLON.SceneLoader.ImportMesh("", "./datas/bombardier.babylon", "", this.getScene(), (meshes) => {
            meshes.forEach((m) => {
                if (m instanceof BABYLON.Mesh) {
                    if (m.name === "Bombardier") {
                        m.parent = this;
                        m.material = this.material;
                    }
                    else if (m.name === "Bomb") {
                        m.parent = this.city;
                        m.material = this.material;
                        this.bomb = m;
                        this.bomb.position.copyFromFloats(0, -1, 0);
                    }
                }
            });
            this.position.copyFromFloats(this.city.x0 - 0.18, h0 * 0.15, 0);
            if (callback) {
                callback();
            }
        });
    }
    Start() {
        this.getScene().registerBeforeRender(this.Update);
        window.addEventListener("keydown", this.DropBomb);
    }
}
class City extends BABYLON.Mesh {
    constructor(scene) {
        super("City", scene);
        this.x0 = 0;
        this.xEnd = 0;
        this.towers = [];
        this.hologramMaterial = new HoloMaterial("CityHologram", scene);
    }
    Initialize(heights) {
        console.log("Initialize City");
        this.x0 = -(heights.length - 1) / 2 * 0.18;
        this.xEnd = -this.x0;
        heights.forEach((h, i) => {
            let tower = new Tower(this);
            tower.Initialize(h);
            tower.position.x = this.x0 + i * 0.18;
            this.towers[i] = tower;
        });
    }
}
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
        let menu = new MainMenu2D();
        //menu.CreateUI();
        BlockLoader.LoadBlockData(this.scene, () => {
            let city = new City(this.scene);
            city.position.y = 0.9;
            city.Initialize([3, 2, 4, 5, 2, 0, 1, 3]);
            let bombardier = new Bombardier(city);
            bombardier.Initialize(7, () => {
                bombardier.Start();
                setInterval(() => {
                    let tIndex = Math.floor(Math.random() * 8);
                    city.towers[tIndex].TakeHit();
                }, 500);
            });
        });
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
            if (m.name.startsWith("Hologram")) {
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
class Tower extends BABYLON.Mesh {
    constructor(city) {
        super("Tower", city.getScene());
        this.blocks = [];
        this.city = city;
        this.parent = city;
    }
    Initialize(h) {
        for (let i = 0; i < h; i++) {
            this.blocks[i] = new Block(BlockType.Block, this);
            this.blocks[i].parent = this;
            this.blocks[i].position.y = 0.15 * i;
        }
        this.blocks[h] = new Block(BlockType.Top, this);
        this.blocks[h].position.y = 0.15 * (h);
    }
    TakeHit() {
        if (this.blocks.length > 0) {
            this.blocks.pop().dispose();
            if (this.blocks.length > 0) {
                this.blocks[this.blocks.length - 1].SetType(BlockType.Ruin);
            }
        }
    }
}
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
class MainMenu {
    static SetHoloBombButton(button, row) {
        button.width = 0.2;
        button.height = "100px";
        button.fontSize = 40;
        button.background = "#1c1c1c";
        button.top = (100 + row * 125) + "px";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        MainMenu.DeactivateButton(button);
        button.pointerEnterAnimation = () => {
            MainMenu.ActivateButton(button);
        };
        button.pointerOutAnimation = () => {
            MainMenu.DeactivateButton(button);
        };
    }
    static SetHoloBombSquareButton(button, row) {
        button.width = "200px";
        button.height = "200px";
        button.background = "#1c1c1c";
        button.top = (100 + row * 125) + "px";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.pointerEnterAnimation = undefined;
        button.pointerOutAnimation = undefined;
    }
    static ActivateButton(button) {
        button.alpha = 1;
    }
    static DeactivateButton(button) {
        button.alpha = 0.75;
    }
}
class MainMenu2D extends MainMenu {
    CreateUI() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let title = BABYLON.GUI.Button.CreateSimpleButton("title", "Holo Bombardier");
        title.width = 0.35;
        title.height = 0.1;
        title.fontSize = 64;
        title.background = "#232323";
        title.color = "#232323";
        title.top = 100;
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(title);
        let easyMode = BABYLON.GUI.Button.CreateSimpleButton("easy-mode", "Easy");
        MainMenu.SetHoloBombButton(easyMode, 1);
        advancedTexture.addControl(easyMode);
        let normalMode = BABYLON.GUI.Button.CreateSimpleButton("normal-mode", "Normal");
        MainMenu.SetHoloBombButton(normalMode, 2);
        advancedTexture.addControl(normalMode);
        let hardMode = BABYLON.GUI.Button.CreateSimpleButton("hard-mode", "Hard");
        MainMenu.SetHoloBombButton(hardMode, 3);
        advancedTexture.addControl(hardMode);
        let screenMode = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/screen-mode.png");
        MainMenu.SetHoloBombSquareButton(screenMode, 4);
        screenMode.left = -125;
        advancedTexture.addControl(screenMode);
        let vrMode = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/vr-mode.png");
        MainMenu.SetHoloBombSquareButton(vrMode, 4);
        vrMode.left = 125;
        advancedTexture.addControl(vrMode);
        MainMenu.DeactivateButton(vrMode);
    }
    DisposeUI() {
    }
}
