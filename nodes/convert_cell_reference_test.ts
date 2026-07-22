import { ConvertCellReferenceRequest } from '../gen/messages_pb';
import { convertCellReference } from './convert_cell_reference';
import { testContext } from './test_context';

describe('ConvertCellReference', () => {
  it('parses a single A1 cell reference to 0-based row/col', () => {
    const input = new ConvertCellReferenceRequest();
    input.setA1Ref('B7');
    const result = convertCellReference(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getRow()).toBe(6);
    expect(result.getCol()).toBe(1);
    expect(result.getIsRange()).toBe(false);
  });

  it('parses a sheet-qualified A1 range reference', () => {
    const input = new ConvertCellReferenceRequest();
    input.setA1Ref('Sheet1!B2:D10');
    const result = convertCellReference(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getSheet()).toBe('Sheet1');
    expect(result.getRow()).toBe(1);
    expect(result.getCol()).toBe(1);
    expect(result.getIsRange()).toBe(true);
    expect(result.getToRow()).toBe(9);
    expect(result.getToCol()).toBe(3);
  });

  it('formats 0-based row/col back into an A1 string', () => {
    const input = new ConvertCellReferenceRequest();
    input.setRow(0);
    input.setCol(1);
    const result = convertCellReference(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getA1Ref()).toBe('B1');
  });

  it('formats a range with a sheet prefix', () => {
    const input = new ConvertCellReferenceRequest();
    input.setRow(0);
    input.setCol(1);
    input.setIsRange(true);
    input.setToRow(9);
    input.setToCol(3);
    input.setSheet('Sheet1');
    const result = convertCellReference(testContext, input);
    expect(result.getOk()).toBe(true);
    expect(result.getA1Ref()).toBe('Sheet1!B1:D10');
  });

  it('round-trips parse -> format back to the same A1 text', () => {
    const parseInput = new ConvertCellReferenceRequest();
    parseInput.setA1Ref('AA100');
    const parsed = convertCellReference(testContext, parseInput);
    expect(parsed.getOk()).toBe(true);

    const formatInput = new ConvertCellReferenceRequest();
    formatInput.setRow(parsed.getRow());
    formatInput.setCol(parsed.getCol());
    const formatted = convertCellReference(testContext, formatInput);
    expect(formatted.getOk()).toBe(true);
    expect(formatted.getA1Ref()).toBe('AA100');
  });

  it('rejects a malformed A1 reference with a structured error', () => {
    const input = new ConvertCellReferenceRequest();
    input.setA1Ref('not a ref!!');
    const result = convertCellReference(testContext, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });
});
