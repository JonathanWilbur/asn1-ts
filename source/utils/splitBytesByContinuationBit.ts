export default
function *splitBytesByContinuationBit (value: Uint8Array): IterableIterator<Uint8Array> {
    let lastChunkStartIndex: number = 0;
    for (let i: number = 0; i < value.length; i++) {
        if (!(value[i] & 0b10000000)) {
            yield value.slice(lastChunkStartIndex, (i + 1));
            lastChunkStartIndex = (i + 1);
        }
    }
    return;
}
