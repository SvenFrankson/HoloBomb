class Main {

  public static instance: Main;
  public canvas: HTMLCanvasElement;
  public engine: BABYLON.Engine;
  public scene: BABYLON.Scene;
  public light: BABYLON.HemisphericLight;
  public camera: BABYLON.ArcRotateCamera;
  public city: City;
  public bombardier: Bombardier;
  public mainMenu: MainMenu;

  constructor(canvasElement: string) {
    Main.instance = this;
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new BABYLON.Engine(this.canvas, true, {}, true);
    BABYLON.Engine.ShadersRepository = "./shaders/";
  }

  createScene(): void {
    this.scene = new BABYLON.Scene(this.engine);
    this.resize();

    this.light = new BABYLON.HemisphericLight("Light", BABYLON.Vector3.Up(), this.scene);
    this.light.diffuse.copyFromFloats(1, 1, 1);
    this.light.groundColor.copyFromFloats(0.4, 0.4, 0.4);

    this.camera = new BABYLON.ArcRotateCamera("MenuCamera", 0, 0, 1, new BABYLON.Vector3(0, 1.2, 0), this.scene);
    this.camera.attachControl(this.canvas);
    this.camera.setPosition(new BABYLON.Vector3(1, 1.8, -2));
    this.camera.wheelPrecision *= 100;
    this.camera.pinchPrecision *= 100;
    this.camera.minZ = 0.05;
    this.camera.lowerBetaLimit = 3 * Math.PI / 8;
    this.camera.upperBetaLimit = 5 * Math.PI / 8;
    this.camera.lowerRadiusLimit = 1;
    this.camera.upperRadiusLimit = 3;

    let skybox: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:100.0}, this.scene);
    skybox.infiniteDistance = true;
    let skyboxMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "./datas/skyboxes/green-nebulae",
      this.scene,
      ["-px.png", "-py.png", "-pz.png", "-nx.png", "-ny.png", "-nz.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    let k = 0;
    this.scene.registerBeforeRender(() => {
        skybox.rotation.x += 0.0002 * Math.cos(k);
        skybox.rotation.y += 0.0002 * Math.cos(2 * k);
        skybox.rotation.z += 0.0002 * Math.cos(3 * k);
        k += 0.0001;
    });
    
    this.city = new City(this.scene);
    this.city.position.y = 0.9;
    this.mainMenu = new MainMenu2D();
    BlockLoader.LoadBlockData(
      this.scene,
      () => {
        this.GoToMainMenu();
      }
    );
  }

  public animate(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  public resize(): void {
    this.engine.resize();
  }

  public StartEasyMode(): void {
    console.log("Initialize Easy Mode");
    this.city.Dispose();
    this.city.Initialize(City.CreateCityData(10, 1, 3));
    this.bombardier = new Bombardier(this.city);
    this.bombardier.Initialize(
        5,
        () => {
            this.bombardier.Start();
            this.mainMenu.DisposeUI();
        }
    );
  }

  public StartNormalMode(): void {
    console.log("Initialize Easy Mode");
    this.city.Dispose();
    this.city.Initialize(City.CreateCityData(10, 2, 5));
    this.bombardier = new Bombardier(this.city);
    this.bombardier.Initialize(
        6,
        () => {
            this.bombardier.Start();
            this.mainMenu.DisposeUI();
        }
    );
  }

  public StartHardMode(): void {
    console.log("Initialize Easy Mode");
    this.city.Dispose();
    this.city.Initialize(City.CreateCityData(10, 3, 7));
    this.bombardier = new Bombardier(this.city);
    this.bombardier.Initialize(
        7,
        () => {
            this.bombardier.Start();
            this.mainMenu.DisposeUI();
        }
    );
  }

  public GoToMainMenu(): void {
      this.mainMenu.CreateUI();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game : Main = new Main("render-canvas");
  game.createScene();
  game.animate();

  BABYLON.SceneLoader.ImportMesh(
    "",
    "./datas/test.babylon",
    "",
    game.scene,
    (
      meshes: BABYLON.AbstractMesh[]
    ) => {
      meshes.forEach(
        (m: BABYLON.AbstractMesh) => {
          if (m.name.startsWith("Hologram")) {
            m.material = new HoloMaterial("Holo", game.scene);
          }
          if (m.name.startsWith("Babylon")) {
            m.material = new HoloMaterial("Holo", game.scene);
            let k = 0.01;
            game.scene.registerBeforeRender(
              () => {
                m.rotation.x += k;
                m.rotation.y += 2 * k;
              }
            )
          }
          if (m.name === "Grid") {
            let gridMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("Grid", game.scene);
            gridMaterial.diffuseTexture = new BABYLON.Texture("./datas/grid.png", game.scene);
            gridMaterial.opacityTexture = gridMaterial.diffuseTexture;
            m.material = gridMaterial;
            let k = 0;
            game.scene.registerBeforeRender(
              () => {
                gridMaterial.alpha = 0.85 + 0.15 * Math.cos(k / 10);
                k++;
              }
            )
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
              (m.material.diffuseTexture as BABYLON.Texture).uScale = 5;
              (m.material.diffuseTexture as BABYLON.Texture).vScale = 5;
              m.material.diffuseColor.copyFromFloats(0.5, 0.5, 0.5);
              m.material.specularColor.copyFromFloats(0.5, 0.5, 0.5);
              m.material.bumpTexture = new BABYLON.Texture("./datas/textures/MachineFrame-bump.png", game.scene);
            }
          }
          else if (m.material instanceof BABYLON.MultiMaterial) {
            m.material.subMaterials.forEach(
              (sm: BABYLON.Material) => {
                if (sm.name.endsWith("WallFrame")) {
                  if (sm instanceof BABYLON.StandardMaterial) {
                    sm.diffuseTexture = new BABYLON.Texture("./datas/textures/metal.jpg", game.scene);
                    (sm.diffuseTexture as BABYLON.Texture).uScale = 5;
                    (sm.diffuseTexture as BABYLON.Texture).vScale = 5;
                    sm.diffuseColor.copyFromFloats(0.25, 0.25, 0.25);
                    sm.specularColor.copyFromFloats(0.5, 0.5, 0.5);
                  }
                }
                if (sm.name.endsWith("WallBox")) {
                  if (sm instanceof BABYLON.StandardMaterial) {
                    sm.diffuseTexture = new BABYLON.Texture("./datas/textures/wall-metal.jpg", game.scene);
                    sm.diffuseColor.copyFromFloats(0.25, 0.25, 0.25);
                    sm.specularColor.copyFromFloats(0.5, 0.5, 0.5);
                  }
                }
              }
            )
          }
        }
      )
    }
  );
});
