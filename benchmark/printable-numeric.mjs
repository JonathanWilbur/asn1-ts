import { strict as assert } from "node:assert";

// Matches source/validators/isPrintableString.mts
function isPrintableString(s) {
    return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(s);
}

// Matches source/validators/isNumericString.mts
function isNumericString(s) {
    return /^[0-9 ]*$/.test(s);
}

// Matches source/validators/isGraphicString.mts
function isGraphicString(s) {
    return /^[ -~]*$/.test(s);
}

// Matches source/validators/isPrintableCharacter.mts
function isPrintableCharacter(characterCode) {
    return (
        (characterCode >= 0x27 && characterCode <= 0x39 && characterCode !== 0x2A) // '()+,-./ AND 0 - 9 BUT NOT *
        || (characterCode >= 0x41 && characterCode <= 0x5A) // A - Z
        || (characterCode >= 0x61 && characterCode <= 0x7A) // a - z
        || (characterCode === 0x20) // SPACE
        || (characterCode === 0x3A) // :
        || (characterCode === 0x3D) // =
        || (characterCode === 0x3F) // ?
    );
}

// Matches source/validators/isNumericCharacter.mts
function isNumericCharacter(characterCode) {
    return ((characterCode >= 0x30 && characterCode <= 0x39) || characterCode === 0x20);
}

// Matches source/validators/isGraphicCharacter.mts
function isGraphicCharacter(characterCode) {
    return (characterCode >= 0x20 && characterCode <= 0x7E);
}

function isPrintableStringFromCharacters(s) {
    for (const char of Array.from(s)) {
        if (!isPrintableCharacter(char.charCodeAt(0))) {
            return false;
        }
    }
    return true;
}

function isNumericStringFromCharacters(s) {
    for (const char of Array.from(s)) {
        if (!isNumericCharacter(char.charCodeAt(0))) {
            return false;
        }
    }
    return true;
}

function isGraphicStringFromCharacters(s) {
    for (const char of Array.from(s)) {
        if (!isGraphicCharacter(char.charCodeAt(0))) {
            return false;
        }
    }
    return true;
}

const testStrings = {
    printable: {
        short: [
            "Hello",
            "ABC123",
            "test()+,-./:=?",
            "O=Example,C=US",
            "a1B2c3D4",
        ],
        medium: [
            "The quick brown fox jumps over the lazy dog 0123456789",
            "CN=Example Org,O=Example Inc,C=US,ST=CA,L=San Francisco",
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '()+,-./:=?",
        ],
        long: [
            ("A".repeat(500) + "0123456789 '()+,-./:=?").repeat(4),
            ("Example Distinguished Name, OU=Engineering, ").repeat(50),
        ],
        invalid: [
            "Hello@World",
            "abc*123",
            "tab\there",
            "line\nbreak",
            "unicode\u2013dash",
            "emoji😀",
        ],
    },
    numeric: {
        short: [
            "0",
            "1234567890",
            "123 456 789",
            "0000000000",
            " 12345 ",
        ],
        medium: [
            "0123456789 ".repeat(10),
            ("1234567890 ".repeat(5)).trim(),
            "9999999999 8888888888 7777777777",
        ],
        long: [
            "0123456789 ".repeat(200),
            ("1234567890 ".repeat(20)).trim(),
        ],
        invalid: [
            "123a456",
            "12.34",
            "12-34",
            "1234567890A",
            "abc",
            "+123",
        ],
    },
    graphic: {
        short: [
            "Hello World!",
            "[{()}]@#$%",
            "0123456789",
            "a quick test.",
            "ASCII ~",
        ],
        medium: [
            "The quick brown fox jumps over the lazy dog! 0123456789",
            "[Example] {Graphic} <String> @#$%^&*()_+-=[]{}|;':\",./<>?",
            (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~").repeat(2),
        ],
        long: [
            ("Hello, World! ".repeat(100)).trim(),
            ("[GraphicString] ".repeat(200)),
        ],
        invalid: [
            "tab\there",
            "line\nbreak",
            "unicode\u2013dash",
            "emoji😀",
            "DEL\u007F",
            "null\u0000",
        ],
    },
};

function verifyPair(strings, regexFn, charFn, label) {
    for (const str of strings) {
        const regexResult = regexFn(str);
        const charResult = charFn(str);
        assert(
            regexResult === charResult,
            `${label} mismatch for ${JSON.stringify(str)}: regex=${regexResult}, char=${charResult}`,
        );
    }
}

console.log("Verifying function correctness...");
for (const category of Object.values(testStrings.printable)) {
    verifyPair(category, isPrintableString, isPrintableStringFromCharacters, "PrintableString");
}
for (const category of Object.values(testStrings.numeric)) {
    verifyPair(category, isNumericString, isNumericStringFromCharacters, "NumericString");
}
for (const category of Object.values(testStrings.graphic)) {
    verifyPair(category, isGraphicString, isGraphicStringFromCharacters, "GraphicString");
}
console.log("All functions verified as correct!\n");

function runBenchmark(label, iterations, strings, regexFn, charFn) {
    console.time(`${label}_regex`);
    let i = 0;
    while (i < iterations) {
        i++;
        for (const str of strings) {
            regexFn(str);
        }
    }
    console.timeEnd(`${label}_regex`);

    console.time(`${label}_array_from_characters`);
    i = 0;
    while (i < iterations) {
        i++;
        for (const str of strings) {
            charFn(str);
        }
    }
    console.timeEnd(`${label}_array_from_characters`);
}

console.log("PrintableString benchmarks");
runBenchmark(
    "printable_short",
    10000,
    testStrings.printable.short,
    isPrintableString,
    isPrintableStringFromCharacters,
);
runBenchmark(
    "printable_medium",
    1000,
    testStrings.printable.medium,
    isPrintableString,
    isPrintableStringFromCharacters,
);
runBenchmark(
    "printable_long",
    100,
    testStrings.printable.long,
    isPrintableString,
    isPrintableStringFromCharacters,
);
runBenchmark(
    "printable_invalid",
    10000,
    testStrings.printable.invalid,
    isPrintableString,
    isPrintableStringFromCharacters,
);

const printableMixed = [
    ...testStrings.printable.short,
    ...testStrings.printable.medium.slice(0, 2),
    ...testStrings.printable.invalid.slice(0, 4),
];
runBenchmark(
    "printable_mixed",
    5000,
    printableMixed,
    isPrintableString,
    isPrintableStringFromCharacters,
);

console.log("\nNumericString benchmarks");
runBenchmark(
    "numeric_short",
    10000,
    testStrings.numeric.short,
    isNumericString,
    isNumericStringFromCharacters,
);
runBenchmark(
    "numeric_medium",
    1000,
    testStrings.numeric.medium,
    isNumericString,
    isNumericStringFromCharacters,
);
runBenchmark(
    "numeric_long",
    100,
    testStrings.numeric.long,
    isNumericString,
    isNumericStringFromCharacters,
);
runBenchmark(
    "numeric_invalid",
    10000,
    testStrings.numeric.invalid,
    isNumericString,
    isNumericStringFromCharacters,
);

const numericMixed = [
    ...testStrings.numeric.short,
    ...testStrings.numeric.medium.slice(0, 2),
    ...testStrings.numeric.invalid.slice(0, 4),
];
runBenchmark(
    "numeric_mixed",
    5000,
    numericMixed,
    isNumericString,
    isNumericStringFromCharacters,
);

console.log("\nGraphicString benchmarks");
runBenchmark(
    "graphic_short",
    10000,
    testStrings.graphic.short,
    isGraphicString,
    isGraphicStringFromCharacters,
);
runBenchmark(
    "graphic_medium",
    1000,
    testStrings.graphic.medium,
    isGraphicString,
    isGraphicStringFromCharacters,
);
runBenchmark(
    "graphic_long",
    100,
    testStrings.graphic.long,
    isGraphicString,
    isGraphicStringFromCharacters,
);
runBenchmark(
    "graphic_invalid",
    10000,
    testStrings.graphic.invalid,
    isGraphicString,
    isGraphicStringFromCharacters,
);

const graphicMixed = [
    ...testStrings.graphic.short,
    ...testStrings.graphic.medium.slice(0, 2),
    ...testStrings.graphic.invalid.slice(0, 4),
];
runBenchmark(
    "graphic_mixed",
    5000,
    graphicMixed,
    isGraphicString,
    isGraphicStringFromCharacters,
);
