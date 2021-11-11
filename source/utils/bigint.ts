import type { INTEGER } from "../macros";
import { MIN_SINT_32, MAX_SINT_32 } from "../values";

export
function bufferToInteger (input: Buffer | Uint8Array): INTEGER {
    const buf: Buffer = (input instanceof Buffer)
        ? input
        : Buffer.from(input);
    switch (buf.length) {
    case (0): return 0;
    case (1): return buf.readInt8();
    case (2): return buf.readInt16BE();
    case (4): return buf.readInt32BE();
    case (8): return buf.readBigInt64BE();
    default: {
        if (buf[0] & 0x80) { // If the encoded number is negative.
            return BigInt.asIntN(
                (buf.length * 8), // bits in a byte.
                BigInt(`0x${buf.toString("hex")}`),
            ); // Unfortunately, there's not an easier way.
            // const a = ~BigInt(`0x${buf.toString("hex")}`);
            // buf[0] &= 0x7F; // Unset the top bit.
            // // I don't know of an easier way to just flip the first bit _after_ inversion.
            // // And no, this is not identical to flipping the bit before inversion.
            // const b = a & BigInt(`0x${buf.toString("hex")}`);

            // return -(b + BigInt(1));
        } else {
            return BigInt(`0x${buf.toString("hex")}`); // Unfortunately, there's not an easier way.
        }
    }
    }
}

export
function integerToBuffer (int: INTEGER): Buffer {
    if (typeof int === "number") {
        if ((int <= 127) && (int >= -128)) {
            const buf = Buffer.allocUnsafe(1);
            buf.writeInt8(int);
            return buf;
        } else if ((int <= 32767) && (int >= -32768)) {
            const buf = Buffer.allocUnsafe(2);
            buf.writeInt16BE(int);
            return buf;
        } else if ((int <= 8388607) && (int >= -8388608)) {
            const buf = Buffer.allocUnsafe(4);
            buf.writeInt32BE(int);
            return buf.slice(1);
        } else if ((int >= MIN_SINT_32) && (int <= MAX_SINT_32)) {
            const buf = Buffer.allocUnsafe(4);
            buf.writeInt32BE(int);
            return buf;
        } else {
            const ret = Buffer.allocUnsafe(8);
            ret.writeBigInt64BE(BigInt(int));
            let startOfNonPadding: number = 0;
            if (int >= 0) {
                for (let i = 0; i < (ret.length - 1); i++) {
                    if (ret[i] !== 0x00) {
                        break;
                    }
                    if (!(ret[i + 1] & 0x80)) {
                        startOfNonPadding++;
                    }
                }
            } else {
                for (let i = 0; i < (ret.length - 1); i++) {
                    if (ret[i] !== 0xFF) {
                        break;
                    }
                    if (ret[i + 1] & 0x80) {
                        startOfNonPadding++;
                    }
                }
            }

            return ret.slice(startOfNonPadding);
        }
    } else {
        let startOfNonPadding: number = 0;
        let ret = Buffer.allocUnsafe(8);
        if (
            (int >= Number.MIN_SAFE_INTEGER)
            && (int <= Number.MAX_SAFE_INTEGER)
        ) {
            ret.writeBigInt64BE(int);
        } else if (int >= 0) {
            const hex: string = int.toString(16);
            ret = Buffer.from(((hex.length % 2) ? `0${hex}` : hex), "hex");
            if (ret[0] & 0b1000_0000) {
                ret = Buffer.concat([
                    Buffer.from([ 0x00 ]),
                    ret,
                ]);
            }
        } else {
            const hex: string = BigInt.asUintN(
                100000000,
                int,
            ).toString(16);
            ret = Buffer.from(((hex.length % 2) ? `0${hex}` : hex), "hex");
            if (!(ret[0] & 0b1000_0000)) {
                ret = Buffer.concat([
                    Buffer.from([ 0xFF ]),
                    ret,
                ]);
            }
        }
        if (int >= 0) {
            for (let i = 0; i < (ret.length - 1); i++) {
                if (ret[i] !== 0x00) {
                    break;
                }
                if (!(ret[i + 1] & 0x80)) {
                    startOfNonPadding++;
                }
            }
        } else {
            for (let i = 0; i < (ret.length - 1); i++) {
                if (ret[i] !== 0xFF) {
                    break;
                }
                if (ret[i + 1] & 0x80) {
                    startOfNonPadding++;
                }
            }
        }
        return ret.slice(startOfNonPadding);
    }
}
