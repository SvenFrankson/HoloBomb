class MainMenuVR extends MainMenu {
    private scene: BABYLON.Scene;
    public meshesButtonsMap: Map<BABYLON.Mesh, BABYLON.GUI.Button> = new Map<BABYLON.Mesh, BABYLON.GUI.Button>();
    private observer: BABYLON.Observer<BABYLON.PointerInfo>;
    private onPointerObservable = (
        eventData: BABYLON.PointerInfo,
        eventState: BABYLON.EventState
    ) => {
        if (eventData.type === BABYLON.PointerEventTypes._POINTERUP) {
            let pickInfo: BABYLON.PickingInfo = this.scene.pickWithRay(
                this.scene.activeCamera.getForwardRay(),
                (m: BABYLON.Mesh) => {
                    return this.meshesButtonsMap.has(m);
                }
            );
            if (pickInfo.hit) {
                console.log("Pick in VR Menu : " + pickInfo.pickedMesh.name);
                if (pickInfo.pickedMesh.name === "EasyMesh") {
                    Main.instance.StartEasyMode();
                } else if (pickInfo.pickedMesh.name === "NormalMesh") {
                    Main.instance.StartNormalMode();
                } else if (pickInfo.pickedMesh.name === "HardMesh") {
                    Main.instance.StartHardMode();
                } else if (pickInfo.pickedMesh.name === "ScreenModeMesh") {
                    Main.instance.switchToStandard();
                }
            }
        }
    };
    private updateMeshes = () => {
        this.meshesButtonsMap.forEach(
            (b: BABYLON.GUI.Button, m : BABYLON.Mesh) => {
                m.lookAt(this.scene.activeCamera.position);
            }
        )
    }

    public CreateUI(scene: BABYLON.Scene): void {
        this.scene = scene;

        let titleMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("TitleMesh", {width: 0.88, height: 0.25}, scene);
        titleMesh.position.y = 2.4;
        let advancedTextureTitle = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(titleMesh, 512, 512, false);
        let title: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("title", "./datas/ui-title.png");
        MainMenu.SetTitle(title);
        advancedTextureTitle.addControl(title);
        this.meshesButtonsMap.set(titleMesh, title);

        let easyMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("EasyMesh", {width: 0.88, height: 0.25}, scene);
        easyMesh.position.y = 2.125;
        let advancedTextureEasyMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(easyMesh, 512, 512, false);
        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("easy-mode", "./datas/ui-easy.png");
        MainMenu.SetButton(easyMode);
        advancedTextureEasyMode.addControl(easyMode);
        this.meshesButtonsMap.set(easyMesh, easyMode);
        
        let normalMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("NormalMesh", {width: 0.88, height: 0.25}, scene);
        normalMesh.position.y = 1.85;
        let advanceTextureNormalMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(normalMesh, 512, 512, false);
        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("easy-mode", "./datas/ui-medium.png");
        MainMenu.SetButton(normalMode);
        advanceTextureNormalMode.addControl(normalMode);
        this.meshesButtonsMap.set(normalMesh, normalMode);
        
        let hardMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("HardMesh", {width: 0.88, height: 0.25}, scene);
        hardMesh.position.y = 1.575;
        let advanceTextureHardMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(hardMesh, 512, 512, false);
        let hardMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("easy-mode", "./datas/ui-hard.png");
        MainMenu.SetButton(hardMode);
        advanceTextureHardMode.addControl(hardMode);
        this.meshesButtonsMap.set(hardMesh, hardMode);

        let screenModeMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("ScreenModeMesh", {width: 0.42, height: 0.42}, scene);
        screenModeMesh.position.y = 1.2;
        screenModeMesh.position.subtractInPlace(this.scene.activeCamera.getDirection(BABYLON.Axis.X).scale(0.225));
        let advancedTextureScreenMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(screenModeMesh, 512, 512, false);
        let screenMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/ui-screenmode.png");
        MainMenu.SetButton(screenMode);
        advancedTextureScreenMode.addControl(screenMode);
        MainMenu.DeactivateButton(screenMode);
        this.meshesButtonsMap.set(screenModeMesh, screenMode);

        let vrModeMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("VRModeMesh", {width: 0.42, height: 0.42}, scene);
        vrModeMesh.position.y = 1.2;
        vrModeMesh.position.addInPlace(this.scene.activeCamera.getDirection(BABYLON.Axis.X).scale(0.225));
        let advancedTextureVRMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(vrModeMesh, 512, 512, false);
        let vrMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/ui-vrmode.png");
        MainMenu.SetStaticButton(vrMode);
        advancedTextureVRMode.addControl(vrMode);
        this.meshesButtonsMap.set(vrModeMesh, vrMode);

        var nextFrame = () => {
            this.observer = this.scene.onPointerObservable.add(this.onPointerObservable);
            this.scene.unregisterBeforeRender(nextFrame);
        }
        this.scene.registerBeforeRender(nextFrame);
        this.scene.registerBeforeRender(this.updateMeshes);
    }

    public DisposeUI(): void {
        this.meshesButtonsMap.forEach(
            (b: BABYLON.GUI.Button, m : BABYLON.AbstractMesh) => {
                m.dispose();
            }
        )
        this.scene.onPointerObservable.remove(this.observer);
        this.scene.unregisterBeforeRender(this.updateMeshes);
    }
}