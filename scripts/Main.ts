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
        }
      )
    }
  );
});
