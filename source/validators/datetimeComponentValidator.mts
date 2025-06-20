import * as errors from "../errors.mjs";
import type { INTEGER } from "../macros.mjs";

/**
 * @summary Creates a validator function for a date/time component (e.g., year, month, day, hour, etc.)
 * @param {string} unitName - The name of the date/time unit (e.g., 'year', 'month').
 * @param {number | bigint} min - The minimum allowed value for the unit.
 * @param {number | bigint} max - The maximum allowed value for the unit.
 * @returns {Function} A validator function for the unit.
 * @function
 */
export default
function datetimeComponentValidator (
    unitName: string,
    min: INTEGER,
    max: INTEGER,
): (dataType: string, value: INTEGER) => void {
    return function (
        dataType: string,
        value: INTEGER,
    ): void {
        if (!Number.isInteger(value)) {
            throw new errors.ASN1Error(`Non-integral ${unitName} supplied to ${dataType}.`);
        }
        if (value > max) {
            throw new errors.ASN1Error(`Encountered ${unitName} greater than ${max} in ${dataType}.`);
        }
        if (value < min) {
            throw new errors.ASN1Error(`Encountered ${unitName} less than ${min} in ${dataType}.`);
        }
    }
}
