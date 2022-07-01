use std::convert::TryInto;
use wasm_bindgen::prelude::*;
use js_sys::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[inline]
fn get_base_128_length (number_of_bytes: usize) -> isize {
    // Math.ceil(numberOfBytes * (8 / 7));
    // (bytes.get_index(bytes.length() - ((bit_index / 8) + 1)) & (0x01 << (bit_index % 8))) > 0
    unsafe {
        (number_of_bytes as f64 * (8.0 / 7.0)).ceil().to_int_unchecked::<isize>()
    }
}

#[inline]
fn get_bit (bytes: &Uint8Array, bit_index: u32) -> bool {
    (bytes.get_index(bytes.length() - ((bit_index / 8) + 1)) & (0x01 << (bit_index % 8))) > 0
}

#[inline]
fn set_bit (bytes: &mut Vec<u8>, bit_index: u32) {
    let byte_index: usize = bytes.len() - ((bit_index / 7) + 1) as usize;
    let byte: u8 = bytes[byte_index];
    bytes[byte_index] = byte | (0x01 << (bit_index % 7));
}

// NOTE: This branch is abandoned. I kept it so I could keep this code.
// The problem with doing this is that the JS runtime _copies_ the Uint8Array
// into the WebAssembly memory. This would surely cost more memory
#[wasm_bindgen]
pub fn base_128_encode (input: &[u8]) -> JsValue {
    let value = Uint8Array::from(input);
    if value.length() == 1 && value.get_index(0) < 128 {
        return JsValue::from(Uint8Array::from([ value.get_index(0) ].as_slice()));
    }
    let mut encoded_bytes: Vec<u8> = Vec::with_capacity(
        get_base_128_length(value.length() as usize).try_into().unwrap());
    for byte in 0..value.length() {
        for bit in 0..8 {
            let bit_index = (byte << 3) + bit;
            let bit_value = get_bit(&value, bit_index);
            if bit_value {
                set_bit(&mut encoded_bytes, bit_index.into());
            }
        }
    }
    for byte in 0..(encoded_bytes.len() - 1) {
        encoded_bytes[byte] |= 0b1000_0000;
    }
    return JsValue::from(Uint8Array::from(encoded_bytes.as_slice()));
}
