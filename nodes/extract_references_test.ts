import { ExtractReferencesRequest } from '../gen/messages_pb';
import { extractReferences } from './extract_references';
import { testContext } from './test_context';

describe('ExtractReferences', () => {
  it('extracts cell refs, range refs, and function names without a cell context', () => {
    const input = new ExtractReferencesRequest();
    input.setFormula('SUM(A1:C2)+VLOOKUP(D1,A1:C2,2,FALSE)+IF(TRUE,1,2)');
    input.setSheet('Sheet1');
    const result = extractReferences(testContext, input);
    expect(result.getOk()).toBe(true);

    const ranges = result.getRangeRefsList();
    // A1:C2 is referenced twice (once by SUM, once by VLOOKUP) but is the
    // same range both times, so it dedupes to one entry.
    expect(ranges).toHaveLength(1);
    expect(ranges[0].getSheet()).toBe('Sheet1');
    expect(ranges[0].getFromRow()).toBe(0);
    expect(ranges[0].getFromCol()).toBe(0);
    expect(ranges[0].getToRow()).toBe(1);
    expect(ranges[0].getToCol()).toBe(2);

    const cells = result.getCellRefsList();
    expect(cells).toHaveLength(1);
    expect(cells[0].getRow()).toBe(0);
    expect(cells[0].getCol()).toBe(3);

    expect(result.getFunctionNamesList().sort()).toEqual(['IF', 'SUM', 'VLOOKUP']);
  });

  it('strips a leading "=" before extracting', () => {
    const input = new ExtractReferencesRequest();
    input.setFormula('=A1+B1');
    const result = extractReferences(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCellRefsList()).toHaveLength(2);
  });

  it('returns no references or functions for a formula with none', () => {
    const input = new ExtractReferencesRequest();
    input.setFormula('1+2*3');
    const result = extractReferences(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getCellRefsList()).toHaveLength(0);
    expect(result.getRangeRefsList()).toHaveLength(0);
    expect(result.getFunctionNamesList()).toHaveLength(0);
  });

  it('reports ok=false with a structured error for an unparseable formula', () => {
    const input = new ExtractReferencesRequest();
    input.setFormula('SUM(A1:B2');
    const result = extractReferences(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
