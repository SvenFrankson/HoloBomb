class MainMenu2D extends MainMenu {
    
    private _advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;

    public CreateUI(scene: BABYLON.Scene): void {
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._advancedTexture.idealHeight = 900;

        let title: BABYLON.GUI.Button =  BABYLON.GUI.Button.CreateSimpleButton("title", "Holo Bombardier");
        title.width = 0.35;
        title.height = 0.1;
        title.fontSize = 64;
        title.background = "#232323";
        title.color = "white";
        title.top = 100;
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._advancedTexture.addControl(title);

        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("easy-mode", "Easy");
        MainMenu.SetHoloBombButton(easyMode, 1);
        this._advancedTexture.addControl(easyMode);
        easyMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartEasyMode();
            }
        )

        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("normal-mode", "Normal");
        MainMenu.SetHoloBombButton(normalMode, 2);
        this._advancedTexture.addControl(normalMode);
        normalMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartNormalMode();
            }
        )

        let hardMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("hard-mode", "Hard");
        MainMenu.SetHoloBombButton(hardMode, 3);
        this._advancedTexture.addControl(hardMode);
        hardMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartHardMode();
            }
        )

        let screenMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/screen-mode.png");
        MainMenu.SetHoloBombSquareButton(screenMode, 4);
        screenMode.left = -125;
        this._advancedTexture.addControl(screenMode);

        let vrMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/vr-mode.png");
        MainMenu.SetHoloBombSquareButton(vrMode, 4);
        vrMode.left = 125;
        this._advancedTexture.addControl(vrMode);
        MainMenu.DeactivateButton(vrMode);
    }

    public DisposeUI(): void {
        Main.instance.resize();
        this._advancedTexture.dispose();
    }
}