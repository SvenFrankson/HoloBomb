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
                if (pickInfo.pickedMesh.name === "EasyMesh") {
                    Main.instance.StartEasyMode();
                } else if (pickInfo.pickedMesh.name === "NormalMesh") {
                    Main.instance.StartNormalMode();
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
        easyMesh.position.y = 1.8;
        this.meshes.push(easyMesh);
        let advancedTextureEasyMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(easyMesh, 512, 512, false);
        let easyMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("easy-mode", "Easy");
        MainMenu.SetHoloBombButtonDesign(easyMode);
        easyMode.fontSize = 120;
        advancedTextureEasyMode.addControl(easyMode);
        
        let normalMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreatePlane("NormalMesh", {width: 0.5, height: 0.25}, scene);
        normalMesh.position.y = 1.4;
        this.meshes.push(normalMesh);
        let advanceTextureNormalMode = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(normalMesh, 512, 512, false);
        let normalMode: BABYLON.GUI.Button = BABYLON.GUI.Button.CreateSimpleButton("normal-mode", "Normal");
        MainMenu.SetHoloBombButtonDesign(normalMode);
        normalMode.fontSize = 120;
        advanceTextureNormalMode.addControl(normalMode);

        this.observer = this.scene.onPointerObservable.add(this.onPointerObservable);
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