// This is just a simple test file to make sure that Deno can import and use this.
import { decodeUnsignedBigEndianInteger } from "./dist/index.mjs";
import { assertEquals } from "jsr:@std/assert";

Deno.test("simple test", () => {
  assertEquals(decodeUnsignedBigEndianInteger(new Uint8Array([ 0, 5 ])), 5);
});
