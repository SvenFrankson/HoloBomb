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

    public static SetHoloBombButton(button: BABYLON.GUI.Button, row: number): void {
        MainMenu.SetHoloBombButtonDesign(button);
        button.width = 0.2;
        button.height = "100px";
        button.top = (100 + row * 125) + "px";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        MainMenu.DeactivateButton(button);
        button.pointerEnterAnimation = () => {
            MainMenu.ActivateButton(button);
        }
        button.pointerOutAnimation = () => {
            MainMenu.DeactivateButton(button);
        }
    }

    public static SetHoloBombSquareButton(button: BABYLON.GUI.Button, row: number): void {
        button.width = "200px";
        button.height = "200px";
        button.background = "#1c1c1c";
        button.top = (100 + row * 125) + "px";
        button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        button.pointerEnterAnimation = undefined;
        button.pointerOutAnimation = undefined;
    }

    public static ActivateButton(button: BABYLON.GUI.Button): void {
        button.alpha = 1;
    }

    public static DeactivateButton(button: BABYLON.GUI.Button): void {
        button.alpha = 0.75;
    }
}