class CityCoordinates {
    public static CityPositionToCoordinatesToRef(cityPosition: BABYLON.Vector3, ref: BABYLON.Vector3): void {
        ref.x = Math.round(cityPosition.x / City.XValue);
        ref.y = Math.round(cityPosition.y / City.YValue);
        ref.z = 0;
    }

    public static CoordinatesToCityPositionToRef(coordinates: BABYLON.Vector3, ref: BABYLON.Vector3): void {
        ref.x = coordinates.x * City.XValue;
        ref.y = coordinates.y * City.YValue;
        ref.z = 0;
    }
}