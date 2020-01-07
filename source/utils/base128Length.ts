export default
function base128Length (numberOfBytes: number): number {
    return Math.ceil(numberOfBytes * (8 / 7));
}
