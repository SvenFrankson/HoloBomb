abstract class MainMenu {
    public abstract CreateUI(scene: BABYLON.Scene): void;
    public abstract DisposeUI(): void;
    public Resize(): void {
        
    }

    public static SetHoloBombButtonDesign(button: BABYLON.GUI.Button): void {
        button.fontSize = 40;
        button.background = "#1c1c1c";
        button.color = "white";
    }

    public static SetTitle(button: BABYLON.GUI.Button): void {
        button.alpha = 1;
        button.thickness = 0;
        button.pointerEnterAnimation =
        button.pointerOutAnimation =
        button.pointerDownAnimation =
        button.pointerUpAnimation = () => {};
    }

    public static SetButton(button: BABYLON.GUI.Button): void {
        button.thickness = 0;
        MainMenu.DeactivateButton(button);
        button.pointerEnterAnimation = () => {
            MainMenu.ActivateButton(button);
        }
        button.pointerOutAnimation = () => {
            MainMenu.DeactivateButton(button);
        }
    }

    public static SetStaticButton(button: BABYLON.GUI.Button): void {
        button.thickness = 0;
        button.pointerEnterAnimation =
        button.pointerOutAnimation =
        button.pointerDownAnimation =
        button.pointerUpAnimation = () => {};
    }

    public static ActivateButton(button: BABYLON.GUI.Button): void {
        button.alpha = 1;
    }

    public static DeactivateButton(button: BABYLON.GUI.Button): void {
        button.alpha = 0.6;
    }
}