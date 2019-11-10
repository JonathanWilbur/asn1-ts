/**
 * Represents a function that returns `true` or `false` to indicate the
 * membership of a character code point to a subset.
 *
 * For instance, this can be used to return `true` when the character 9
 * (character code 0x39) is supplied to a function that checks for
 * numeric characters.
 */
export default
interface CharacterValidationFunction {
    (charCode: number): boolean;
}
