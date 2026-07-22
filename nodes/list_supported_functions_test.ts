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
