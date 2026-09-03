import {
    A_EQUALS_B,
    A_GREATER_THAN_B,
    A_LESS_THAN_B,
} from "./types.mjs";

/**
 * @summary Fold an ASCII uppercase letter to lowercase.
 * @internal
 */
export function foldAsciiByte (byte: number): number {
    if (byte >= 0x41 && byte <= 0x5A) {
        return byte + 0x20;
    }
    return byte;
}

/**
 * @summary Read the next iterator value, or `undefined` when exhausted.
 * @internal
 */
export function takeNext<T> (iterator: Iterator<T>): T | undefined {
    const step: IteratorResult<T> = iterator.next();
    if (step.done) {
        return undefined;
    }
    return step.value;
}

/**
 * @summary Compare two numbers for sort ordering.
 * @internal
 */
export function orderingSign (a: number, b: number): typeof A_LESS_THAN_B | typeof A_EQUALS_B | typeof A_GREATER_THAN_B {
    if (a < b) {
        return A_LESS_THAN_B;
    }
    if (a > b) {
        return A_GREATER_THAN_B;
    }
    return A_EQUALS_B;
}
