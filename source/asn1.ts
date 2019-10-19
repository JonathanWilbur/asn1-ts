import * as errors from "./errors";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass } from "./values";

export
abstract class ASN1Element {
    protected recursionCount: number = 0;
    protected static readonly nestingRecursionLimit: number = 5;

    public name: string = "";
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

    private validateSize (name: string, units: string, actualSize: number, min: number, max?: number): void {
        const effectiveMax: number = (typeof max === "undefined" ? Infinity : max);
        if (actualSize < min) {
            throw new errors.ASN1SizeError(
                `${name} encoded ${actualSize} ${units} when the `
                + `minimum permissible is ${min} ${units}.`,
            );
        }
        if (actualSize > effectiveMax) {
            throw new errors.ASN1SizeError(
                `${name} encoded ${actualSize} ${units} when the `
                + `maximum permissible is ${effectiveMax} ${units}.`,
            );
        }
    }

    private validateRange (name: string, actualValue: number, min: number, max?: number): void {
        const effectiveMax: number = (typeof max === "undefined" ? Infinity : max);
        if (actualValue < min) {
            throw new errors.ASN1OverflowError(
                `${name} was ${actualValue} when the `
                + `minimum permissible is ${min}.`,
            );
        }
        if (actualValue > effectiveMax) {
            throw new errors.ASN1OverflowError(
                `${name} was ${actualValue} when the `
                + `maximum permissible is ${effectiveMax}.`,
            );
        }
    }

    public sizeConstrainedBitString (min: number, max?: number): boolean[] {
        const ret: boolean[] = this.bitString;
        this.validateSize(this.name || "BIT STRING", "bits", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedOctetString (min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this.octetString;
        this.validateSize(this.name || "OCTET STRING", "octets", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedObjectDescriptor (min: number, max?: number): string {
        const ret: string = this.objectDescriptor;
        this.validateSize(this.name || "ObjectDescriptor", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedUTF8String (min: number, max?: number): string {
        const ret: string = this.utf8String;
        this.validateSize(this.name || "UTF8String", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedSequenceOf (min: number, max?: number): ASN1Element[] {
        const ret: ASN1Element[] = this.sequence;
        this.validateSize(this.name || "SEQUENCE OF", "elements", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedSetOf (min: number, max?: number): ASN1Element[] {
        const ret: ASN1Element[] = this.set;
        this.validateSize(this.name || "SET OF", "elements", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedNumericString (min: number, max?: number): string {
        const ret: string = this.numericString;
        this.validateSize(this.name || "NumericString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedPrintableString (min: number, max?: number): string {
        const ret: string = this.printableString;
        this.validateSize(this.name || "PrintableString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedTeletexString (min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this.teletexString;
        this.validateSize(this.name || "TeletexString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedVideotexString (min: number, max?: number): Uint8Array {
        const ret: Uint8Array = this.videotexString;
        this.validateSize(this.name || "VideotexString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedIA5String (min: number, max?: number): string {
        const ret: string = this.ia5String;
        this.validateSize(this.name || "IA5String", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedGraphicString (min: number, max?: number): string {
        const ret: string = this.graphicString;
        this.validateSize(this.name || "GraphicString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedVisibleString (min: number, max?: number): string {
        const ret: string = this.visibleString;
        this.validateSize(this.name || "VisibleString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedGeneralString (min: number, max?: number): string {
        const ret: string = this.generalString;
        this.validateSize(this.name || "GeneralString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedUniversalString (min: number, max?: number): string {
        const ret: string = this.universalString;
        this.validateSize(this.name || "UniversalString", "characters", ret.length, min, max);
        return ret;
    }

    public sizeConstrainedBMPString (min: number, max?: number): string {
        const ret: string = this.bmpString;
        this.validateSize(this.name || "BMPString", "characters", ret.length, min, max);
        return ret;
    }

    public rangeConstrainedInteger (min: number, max?: number): number {
        const ret: number = this.integer;
        this.validateRange(this.name || "INTEGER", ret, min, max);
        return ret;
    }

    public rangeConstrainedReal (min: number, max?: number): number {
        const ret: number = this.real;
        this.validateRange(this.name || "REAL", ret, min, max);
        return ret;
    }

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
