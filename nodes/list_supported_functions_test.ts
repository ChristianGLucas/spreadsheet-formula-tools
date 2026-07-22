import { ListSupportedFunctionsRequest } from '../gen/messages_pb';
import { listSupportedFunctions } from './list_supported_functions';
import { testContext } from './test_context';

describe('ListSupportedFunctions', () => {
  it('lists a large, deduplicated catalog including core and financial functions with plausible categories', () => {
    const result = listSupportedFunctions(testContext, new ListSupportedFunctionsRequest());
    const functions = result.getFunctionsList();

    // fast-formula-parser's own README documents "280 Formulas"; this
    // package adds ~27 financial functions on top, none of which collide
    // with fast-formula-parser's own names.
    expect(result.getCount()).toBe(functions.length);
    expect(functions.length).toBeGreaterThan(300);

    const byName = new Map(functions.map((f) => [f.getName(), f.getCategory()]));
    expect(byName.get('SUM')).toBe('MATH');
    expect(byName.get('VLOOKUP')).toBe('LOOKUP');
    expect(byName.get('IF')).toBe('LOGICAL');
    expect(byName.get('PMT')).toBe('FINANCIAL');
    expect(byName.get('NPV')).toBe('FINANCIAL');
    expect(byName.get('IRR')).toBe('FINANCIAL');
    expect(byName.get('DATE')).toBe('DATE_TIME');
    expect(byName.get('CONCATENATE')).toBe('TEXT');
    // Regression coverage for a categorization bug found during review: an
    // earlier prefix-matching implementation put MINUTE under STATISTICAL
    // (an unanchored "MIN" prefix collision) and put every modern dotted
    // statistical function (NORM.DIST, BINOM.DIST, ...) and DOLLARDE/
    // DOLLARFR under the wrong category (an unanchored bare "N"/"DOLLAR"
    // prefix collision).
    expect(byName.get('MINUTE')).toBe('DATE_TIME');
    expect(byName.get('NORM.DIST')).toBe('STATISTICAL');
    expect(byName.get('NORM.S.INV')).toBe('STATISTICAL');
    expect(byName.get('NEGBINOM.DIST')).toBe('STATISTICAL');
    expect(byName.get('BINOM.DIST')).toBe('STATISTICAL');
    expect(byName.get('DOLLARDE')).toBe('FINANCIAL');
    expect(byName.get('DOLLARFR')).toBe('FINANCIAL');
    expect(byName.get('DOLLAR')).toBe('TEXT');
    // Only genuinely category-less functions (Excel's own "Web" functions,
    // which don't fit any of MATH/STATISTICAL/TEXT/DATE_TIME/LOOKUP/
    // FINANCIAL/LOGICAL/ENGINEERING/INFORMATION) should land in OTHER —
    // every other name in the catalog was hand-classified into a real
    // category. A name appearing here unexpectedly means it was missed.
    const otherNames = functions.filter((f) => f.getCategory() === 'OTHER').map((f) => f.getName());
    expect(otherNames.sort()).toEqual(['ENCODEURL', 'WEBSERVICE']);

    // No duplicate names.
    const names = functions.map((f) => f.getName());
    expect(new Set(names).size).toBe(names.length);
  });

  it('is deterministic across calls', () => {
    const a = listSupportedFunctions(testContext, new ListSupportedFunctionsRequest());
    const b = listSupportedFunctions(testContext, new ListSupportedFunctionsRequest());
    expect(a.getCount()).toBe(b.getCount());
    expect(a.getFunctionsList().map((f) => f.getName())).toEqual(b.getFunctionsList().map((f) => f.getName()));
  });
});
