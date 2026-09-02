import type ASN1Element from "../../asn1.mjs";
import * as errors from "../../errors.mjs";
import { ASN1Construction, ASN1UniversalType } from "../../values.mjs";
import {
    getConstructedChildren,
    NESTING_RECURSION_LIMIT,
    validateFragment,
} from "./internal.mjs";

interface StackFrame {
    readonly children: readonly ASN1Element[];
    index: number;
}

/**
 * @summary Iterate primitively-encoded content-octet chunks of a BER/CER value.
 * @description
 * Constructed string and OCTET STRING encodings may split content octets across
 * nested OCTET STRING fragments. This cursor walks those fragments without
 * allocating a joined buffer. Each `nextChunk()` call returns a `Uint8Array`
 * view aliasing the underlying encoded bytes.
 *
 * Never call {@link ASN1Element.value} on a constructed operand through this
 * class; only primitive fragments read `value`.
 *
 * @class
 * @author Cursor Composer
 */
export default class ContentOctetChunkCursor {
    /**
     * Root element for error context when walking constructed fragments.
     * Absent when the cursor was constructed from flat {@link Uint8Array} bytes.
     */
    private readonly context: ASN1Element | undefined;
    private readonly fragmentTagNumber: number;
    private readonly dataType: string;
    private readonly stack: StackFrame[] = [];
    private readonly flatBytes: Uint8Array | undefined;
    private flatYielded: boolean = false;
    private depth: number = 0;
    private current: ASN1Element | undefined;

    /**
     * @param {ASN1Element | Uint8Array} source - An ASN.1 element or flat bytes.
     * @param {number} [fragmentTagNumber=ASN1UniversalType.octetString] - Universal
     * tag number required on each constructed fragment when `source` is an element.
     * @param {string} [dataType="OCTET STRING"] - Type name used in error messages.
     */
    public constructor (
        source: ASN1Element | Uint8Array,
        fragmentTagNumber: number = ASN1UniversalType.octetString,
        dataType: string = "OCTET STRING",
    ) {
        this.fragmentTagNumber = fragmentTagNumber;
        this.dataType = dataType;
        if (source instanceof Uint8Array) {
            this.context = undefined;
            this.flatBytes = source;
            this.current = undefined;
            return;
        }
        this.context = source;
        this.flatBytes = undefined;
        this.current = source;
    }

    /**
     * @summary Return the next content-octet chunk, or `undefined` when exhausted.
     * @returns {Uint8Array | undefined} The next primitive content-octet buffer.
     */
    public nextChunk (): Uint8Array | undefined {
        if (this.flatBytes !== undefined) {
            if (this.flatYielded) {
                return undefined;
            }
            this.flatYielded = true;
            return this.flatBytes;
        }

        // Element mode: context was set from the ASN1Element constructor argument.
        const context: ASN1Element | undefined = this.context;
        if (context === undefined) {
            return undefined;
        }
        while (true) {
            if (!this.current) {
                if (!this.advance(context)) {
                    return undefined;
                }
                continue;
            }

            const el: ASN1Element = this.current;
            if (el.construction === ASN1Construction.primitive) {
                const chunk: Uint8Array = el.value;
                this.current = undefined;
                this.advance(context);
                return chunk;
            }

            if (++this.depth > NESTING_RECURSION_LIMIT) {
                throw new errors.ASN1RecursionError();
            }
            const children: readonly ASN1Element[] = getConstructedChildren(el);
            if (children.length === 0) {
                this.depth--;
                this.current = undefined;
                continue;
            }
            validateFragment(children[0], this.fragmentTagNumber, this.dataType, context);
            this.stack.push({ children, index: 0 });
            this.current = children[0];
        }
    }

    /** @internal */
    private advance (context: ASN1Element): boolean {
        while (this.stack.length > 0) {
            const frame: StackFrame = this.stack[this.stack.length - 1];
            frame.index++;
            if (frame.index < frame.children.length) {
                const child: ASN1Element = frame.children[frame.index];
                validateFragment(child, this.fragmentTagNumber, this.dataType, context);
                this.current = child;
                return true;
            }
            this.stack.pop();
            this.depth--;
        }
        this.current = undefined;
        return false;
    }
}
