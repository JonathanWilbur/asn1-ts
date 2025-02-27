import * as errors from "../errors.mjs";
import { INTEGER } from "../macros.mjs";

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
