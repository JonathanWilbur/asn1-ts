import * as errors from "./errors";
import { ObjectIdentifier as OID } from "./types/objectidentifier";
import { ASN1Construction, ASN1TagClass } from "./values";

export
abstract class ASN1Element {
    public recursionCount: number = 0;
    protected static readonly nestingRecursionLimit: number = 5;

    public name: string = "";
    public tagClass: ASN1TagClass = ASN1TagClass.universal;
    public construction: ASN1Construction = ASN1Construction.primitive;
    public tagNumber: number = 0;
    public value: Uint8Array = new Uint8Array(0);

    get length (): number {
        return this.value.length;
    }

    abstract fromBytes (bytes: Uint8Array): number;
    abstract toBytes (): Uint8Array;

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

    // TODO: Convert this to a function
    public static decodeUnsignedBigEndianInteger (value: Uint8Array): number {
        if (value.length === 0) return 0;
        if (value.length > 4) throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        u8.set(value, (4 - value.length));
        return new Uint32Array(u8.reverse().buffer)[0];
    }

    // TODO: Convert this to a function
    public static decodeSignedBigEndianInteger (value: Uint8Array): number {
        if (value.length === 0) return 0;
        if (value.length > 4) throw new errors.ASN1OverflowError("Number too long to decode.");
        const u8 = new Uint8Array(4);
        if (value[0] >= 0b10000000) u8.fill(0xFF);
        u8.set(value, (4 - value.length));
        return new Int32Array(u8.reverse().buffer)[0];
    }

    abstract deconstruct (dataType: string): Uint8Array;

    public validateTag (
        permittedClasses: ASN1TagClass[],
        permittedConstruction: ASN1Construction[],
        permittedNumbers: number[],
    ): number {
        if (!permittedClasses.includes(this.tagClass)) return -1;
        if (!permittedConstruction.includes(this.construction)) return -2;
        if (!permittedNumbers.includes(this.tagNumber)) return -3;
        return 0;
    }

    // Shorter aliases to make for smaller libraries

    set bool (value: boolean) {
        this.boolean = value;
    }

    get bool (): boolean {
        return this.boolean;
    }

    set int (value: number) {
        this.integer = value;
    }

    get int (): number {
        return this.integer;
    }

    set bits (value: boolean[]) {
        this.bitString = value;
    }

    get bits (): boolean[] {
        return this.bitString;
    }

    set octs (value: Uint8Array) {
        this.octetString = value;
    }

    get octs (): Uint8Array {
        return this.octetString;
    }

    set oid (value: OID) {
        this.objectIdentifier = value;
    }

    get oid (): OID {
        return this.objectIdentifier;
    }

    set odesc (value: string) {
        this.objectDescriptor = value;
    }

    get odesc (): string {
        return this.objectDescriptor;
    }

    set enum (value: number) {
        this.enumerated = value;
    }

    get enum (): number {
        return this.enumerated;
    }

    set utf8 (value: string) {
        this.utf8String = value;
    }

    get utf8 (): string {
        return this.utf8String;
    }

    set roid (value: number[]) {
        this.relativeObjectIdentifier = value;
    }

    get roid (): number[] {
        return this.relativeObjectIdentifier;
    }

    set seq (value: ASN1Element[]) {
        this.sequence = value;
    }

    get seq (): ASN1Element[] {
        return this.sequence;
    }

    set nums (value: string) {
        this.numericString = value;
    }

    get nums (): string {
        return this.numericString;
    }

    set prints (value: string) {
        this.printableString = value;
    }

    get prints (): string {
        return this.printableString;
    }

    set ttex (value: Uint8Array) {
        this.teletexString = value;
    }

    get ttex (): Uint8Array {
        return this.teletexString;
    }

    set vtex (value: Uint8Array) {
        this.videotexString = value;
    }

    get vtex (): Uint8Array {
        return this.videotexString;
    }

    set ia5 (value: string) {
        this.ia5String = value;
    }

    get ia5 (): string {
        return this.ia5String;
    }

    set utc (value: Date) {
        this.utcTime = value;
    }

    get utc (): Date {
        return this.utcTime;
    }

    set gtime (value: Date) {
        this.generalizedTime = value;
    }

    get gtime (): Date {
        return this.generalizedTime;
    }

    set ustr (value: string) {
        this.universalString = value;
    }

    get ustr (): string {
        return this.universalString;
    }

    set bmp (value: string) {
        this.bmpString = value;
    }

    get bmp (): string {
        return this.bmpString;
    }
}
