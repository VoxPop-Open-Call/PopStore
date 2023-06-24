import textToPriceParser from './textToPriceParser'
describe('textToPriceParser', () => {
    it('handles a float price', () => {
        const testInput = `10.2`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10.2);
    });
    it('handles integer price', () => {
        const testInput = `10`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10);
    });
    it('handles a price with currency', () => {
        const testInput = `10kr`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10);
    });
    it('handles a price with space + currency', () => {
        const testInput = `10 kr`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10);
    });
    it('handles a decimal price with currency', () => {
        const testInput = `10.2kr`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10.2);
    });
    it('handles a decimal price with space + currency', () => {
        const testInput = `10.2 kr`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(10.2);
    });
    it('handles a decimal price with comma', () => {
        const testInput = `123,45`
        const price = textToPriceParser(testInput)
        expect(price).toStrictEqual(123.45);
    });
    it('handles all examples', () => {
        expect(textToPriceParser('1,234.56')).toStrictEqual(1234.56);
        expect(textToPriceParser('1,234,567.89')).toStrictEqual(1234567.89);
        expect(textToPriceParser('1.234,56')).toStrictEqual(1234.56);
        expect(textToPriceParser('1.234.567,89')).toStrictEqual(1234567.89);
        expect(textToPriceParser('1 234.56')).toStrictEqual(1234.56);
        expect(textToPriceParser('1 234 567.89')).toStrictEqual(1234567.89);
        expect(textToPriceParser('1 234,56')).toStrictEqual(1234.56);
        expect(textToPriceParser('1 234 567,89')).toStrictEqual(1234567.89);
        expect(textToPriceParser('123 EUR')).toStrictEqual(123);
        expect(textToPriceParser('123€')).toStrictEqual(123);
    });
})