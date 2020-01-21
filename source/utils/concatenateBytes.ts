export default
function concatenateBytes (value: Uint8Array[]): Uint8Array {
    if (value.length === 0) {
        return new Uint8Array(0);
    }
    const totalLength: number = value
        .map((bytes) => bytes.length)
        .reduce((previousValue, currentValue) => (previousValue + currentValue));
    const newValue = new Uint8Array(totalLength);
    let currentIndex: number = 0;
    value.forEach((x: Uint8Array): void => {
        newValue.set(x, currentIndex);
        currentIndex += x.length;
    });
    return newValue;
}
