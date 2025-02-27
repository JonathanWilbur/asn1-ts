import isGraphicCharacter from "./isGraphicCharacter.mjs";

export default
function isObjectDescriptorCharacter (characterCode: number): boolean {
    return isGraphicCharacter(characterCode);
}
