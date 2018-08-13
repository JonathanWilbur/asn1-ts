export
enum ASN1TagClass {
    universal = 0,
    application = 1,
    context = 3,
    private = 4
}

export
enum ASN1Construction {
    primitive = 0,
    constructed = 1
}

export
class ASN1Error extends Error {
    constructor (m : string) {
        super(m);
        (<any>Object).setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
class ASN1NotImplementedError extends ASN1Error {
    constructor () {
        super("Not yet implemented.");
        (<any>Object).setPrototypeOf(this, ASN1Error.prototype);
    }
}

export
enum ASN1SpecialRealValue
{
    plusInfinity = 0b01000000,
    minusInfinity = 0b01000001,
    notANumber = 0b01000010,
    minusZero = 0b01000011
}

export
enum ASN1UniversalType
{
    endOfContent = 0x00,
    boolean = 0x01,
    integer = 0x02,
    bitString = 0x03,
    octetString = 0x04,
    nill = 0x05,
    objectIdentifier = 0x06,
    objectDescriptor = 0x07,
    external = 0x08,
    realNumber = 0x09,
    enumerated = 0x0A,
    embeddedPDV = 0x0B,
    utf8String = 0x0C,
    relativeOID = 0x0D,
    reserved14 = 0x0E,
    reserved15 = 0x0F,
    sequence = 0x10,
    set = 0x11,
    numericString = 0x12,
    printableString = 0x13,
    teletexString = 0x14,
    videotexString = 0x15,
    ia5String = 0x16,
    utcTime = 0x17,
    generalizedTime = 0x18,
    graphicString = 0x19,
    visibleString = 0x1A,
    generalString = 0x1B,
    universalString = 0x1C,
    characterString = 0x1D,
    bmpString = 0x1E
}

export
abstract class ASN1Element
{
    protected static lengthRecursionCount : number = 0;
    protected static valueRecursionCount : number = 0;
    protected static readonly nestingRecursionLimit : number = 5;

    public tagClass : ASN1TagClass = ASN1TagClass.universal;
    public construction : ASN1Construction = ASN1Construction.primitive;
    public tagNumber : number = 0;
    public value : Uint8Array = new Uint8Array(0);

    public length () : number {
        return this.value.length;
    }

    constructor() {

    }
}


// ///
// public alias ASN1RealEncodingBase = AbstractSyntaxNotation1RealEncodingBase;
// ///
// immutable public
// enum AbstractSyntaxNotation1RealEncodingBase : ubyte
// {
//     base2 = 0x02u,
//     base8 = 0x08u,
//     base10 = 0x0Au,
//     base16 = 0x10u
// }

// ///
// public alias ASN1RealEncodingScale = AbstractSyntaxNotation1RealEncodingScale;
// ///
// immutable public
// enum AbstractSyntaxNotation1RealEncodingScale : ubyte
// {
//     scale0 = 0x00u,
//     scale1 = 0x01u,
//     scale2 = 0x02u,
//     scale3 = 0x03u
// }

// ///
// public alias ASN1RealExponentEncoding = AbstractSyntaxNotation1RealExponentEncoding;
// ///
// immutable public
// enum AbstractSyntaxNotation1RealExponentEncoding : ubyte
// {
//     followingOctet = 0b00000000u,
//     following2Octets = 0b00000001u,
//     following3Octets = 0b00000010u,
//     complicated = 0b00000011u // Just calling it as I see it.
// }

// ///
// public alias ASN1SpecialRealValue = AbstractSyntaxNotation1SpecialRealValue;
// /**
//     Special values for REALs, as assigned in section 8.5.9 of X.690.
//     Note that NOT-A-NUMBER and minus zero were added in the 2015 version.
// */
// immutable public
// enum AbstractSyntaxNotation1SpecialRealValue : ubyte
// {
//     plusInfinity = 0b01000000u,
//     minusInfinity = 0b01000001u,
//     notANumber = 0b01000010u,
//     minusZero = 0b01000011u
// }

// ///
// public alias ASN1Base10RealNumericalRepresentation = AbstractSyntaxNotation1Base10RealNumericalRepresentation;
// /**
//     The standardized string representations of floating point numbers, as
//     specified in $(LINK https://www.iso.org/standard/12285.html, ISO 6093).
//     $(TABLE
//         $(TR $(TH Representation) $(TH Description) $(TH Examples))
//         $(TR $(TD NR1) $(TD Implicit decimal point) $(TD "3", "-1", "+1000"))
//         $(TR $(TD NR2) $(TD Explicit decimal) $(TD "3.0", "-1.3", "-.3"))
//         $(TR $(TD NR3) $(TD Explicit exponent) $(TD "3.0E1", "123E+100"))
//     )
//     Citations:
//         Dubuisson, Olivier. “Character String Types.” ASN.1:
//             Communication between Heterogeneous Systems, Morgan
//             Kaufmann, 2001, p. 143.
// */
// immutable public
// enum AbstractSyntaxNotation1Base10RealNumericalRepresentation : ubyte
// {
//     nr1 = 0b00000001u,
//     nr2 = 0b00000010u,
//     nr3 = 0b00000011
// }