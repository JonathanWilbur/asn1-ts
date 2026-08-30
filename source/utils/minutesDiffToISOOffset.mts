import type { INTEGER } from "../macros.mjs";

/**
 * @summary Convert a `minutes-diff` value to an ISO 8601 UTC offset
 * @description
 * Produces `Z` for a zero difference, otherwise `±HH:MM` (for example
 * `+05:00` and `-01:30`).
 * @param {INTEGER} minutes_diff - Minutes east of UTC (`-900`..`900`).
 * @returns {string} An ISO 8601 UTC offset.
 * @function
 */
export default
function minutesDiffToISOOffset (minutes_diff: INTEGER): string {
    const n = Number(minutes_diff);
    if (n === 0) {
        return "Z";
    }
    const negative = n < 0;
    const abs = Math.abs(n);
    const hours = Math.trunc(abs / 60);
    const minutes = abs % 60;
    return `${negative ? "-" : "+"}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
