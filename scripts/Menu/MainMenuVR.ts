class MainMenuVR extends MainMenu {
    private scene: BABYLON.Scene;
    private meshes: BABYLON.Mesh[] = [];
    private observer: BABYLON.Observer<BABYLON.PointerInfo>;
    private onPointerObservable = (
        eventData: BABYLON.PointerInfo,
        eventState: BABYLON.EventState
    ) => {
        if (eventData.type === BABYLON.PointerEventTypes._POINTERUP) {
            let pickInfo: BABYLON.PickingInfo = this.scene.pickWithRay(
                this.scene.activeCamera.getForwardRay(),
                (m: BABYLON.Mesh) => {
                    return (this.meshes.indexOf(m) !== -1);
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
        this.meshes.forEach(
            (m : BABYLON.Mesh) => {
                m.lookAt(this.scene.activeCamera.position);
            }
        )
    }

    public CreateUI(scene: BABYLON.Scene): void {
        this.scene = scene;

        let easyMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("EasyMesh", {width: 0.5, height: 0.25}, scene);
        easyMesh.position.y = 2.3;
        this.meshes.push(easyMesh);
        let advancedTextureEasyMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(easyMesh, 512, 512, false);
        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("easy-mode", "Easy");
        MainMenu.SetHoloBombButtonDesign(easyMode);
        easyMode.fontSize = 120;
        advancedTextureEasyMode.addControl(easyMode);
        
        let normalMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("NormalMesh", {width: 0.5, height: 0.25}, scene);
        normalMesh.position.y = 1.95;
        this.meshes.push(normalMesh);
        let advanceTextureNormalMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(normalMesh, 512, 512, false);
        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("normal-mode", "Normal");
        MainMenu.SetHoloBombButtonDesign(normalMode);
        normalMode.fontSize = 120;
        advanceTextureNormalMode.addControl(normalMode);
        
        let hardMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("HardMesh", {width: 0.5, height: 0.25}, scene);
        hardMesh.position.y = 1.6;
        this.meshes.push(hardMesh);
        let advanceTextureHardMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(hardMesh, 512, 512, false);
        let hardMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("hard-mode", "Hard");
        MainMenu.SetHoloBombButtonDesign(hardMode);
        hardMode.fontSize = 120;
        advanceTextureHardMode.addControl(hardMode);

        let screenModeMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("ScreenModeMesh", {width: 0.3, height: 0.3}, scene);
        screenModeMesh.position.y = 1.2;
        screenModeMesh.position.subtractInPlace(this.scene.activeCamera.getDirection(BABYLON.Axis.X).scale(0.2));
        this.meshes.push(screenModeMesh);
        let advancedTextureScreenMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(screenModeMesh, 512, 512, false);
        let screenMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("screen-mode", "./datas/screen-mode.png");
        MainMenu.SetHoloBombButtonDesign(screenMode);
        screenMode.fontSize = 120;
        advancedTextureScreenMode.addControl(screenMode);
        MainMenu.DeactivateButton(screenMode);

        let vrModeMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("VRModeMesh", {width: 0.3, height: 0.3}, scene);
        vrModeMesh.position.y = 1.2;
        vrModeMesh.position.addInPlace(this.scene.activeCamera.getDirection(BABYLON.Axis.X).scale(0.2));
        this.meshes.push(vrModeMesh);
        let advancedTextureVRMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(vrModeMesh, 512, 512, false);
        let vrMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateImageOnlyButton("vr-mode", "./datas/vr-mode.png");
        MainMenu.SetHoloBombButtonDesign(vrMode);
        vrMode.fontSize = 120;
        advancedTextureVRMode.addControl(vrMode);

        var nextFrame = () => {
            this.observer = this.scene.onPointerObservable.add(this.onPointerObservable);
            this.scene.unregisterBeforeRender(nextFrame);
        }
        this.scene.registerBeforeRender(nextFrame);
        this.scene.registerBeforeRender(this.updateMeshes);
    }

    public DisposeUI(): void {
        this.meshes.forEach(
            (m : BABYLON.Mesh) => {
                m.dispose();
            }
        )
        this.scene.onPointerObservable.remove(this.observer);
        this.scene.unregisterBeforeRender(this.updateMeshes);
    }
}