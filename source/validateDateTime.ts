import * as errors from "./errors";

// eslint-disable-next-line
export default function validateDateTime (
    dataType: string,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
): void {
    switch (month) {
    // 31-day months
    case 0: // January
    case 2: // March
    case 4: // May
    case 6: // July
    case 7: // August
    case 9: // October
    case 11: { // December
        if (date > 31) throw new errors.ASN1Error(`Day > 31 encountered in ${dataType} with 31-day month.`);
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
        throw new errors.ASN1Error(`Month greater than 12 encountered in ${dataType}.`);
    }

    if (hours > 23) throw new errors.ASN1Error(`Hours > 23 encountered in ${dataType}.`);
    if (minutes > 59) throw new errors.ASN1Error(`Minutes > 60 encountered in ${dataType}.`);
    if (seconds > 59) throw new errors.ASN1Error(`Seconds > 60 encountered in ${dataType}.`);
}
