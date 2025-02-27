export default
function *splitOctetsCanonically (value: Uint8Array): IterableIterator<Uint8Array> {
    for (let i: number = 0; i < value.length; i += 1000) {
        // This will not throw an index error.
        yield value.subarray(i, i + 1000);
    }
}
