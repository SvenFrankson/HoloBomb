class Main {

  public canvas: HTMLCanvasElement;
  public engine: BABYLON.Engine;
  public scene: BABYLON.Scene;
  public light: BABYLON.HemisphericLight;
  public camera: BABYLON.ArcRotateCamera;

  constructor(canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new BABYLON.Engine(this.canvas, true);
    BABYLON.Engine.ShadersRepository = "./shaders/";
  }

  createScene(): void {
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
          if (m.name === "Hologram") {
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
            let gridMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("Grid", this.scene);
            gridMaterial.diffuseTexture = new BABYLON.Texture("./datas/grid.png", this.scene);
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
            if (m.material.ambientTexture) {
              m.material.lightmapTexture = m.material.ambientTexture;
              m.material.useLightmapAsShadowmap;
            }
          }
        }
      )
    }
  );
});
