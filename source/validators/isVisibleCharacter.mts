import isGraphicCharacter from "./isGraphicCharacter.mjs";

export default
function isVisibleCharacter (characterCode: number): boolean {
    return isGraphicCharacter(characterCode);
}
