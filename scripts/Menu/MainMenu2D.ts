class MainMenu2D extends MainMenu {
    
    private _advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;

    public CreateUI(scene: BABYLON.Scene): void {
        this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._advancedTexture.idealHeight = 1024;

        let title: BABYLON.GUI.Button =  BABYLON.GUI.Button.CreateImageOnlyButton("title", "./datas/ui-title.png");
        title.width = "512px";
        title.height = "145px";
        title.top = 1024 - 145 - 815;
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        MainMenu.SetTitle(title);
        this._advancedTexture.addControl(title);

        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("easy-mode", "./datas/ui-easy.png");
        easyMode.width = "512px";
        easyMode.height = "145px";
        easyMode.top = 1024 - 145 - 651;
        easyMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        MainMenu.SetButton(easyMode);
        this._advancedTexture.addControl(easyMode);
        easyMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartEasyMode();
            }
        )

        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("normal-mode", "./datas/ui-medium.png");
        normalMode.width = "512px";
        normalMode.height = "145px";
        normalMode.top = 1024 - 145 - 488;
        normalMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        MainMenu.SetButton(normalMode);
        this._advancedTexture.addControl(normalMode);
        normalMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartNormalMode();
            }
        )

        let hardMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("hard-mode", "./datas/ui-hard.png");
        hardMode.width = "512px";
        hardMode.height = "145px";
        hardMode.top = 1024 - 145 - 325;
        hardMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        MainMenu.SetButton(hardMode);
        this._advancedTexture.addControl(hardMode);
        hardMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.StartHardMode();
            }
        )

        let screenMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/ui-screenmode.png");
        screenMode.width = "245px";
        screenMode.height = "245px";
        screenMode.top = 1024 - 245 - 62;
        screenMode.left = -132;
        screenMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._advancedTexture.addControl(screenMode);
        MainMenu.SetStaticButton(screenMode);
        MainMenu.ActivateButton(screenMode);

        let vrMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/ui-vrmode.png");
        vrMode.width = "245px";
        vrMode.height = "245px";
        vrMode.top = 1024 - 245 - 62;
        vrMode.left = 132;
        vrMode.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this._advancedTexture.addControl(vrMode);
        MainMenu.SetButton(vrMode);
        MainMenu.DeactivateButton(vrMode);
        vrMode.onPointerUpObservable.add(
            (p: BABYLON.Vector2) => {
                Main.instance.switchToVR();
            }
        )
    }

    public DisposeUI(): void {
        Main.instance.resize();
        this._advancedTexture.dispose();
    }
}