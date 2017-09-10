abstract class MainMenu {
    public abstract CreateUI(): void;
    public abstract DisposeUI(): void;

    public static SetHoloBombButton(button: BABYLON.GUI.Button, row: number): void {
        button.width = 0.2;
        button.height = "100px";
        button.fontSize = 40;
        button.background = "#1c1c1c";
        button.color = "white";
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