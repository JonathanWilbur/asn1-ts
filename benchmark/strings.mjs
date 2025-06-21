import { strict as assert } from "node:assert";

// Test data - various string lengths and compositions
const testStrings = {
    short: [
        "abc123",
        "ABC123", 
        "a1b2c3",
        "123abc",
        "ABCabc",
        "123456",
        "abcdef",
        "ABCDEF"
    ],
    medium: [
        "abcdefghijklmnopqrstuvwxyz0123456789",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
        "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6"
    ],
    long: [
        "a".repeat(1000) + "1".repeat(1000),
        "A".repeat(1000) + "0".repeat(1000),
        "a1b2c3d4e5f6g7h8i9j0".repeat(100),
        "A1B2C3D4E5F6G7H8I9J0".repeat(100)
    ],
    invalid: [
        "abc-123",
        "abc_123", 
        "abc 123",
        "abc@123",
        "abc#123",
        "abc$123",
        "abc%123",
        "abc^123",
        "abc&123",
        "abc*123"
    ]
};

// Regex approach
function isAlphanumericRegex(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}

// Character code approach
function isAlphanumericCharCode(str) {
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (!(
            (code >= 48 && code <= 57) ||  // 0-9
            (code >= 65 && code <= 90) ||  // A-Z
            (code >= 97 && code <= 122)    // a-z
        )) {
            return false;
        }
    }
    return true;
}

// Optimized character code approach with Set lookup
const validCodes = new Set();
for (let i = 48; i <= 57; i++) validCodes.add(i);  // 0-9
for (let i = 65; i <= 90; i++) validCodes.add(i);  // A-Z  
for (let i = 97; i <= 122; i++) validCodes.add(i); // a-z

function isAlphanumericOptimized(str) {
    for (let i = 0; i < str.length; i++) {
        if (!validCodes.has(str.charCodeAt(i))) {
            return false;
        }
    }
    return true;
}

// Verify all functions work correctly
console.log("Verifying function correctness...");
for (const category of Object.values(testStrings)) {
    for (const str of category) {
        const expected = /^[a-zA-Z0-9]+$/.test(str);
        assert(isAlphanumericRegex(str) === expected, `Regex failed for: ${str}`);
        assert(isAlphanumericCharCode(str) === expected, `CharCode failed for: ${str}`);
        assert(isAlphanumericOptimized(str) === expected, `Optimized failed for: ${str}`);
    }
}
console.log("All functions verified as correct!");

// Benchmark short strings
console.time("regex_short");
let i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.short) {
        isAlphanumericRegex(str);
    }
}
console.timeEnd("regex_short");

console.time("charcode_short");
i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.short) {
        isAlphanumericCharCode(str);
    }
}
console.timeEnd("charcode_short");

console.time("optimized_short");
i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.short) {
        isAlphanumericOptimized(str);
    }
}
console.timeEnd("optimized_short");

// Benchmark medium strings
console.time("regex_medium");
i = 0;
while (i < 1000) {
    i++;
    for (const str of testStrings.medium) {
        isAlphanumericRegex(str);
    }
}
console.timeEnd("regex_medium");

console.time("charcode_medium");
i = 0;
while (i < 1000) {
    i++;
    for (const str of testStrings.medium) {
        isAlphanumericCharCode(str);
    }
}
console.timeEnd("charcode_medium");

console.time("optimized_medium");
i = 0;
while (i < 1000) {
    i++;
    for (const str of testStrings.medium) {
        isAlphanumericOptimized(str);
    }
}
console.timeEnd("optimized_medium");

// Benchmark long strings
console.time("regex_long");
i = 0;
while (i < 100) {
    i++;
    for (const str of testStrings.long) {
        isAlphanumericRegex(str);
    }
}
console.timeEnd("regex_long");

console.time("charcode_long");
i = 0;
while (i < 100) {
    i++;
    for (const str of testStrings.long) {
        isAlphanumericCharCode(str);
    }
}
console.timeEnd("charcode_long");

console.time("optimized_long");
i = 0;
while (i < 100) {
    i++;
    for (const str of testStrings.long) {
        isAlphanumericOptimized(str);
    }
}
console.timeEnd("optimized_long");

// Benchmark invalid strings (early termination test)
console.time("regex_invalid");
i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.invalid) {
        isAlphanumericRegex(str);
    }
}
console.timeEnd("regex_invalid");

console.time("charcode_invalid");
i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.invalid) {
        isAlphanumericCharCode(str);
    }
}
console.timeEnd("charcode_invalid");

console.time("optimized_invalid");
i = 0;
while (i < 10000) {
    i++;
    for (const str of testStrings.invalid) {
        isAlphanumericOptimized(str);
    }
}
console.timeEnd("optimized_invalid");

// Mixed benchmark (real-world scenario)
const mixedStrings = [
    ...testStrings.short,
    ...testStrings.medium.slice(0, 2),
    ...testStrings.invalid.slice(0, 5)
];

console.time("regex_mixed");
i = 0;
while (i < 5000) {
    i++;
    for (const str of mixedStrings) {
        isAlphanumericRegex(str);
    }
}
console.timeEnd("regex_mixed");

console.time("charcode_mixed");
i = 0;
while (i < 5000) {
    i++;
    for (const str of mixedStrings) {
        isAlphanumericCharCode(str);
    }
}
console.timeEnd("charcode_mixed");

console.time("optimized_mixed");
i = 0;
while (i < 5000) {
    i++;
    for (const str of mixedStrings) {
        isAlphanumericOptimized(str);
    }
}
console.timeEnd("optimized_mixed");
