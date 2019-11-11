import isGraphicCharacter from "./isGraphicCharacter";

export default
function isVisibleCharacter (characterCode: number): boolean {
    return isGraphicCharacter(characterCode);
}
