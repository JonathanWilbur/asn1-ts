// etaoinsrhdlucmfywgpbvkxqjzETAOINSRHDLUCMFYWGPBVKXQJZ0123456789 '()+,-./:=?
export default
function isPrintableCharacter (characterCode: number): boolean {
    return (
        (characterCode >= 0x27 && characterCode <= 0x39 && characterCode !== 0x2A) // '()+,-./ AND 0 - 9 BUT NOT *
        || (characterCode >= 0x41 && characterCode <= 0x5A) // A - Z
        || (characterCode >= 0x61 && characterCode <= 0x7A) // a - z
        || (characterCode === 0x20) // SPACE
        || (characterCode === 0x3A) // :
        || (characterCode === 0x3D) // =
        || (characterCode === 0x3F) // ?
    );
}
