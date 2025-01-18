import * as errors from "../errors";

export default
function validateDate (
    dataType: string,
    year: number,
    month: number,
    date: number,
): void {
    if (!Number.isSafeInteger(year)) {
        throw new errors.ASN1Error(`Invalid year in ${dataType}`);
    }
    if (!Number.isSafeInteger(month)) {
        throw new errors.ASN1Error(`Invalid month in ${dataType}`);
    }
    if (!Number.isSafeInteger(date) || (date < 1)) {
        throw new errors.ASN1Error(`Invalid day in ${dataType}`);
    }
    switch (month) {
    // 31-day months
    case 0: // January
    case 2: // March
    case 4: // May
    case 6: // July
    case 7: // August
    case 9: // October
    case 11: { // December
        if (date > 31) {
            throw new errors.ASN1Error(`Day > 31 encountered in ${dataType} with 31-day month.`);
        }
        break;
    }
    // 30-day months
    case 3: // April
    case 5: // June
    case 8: // September
    case 10: { // November
        if (date > 30) {
            throw new errors.ASN1Error(`Day > 31 encountered in ${dataType} with 30-day month.`);
        }
        break;
    }
    // 28/29-day month
    case 1: { // Feburary
        // Source: https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript#16353241
        const isLeapYear: boolean = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        if (isLeapYear) {
            if (date > 29) {
                throw new errors.ASN1Error(
                    `Day > 29 encountered in ${dataType} with month of February in leap year.`,
                );
            }
        } else if (date > 28) {
            throw new errors.ASN1Error(
                `Day > 28 encountered in ${dataType} with month of February and non leap year.`,
            );
        }
        break;
    }
    default:
        throw new errors.ASN1Error(`Invalid month in ${dataType}`);
    }
}
