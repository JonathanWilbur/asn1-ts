export default
function isNumericString (characterCode: number): boolean {
    return ((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20);
}
