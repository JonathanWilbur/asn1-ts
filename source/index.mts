/**
 * This module contains all of the main exports for this library. This includes
 * `BERElement`, `CERElement`, `DERElement`, `ABSTRACT_SYNTAX`,
 * `TYPE_IDENTIFIER`, the error types, the type aliases and other macros,
 * constants, and some utilities.
 *
 * Encoding and decoding example:
 *
 * @example
 * ```ts
 * let el: BERElement = new BERElement();
 * el.tagClass = ASN1TagClass.universal; // Not technically necessary.
 * el.construction = ASN1Construction.primitive; // Not technically necessary.
 * el.tagNumber = ASN1UniversalType.integer;
 * el.integer = 1433; // Now the data is encoded.
 * console.log(el.integer); // Logs '1433'
 * ```
 *
 * ... and here is how you would decode that same element:
 *
 * @example
 * ```ts
 * const encodedData: Uint8Array = el.toBytes();
 * const el2: BERElement = new BERElement();
 * el2.fromBytes(encodedData);
 * console.log(el2.integer); // Logs 1433
 * ```
 *
 * @module
 */

export { default as ASN1Element } from "./asn1.mjs";
export { default as BERElement } from "./codecs/ber.mjs";
export { default as CERElement } from "./codecs/cer.mjs";
export { default as DERElement } from "./codecs/der.mjs";
export { default as sortCanonically } from "./utils/sortCanonically.mjs";
export { default as compareSetOfElementsCanonically } from "./utils/compareSetOfElementsCanonically.mjs";
export * from "./classes/index.mjs";
export * from "./errors.mjs";
export * from "./interfaces/index.mjs";
export * from "./macros.mjs";
export * from "./types/index.mjs";
export * from "./validators/index.mjs";
export * from "./values.mjs";
export * from "./utils/index.mjs";
