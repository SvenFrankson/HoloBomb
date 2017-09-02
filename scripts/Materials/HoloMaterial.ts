class HoloMaterial extends BABYLON.ShaderMaterial {
  
  private _height: number;
  public get height(): number {
    return this._height;
  }
  public set height(v: number) {
    this._height = v;
    this.setFloat("height", this._height);
  }

  private _stripeLength: number;
  public get stripeLength(): number {
    return this._stripeLength;
  }
  public set stripeLength(v: number) {
    this._stripeLength = v;
    this.setFloat("stripeLength", this._stripeLength);
  }

  private _stripeTex: BABYLON.Texture;
  public get stripeTex(): BABYLON.Texture {
    return this._stripeTex;
  }
  public set stripeTex(t: BABYLON.Texture) {
    this._stripeTex = t;
    this.setTexture("stripeTex", this._stripeTex);
  }
  
  private _baseColor: BABYLON.Color3;
  public get baseColor(): BABYLON.Color3 {
    return this._baseColor;
  }
  public set baseColor(c: BABYLON.Color3) {
    this._baseColor = c;
    this.setColor3("baseColor", this._baseColor);
  }
  
  private _borderColor: BABYLON.Color3;
  public get borderColor(): BABYLON.Color3 {
    return this._borderColor;
  }
  public set borderColor(c: BABYLON.Color3) {
    this._borderColor = c;
    this.setColor3("borderColor", this._borderColor);
  }

  private _fresnelBias: number;
  public get fresnelBias(): number {
    return this._fresnelBias;
  }
  public set fresnelBias(v: number) {
    this._fresnelBias = v;
    this.setFloat("fresnelBias", this._fresnelBias);
  }
  private _fresnelPower: number;
  public get fresnelPower(): number {
    return this._fresnelPower;
  }
  public set fresnelPower(v: number) {
    this._fresnelPower = v;
    this.setFloat("fresnelPower", this._fresnelPower);
  }

  constructor(name: string, scene: BABYLON.Scene) {
    super(
      name,
      scene,
      "shield",
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection"],
        needAlphaBlending: true
      }
    );
    this.backFaceCulling = false;
    this.stripeLength = 0.02;
    this.height = 0;
    this.baseColor = BABYLON.Color3.FromHexString("#75ceff");
    this.borderColor = BABYLON.Color3.FromHexString("#77ff9b");
    this.fresnelBias = 2;
    this.fresnelPower = 16;
    this.stripeTex = new BABYLON.Texture("./datas/gradient.png", scene);
    let k = 0;
    scene.registerBeforeRender(
      () => {
        this.setVector3("cameraPosition", scene.activeCamera.position);
        k++;
        this.height = Math.cos(k/1000);
      }
    )
  }
}
