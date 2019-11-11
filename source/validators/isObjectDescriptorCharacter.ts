import isGraphicCharacter from "./isGraphicCharacter";

export default
function isObjectDescriptorCharacter (characterCode: number): boolean {
    return isGraphicCharacter(characterCode);
}
