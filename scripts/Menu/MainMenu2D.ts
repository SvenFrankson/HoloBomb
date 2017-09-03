class MainMenu2D extends MainMenu {
    
    public CreateUI(): void {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let title: BABYLON.GUI.Button =  BABYLON.GUI.Button.CreateSimpleButton("title", "Holo Bombardier");
        title.width = 0.35;
        title.height = 0.1;
        title.fontSize = 64;
        title.background = "#232323";
        title.color = "#232323";
        title.top = 100;
        title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(title);

        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("easy-mode", "Easy");
        MainMenu.SetHoloBombButton(easyMode, 1);
        advancedTexture.addControl(easyMode);

        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("normal-mode", "Normal");
        MainMenu.SetHoloBombButton(normalMode, 2);
        advancedTexture.addControl(normalMode);

        let hardMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("hard-mode", "Hard");
        MainMenu.SetHoloBombButton(hardMode, 3);
        advancedTexture.addControl(hardMode);

        let screenMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/screen-mode.png");
        MainMenu.SetHoloBombSquareButton(screenMode, 4);
        screenMode.left = -125;
        advancedTexture.addControl(screenMode);

        let vrMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/vr-mode.png");
        MainMenu.SetHoloBombSquareButton(vrMode, 4);
        vrMode.left = 125;
        advancedTexture.addControl(vrMode);
        MainMenu.DeactivateButton(vrMode);
    }

    public DisposeUI(): void {

    }
}