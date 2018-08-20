# ASN.1

ASN.1 stands for *Abstract Syntax Notation*. ASN.1 was first specified in
[X.680 - Abstract Syntax Notation One (ASN.1)](https://www.itu.int/rec/T-REC-X.680/en),
by the [International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).
ASN.1 messages can be encoded in one of several encoding/decoding standards.
It provides a system of types that are extensible, and can presumably describe
every protocol. You can think of it as a protocol for describing other protocols
as well as a family of standards for encoding and decoding said protocols.
It is similar to Google's [Protocol Buffers](https://developers.google.com/protocol-buffers/),
or Sun Microsystems' [External Data Representation (XDR)](https://tools.ietf.org/html/rfc1014).

I wanted to give you something more than the
[Wikipedia page for ASN.1](https://en.wikipedia.org/wiki/Abstract_Syntax_Notation_One)
could give you, but, it will be hard to top their description of ASN.1, which
is as follows:

> Abstract Syntax Notation.One (ASN.1) is an interface description language for defining data structures that can be serialized and deserialized in a standard, cross-platform way. It's broadly used in telecommunications and computer networking, and especially in cryptography.

> ASN.1 is similar in purpose and use to protocol buffers and Apache Thrift, which are also interface description languages for cross-platform data serialization. Like those languages, it has a schema (in ASN.1, called a "module"), and a set of encodings, typically type-length-value encodings. However, ASN.1, defined in 1984, predates them by many years. It also includes a wider variety of basic data types, some of which are obsolete, and has more options for extensibility. A single ASN.1 message can include data from multiple modules defined in multiple standards, even standards defined years apart.

## Uses of ASN.1

ASN.1 is used in, or required by, multiple technologies, including:

* [X.509 Certificates](https://www.itu.int/rec/T-REC-X.509-201610-I/en), used in [SSL/TLS](https://tools.ietf.org/html/rfc5246)
* [Lightweight Directory Access Protocol (LDAP)](https://www.ietf.org/rfc/rfc4511.txt)
* [X.400]()
* [X.500](https://www.itu.int/rec/T-REC-X.500-201610-I/en)
* The [magnetic stripes](https://www.iso.org/standard/43317.html) on credit cards and debit cards
* Microsoft's [Remote Desktop Protocol (RDP)](https://msdn.microsoft.com/en-us/library/mt242409.aspx)
* [Simple Network Management Protocol (SNMP)](https://www.ietf.org/rfc/rfc1157.txt)
* [Common Management Information Protocol (CMIP)](https://www.itu.int/rec/T-REC-X.711/en)
* [Signalling System Number 7 (SS7)](https://www.itu.int/rec/T-REC-Q.700-199303-I/en),
  used to make most phone calls on the Public Switched Telephone Network (PSTN).
* [H.323](https://www.itu.int/rec/T-REC-H.323-200912-I/en) Video conferencing
* Biometrics Protocols:
  * [BioAPI Interworking Protocol (BIP)](https://www.iso.org/standard/43611.html)
  * [Common Biometric Exchange Formats Framework (CBEFF)](http://nvlpubs.nist.gov/nistpubs/Legacy/IR/nistir6529-a.pdf)
  * [Authentication Contexts for Biometrics (ACBio)](https://www.iso.org/standard/41531.html)
* [Computer Supported Telecommunications Applications (CSTA)](https://www.ecma-international.org/activities/Communications/TG11/cstaIII.htm)
* [Dedicated Short Range Communications (SAE J2735)](http://standards.sae.org/j2735_200911/)
* Cellular telephony:
  * [Global System for Mobile Communications (GSM)](http://www.ttfn.net/techno/smartcards/gsm11-11.pdf)
  * [Global Packet Radio Service (GPRS) / Enhanced Data Rates for Global Evolution (EDGE)](http://www.3gpp.org/technologies/keywords-acronyms/102-gprs-edge)
  * [Universal Mobile Telecommunications System (UTMS)](http://www.3gpp.org/DynaReport/25-series.htm)
  * [Long-Term Evolution (LTE)](http://www.3gpp.org/technologies/keywords-acronyms/98-lte)

If you look in the
[`asn1` directory of WireShark's source code](https://github.com/wireshark/wireshark/tree/master/epan/dissectors/asn1),
you'll see all of the protocols that use ASN.1.

## Encoding Rules

ASN.1 is associated with a multitude of encoding rules, which specify how ASN.1
data structures are to be serialized and deserialized for transfer of the wire.

A few of them are:

* Distinguished Encoding Rules (DER)
* Basic Encoding Rules (BER)
* Canonical Encoding Rules (CER)
* XML Encoding Rules (XER)
* Canonical XML Encoding Rules (CXER)
* Extended XML Encoding Rules (E-XER)
* Packed Encoding Rules (PER, unaligned: UPER, canonical: CPER)
* Octet Encoding Rules (OER, canonical: COER)
* JSON Encoding Rules (JER)
* Generic String Encoding Rules (GSER)

With the Basic Encoding Rules (BER) being the encoding rules used for most
protocols. In fact, I don't know of anything that uses anything other than
BER, DER, and BACNet (used for remote control of HVAC systems).

BER, CER, and DER are all specified in
[X.690 - ASN.1 encoding rules](https://www.itu.int/rec/T-REC-X.690/en), published by the
[International Telecommunications Union](https://www.itu.int/en/pages/default.aspx).

BER are the most liberal encoding rules: they permit data to be serialized and
deserialized in many ways. This makes BER easier to use, but harder to initially
develop; further, its permissivity can be a security flaw: more code means more
potential bugs, and BER implementations have seen no shortage of them.

DER was invented to restrict the possibilities for encoding, such that there
would only be one way of representing a value. This is important for
cryptographc certificates, because the more liberal Basic Encoding Rules (BER)
open up possibilites for alternative encoding of values to produce the same
cryptographic hash ("fingerprint," for you non-cryptographic _normies_).

CER is just a mess. Don't use it, and dissociate from anybody that encourages you to.

## Data Types

ASN.1 defines 27 universal data types:

* End-of-Content
* BOOLEAN
* INTEGER
* BIT STRING
* OCTET STRING
* NULL
* OBJECT IDENTIFIER
* Object Descriptor
* EXTERNAL
* REAL
* ENUMERATED
* EmbeddedPDV
* UTF8String
* RELATIVE-OID
* SEQUENCE
* SET
* NumericString
* PrintableString
* T61String
* VideotexString
* IA5String
* UTCTime
* GeneralizedTime
* GraphicString
* VisibleString
* GeneralString
* UniversalString
* CHARACTER STRING
* BMPString

Although you can define your own data types too.

## Data Classes

ASN.1 defines four data classes:

* `UNIVERSAL`
* `APPLICATION`
* `CONTEXT-SPECIFIC`
* `PRIVATELY-DEFINED`

`UNIVERSAL` refers to the data types describe above. The other classes are for
defining your own data types, but the distinctions between them is unclear. For
that reason, use of `APPLICATION` is discouraged. `CONTEXT-SPECIFIC` is for
components of a `SEQUENCE` that need a unique type associated with them to
distinguish them from similarly-typed elements within the same `SEQUENCE`.
`PRIVATELY-DEFINED` is almost never used.

## The Interface Description Language

## Construction

ASN.1 data types can either be primitive or constructed. "Constructed" means
that the data type is really a `SEQUENCE` or `SET` of other, smaller, simpler
elements.

As an Interface Description Language (IDL), ASN.1 looks like this:

```asn1
FooProtocol DEFINITIONS ::= BEGIN

    FooQuestion ::= SEQUENCE {
        trackingNumber INTEGER,
        question       IA5String
    }

    FooAnswer ::= SEQUENCE {
        questionNumber INTEGER,
        answer         BOOLEAN
    }

END
```

(Example from the Wikipedia page.)

For some programming languages, there are "ASN.1 compilers" that convert
this IDL into code.

## When should you use ASN.1?

**NEVER.**

... if you can help it. But some protocols are composed entirely of ASN.1 data structures, so it cannot be avoided. Here are the problems with ASN.1:

### Dangerously Complex Encoding Rules

Even the Distinguished Encoding Rules, which were intended for security
applications, are still too complicated, which makes implementations liable
to have security vulnerabilities.

### Antiquated Data Types

The data types specified by ASN.1 were not well thought out in the first place,
but are especially obsolete nowadays. `TeletexString` and `VideotexString` are
prime examples of this. Though `TeletexString`s are still used in a few X.509
certificates, its use is obsoleted and its on its last dying breath.

### Antiquated Design

ASN.1 was designed for serializing data between systems of all endianness, byte
size, width, instruction sets, architecture, and so on. But since they were
first specified, the world has converged upon some standards. Almost every
string in existence now is encoded using UTF-8, almost every floating-point
type is stored in memory with an IEEE 754 format, almost every CPU has an x86
architecture, and almost every byte is 8 bits.

### Duplicated Data Types

The data types specified by ASN.1 are often redundant. For example, `INTEGER`
and `ENUMERATED` are encoded the exact same way when using BER, CER, or DER.
And because they are so similar, many protocols use an `INTEGER` where they
should have used an `ENUMERATED` and vice versa.

As another example, `UTCTime` and `GeneralizedTime` both encode dates, with
only one small difference between them: `UTCTime` omits the first two digits
of the year, which was a foolish decision in the first place.

Yet another example is `ObjectDescriptor`, which is essentially just an alias
for a `GraphicString`.

`OBJECT IDENTIFIER`s and `RELATIVE OID`s are encoded in a very similar way, and
essentially encode conceptually similar ideas.

The context-switching types, `EXTERNAL`, `EmbeddedPDV`, and `CharacterString`,
are also all encoded in similar ways. In fact, `EmbeddedPDV` and
`CharacterString` differ only by the name of one of their parts.

And finally, almost all string types are redundant, because the existents of
type constraints mean that a `UTF8String`, for instance, could have been
constrained to produce a `VisibleString` ad hoc, instead of having a dedicated
universal type for `VisibleString`.

That said, I would say that more than half of all ASN.1 data types are
completely unnecessary are should have never been defined in the first place.

### Slowness

Though there hypothetically _could be_ a fast way of encoding and decoding
ASN.1 data types, I have yet to see one, though Octet Encoding Rules sounds
promising. Something simpler, like BSON would just encode an integer on four
bytes, which you can directly dump right into memory. An ASN.1 `INTEGER`, by
contrast, has to go through a lot of hoops before it can finally be used as
a native integer.

### No Standard Implementations

TLS has OpenSSL, which is the de facto standard library for TLS-enabled
applications that can interface with C code. Anything involving audio or
video has FFmpeg. But there is no de facto standard ASN.1 library, nor a
de facto standard for any of the encoding rules for it. So almost every
library out there that depends on ASN.1 just implements its own incomplete,
minimally-functional, and, often, highly insecure ASN.1 codec. I've seen
WireShark, OpenSSL, Botan, OpenLDAP, and other widely used projects do this,
all, in each case resulting in devastating security vulnerabilities.

The fact is: ASN.1 is morbidly, stupidly, obscenely complicated. It is a curse
on humanity, bestowed upon us by otherworldly forces that hate us and want us
to suffer for their sadistic amusement. Every duplicated implementation is both
a massive waste of time and an invitation to billions of dollars of security
breaches around the world. ASN.1 _MUST_ be implemented by an expert in ASN.1,
implemented _completely_, and be ruthlessly tested after that.

### Bad Choice of Endianness

ASN.1 encodes everything Big-Endian. This decision was made back when there
were still 10-bit computers, when there was a variety of CPU architectures,
and where endianness was uncertain. Nowadays, things have changed: almost
every computer on the face of the Earth uses the x86 instruction set
architecture, which is little-endian and uses 8-bits per byte.

If big-endian computers were the established norm, ASN.1 would be a lot better,
because a lot of the data could be dumped right from memory into the encoded
data buffer, and vice versa. But because little-endian is the norm, but ASN.1
expects big-endian, everything has to be reversed, often in tedious ways, when
encoding and decoding with ASN.1. This makes it a lot less computationally
efficient when compared to something little-endian like Google's
[Protocol Buffers](https://developers.google.com/protocol-buffers/).

### In summary

DO NOT USE ASN.1 UNLESS YOU HAVE TO.