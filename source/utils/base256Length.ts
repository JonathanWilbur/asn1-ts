export default
function base256Length (numberOfBytes: number): number {
    return Math.ceil(numberOfBytes * (7 / 8));
}
