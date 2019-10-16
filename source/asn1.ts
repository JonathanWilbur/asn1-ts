import * as errors from "./errors";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass } from "./values";

export
abstract class ASN1Element {
    protected recursionCount: number = 0;
    protected static readonly nestingRecursionLimit: number = 5;

    public tagClass: ASN1TagClass = ASN1TagClass.universal;
    public construction: ASN1Construction = ASN1Construction.primitive;
    public tagNumber: number = 0;
    public value: Uint8Array = new Uint8Array(0);

    get length (): number {
        return this.value.length;
    }

    abstract set boolean (value: boolean);
    abstract get boolean (): boolean;
    abstract set integer (value: number);
    abstract get integer (): number;
    abstract set bitString (value: boolean[]);
    abstract get bitString (): boolean[];
    abstract set octetString (value: Uint8Array);
    abstract get octetString (): Uint8Array;
    abstract set objectIdentifier (value: OID);
    abstract get objectIdentifier (): OID;
    abstract set objectDescriptor (value: string);
    abstract get objectDescriptor (): string;
    // EXTERNAL
    abstract set real (value: number);
    abstract get real (): number;
    abstract set enumerated (value: number);
    abstract get enumerated (): number;
    // EmbeddedPDV
    abstract set utf8String (value: string);
    abstract get utf8String (): string;
    abstract set relativeObjectIdentifier (value: number[]);
    abstract get relativeObjectIdentifier (): number[];
    abstract set sequence (value: ASN1Element[]);
    abstract get sequence (): ASN1Element[];
    abstract set set (value: ASN1Element[]);
    abstract get set (): ASN1Element[];
    abstract set numericString (value: string);
    abstract get numericString (): string;
    abstract set printableString (value: string);
    abstract get printableString (): string;
    abstract set teletexString (value: Uint8Array);
    abstract get teletexString (): Uint8Array;
    abstract set videotexString (value: Uint8Array);
    abstract get videotexString (): Uint8Array;
    abstract set ia5String (value: string);
    abstract get ia5String (): string;
    abstract set utcTime (value: Date);
    abstract get utcTime (): Date;
    abstract set generalizedTime (value: Date);
    abstract get generalizedTime (): Date;
    abstract set graphicString (value: string);
    abstract get graphicString (): string;
    abstract set visibleString (value: string);
    abstract get visibleString (): string;
    abstract set generalString (value: string);
    abstract get generalString (): string;
    abstract set universalString (value: string);
    abstract get universalString (): string;
    // characterString
    abstract set bmpString (value: string);
    abstract get bmpString (): string;

    // TODO: Convert this to a separate function.
    // eslint-disable-next-line
    protected static validateDateTime (
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

    // TODO: Convert this to a function
    protected static decodeUnsignedBigEndianInteger (value: Uint8Array): number {
        if (value.length === 0) return 0;
        if (value.length > 4) throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        u8.set(value, (4 - value.length));
        return new Uint32Array(u8.reverse().buffer)[0];
    }

    // TODO: Convert this to a function
    protected static decodeSignedBigEndianInteger (value: Uint8Array): number {
        if (value.length === 0) return 0;
        if (value.length > 4) throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        if (value[0] >= 0b10000000) u8.fill(0xFF);
        u8.set(value, (4 - value.length));
        return new Int32Array(u8.reverse().buffer)[0];
    }
}
