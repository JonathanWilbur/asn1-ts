describe('Basic Encoding Rules UTCTime decoder', () => {
    it('throws if a month greater than 12 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x33, // Month:   13
            0x30, 0x38, // Day:     8
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 31 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x35, // Day:     35
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 30 is encountered on a 30-day month', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x31, // Month:   11
            0x33, 0x31, // Day:     31
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 29 is encountered on a February', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x30, 0x32, // Month:   2
            0x33, 0x30, // Day:     30
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if an hour greater than 23 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x37, // Hour:    27
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a minute greater than 59 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x31, // Hour:    21
            0x39, 0x39, // Minute:  99
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a second greater than 59 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x31, // Hour:    21
            0x32, 0x36, // Minute:  26
            0x39, 0x39, // Second:  99
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });
});

describe('Basic Encoding Rules GeneralizedTime decoder', () => {
    it('throws if a month greater than 12 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x33, // Month:   13
            0x30, 0x38, // Day:     8
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 31 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x35, // Day:     35
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 30 is encountered on a 30-day month', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x31, // Month:   11
            0x33, 0x31, // Day:     31
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a day greater than 29 is encountered on a February', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x30, 0x32, // Month:   2
            0x33, 0x30, // Day:     30
            0x31, 0x33, // Hour:    13
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if an hour greater than 23 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x37, // Hour:    27
            0x32, 0x36, // Minute:  26
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a minute greater than 59 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x31, // Hour:    21
            0x39, 0x39, // Minute:  99
            0x35, 0x36, // Second:  56
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });

    it('throws if a second greater than 59 is encountered', () => {
        let el = new BERElement();
        el.value = new Uint8Array([
            0x31, 0x39, 0x37, 0x35, // Year:    1975
            0x31, 0x32, // Month:   12
            0x33, 0x30, // Day:     30
            0x32, 0x31, // Hour:    21
            0x32, 0x36, // Minute:  26
            0x39, 0x39, // Second:  99
            0x5A        // Z
        ]);
        expect(() => el.utcTime).toThrow();
    });
});