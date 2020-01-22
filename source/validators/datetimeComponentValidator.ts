import * as errors from "../errors";

export default
function datetimeComponentValidator (
    unitName: string,
    min: number,
    max: number,
): (dataType: string, value: number) => void {
    return function (
        dataType: string,
        value: number,
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
