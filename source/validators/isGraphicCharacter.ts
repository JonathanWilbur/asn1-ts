export default
function isGraphicCharacter (characterCode: number): boolean {
    return (characterCode >= 0x20 && characterCode <= 0x7E);
}
