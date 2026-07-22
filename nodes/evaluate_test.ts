import { EvaluateRequest, FormulaContext } from '../gen/messages_pb';
import { evaluate } from './evaluate';
import { testContext, context, blankCell } from './test_context';

function run(formula: string, ctx?: ReturnType<typeof context>) {
  const input = new EvaluateRequest();
  input.setFormula(formula);
  if (ctx) input.setContext(ctx);
  return evaluate(testContext, input);
}

describe('Evaluate', () => {
  it('sums a range of cells', () => {
    const ctx = context([
      [0, 0, 10],
      [0, 1, 20],
      [0, 2, 30],
    ]);
    const result = run('SUM(A1:C1)', ctx);
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getType()).toBe('NUMBER');
    expect(result.getScalar()?.getNumberValue()).toBe(60);
  });

  it('looks up a value with VLOOKUP (exact match)', () => {
    const ctx = context([
      [0, 0, 'apple'],
      [0, 1, 1.5],
      [1, 0, 'banana'],
      [1, 1, 0.5],
    ]);
    const result = run('VLOOKUP("banana",A1:B2,2,FALSE)', ctx);
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getType()).toBe('NUMBER');
    expect(result.getScalar()?.getNumberValue()).toBe(0.5);
  });

  it('branches with IF on a comparison', () => {
    const result = run('IF(1>0,"yes","no")');
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getType()).toBe('STRING');
    expect(result.getScalar()?.getStringValue()).toBe('yes');
  });

  it('reports a genuine Excel error VALUE as ok=true with type ERROR (not a node failure)', () => {
    const result = run('1/0');
    expect(result.getOk()).toBe(true);
    expect(result.getIsArray()).toBe(false);
    expect(result.getScalar()?.getType()).toBe('ERROR');
    expect(result.getScalar()?.getStringValue()).toBe('#DIV/0!');
  });

  it('strips a leading "=" as pasted from Excel/Sheets, without crashing', () => {
    const ctx = context([
      [0, 0, 5],
      [1, 0, 7],
    ]);
    const result = run('=SUM(A1:A2)', ctx);
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getNumberValue()).toBe(12);
  });

  it('evaluates a bridged financial function (PMT) matching the standard annuity formula', () => {
    // Independent oracle: hand-computed via the standard PMT formula, not
    // derived from calling formulajs/fast-formula-parser.
    const r = 0.05 / 12;
    const n = 60;
    const pv = 10000;
    const expected = (-pv * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const result = run('PMT(0.05/12,60,10000)');
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getType()).toBe('NUMBER');
    expect(result.getScalar()?.getNumberValue()).toBeCloseTo(expected, 6);
  });

  it('returns an array result for TRANSPOSE, row-major with correct dims', () => {
    const ctx = context([
      [0, 0, 1],
      [0, 1, 2],
    ]);
    const result = run('TRANSPOSE(A1:B1)', ctx);
    expect(result.getOk()).toBe(true);
    expect(result.getIsArray()).toBe(true);
    expect(result.getArrayRows()).toBe(2);
    expect(result.getArrayCols()).toBe(1);
    const values = result.getArrayValuesList().map((v) => v.getNumberValue());
    expect(values).toEqual([1, 2]);
  });

  it('treats a cell absent from the context as blank (0 in numeric context)', () => {
    const result = run('SUM(A1)', context([]));
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getNumberValue()).toBe(0);
  });

  it('honors an explicit BLANK cell the same as an absent one', () => {
    const ctx = new FormulaContext();
    ctx.setSheet('Sheet1');
    ctx.setCellsList([blankCell(0, 0)]);
    const result = run('ISBLANK(A1)', ctx);
    expect(result.getOk()).toBe(true);
    expect(result.getScalar()?.getType()).toBe('BOOLEAN');
    expect(result.getScalar()?.getBoolValue()).toBe(true);
  });

  it('rejects a formula exceeding the nesting-depth bound rather than risk a deep-recursion crash', () => {
    const deeplyNested = '('.repeat(500) + '1' + ')'.repeat(500);
    const result = run(deeplyNested);
    expect(result.getOk()).toBe(false);
    expect(result.getErrorCode()).toBe('INVALID_INPUT');
    expect(result.getError()).toMatch(/nesting depth/);
  });

  it('rejects an empty formula with a structured error instead of crashing', () => {
    const result = run('   ');
    expect(result.getOk()).toBe(false);
    expect(result.getErrorCode()).toBe('INVALID_INPUT');
  });

  it('reports a genuine syntax error as a structured PARSE_ERROR', () => {
    const result = run('SUM(');
    expect(result.getOk()).toBe(false);
    expect(result.getErrorCode()).toBe('PARSE_ERROR');
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('is deterministic: the same formula and context evaluate identically on repeat calls', () => {
    const ctx = context([
      [0, 0, 3],
      [0, 1, 4],
    ]);
    const a = run('SUM(A1:B1)*2', ctx);
    const b = run('SUM(A1:B1)*2', ctx);
    expect(a.getScalar()?.getNumberValue()).toBe(b.getScalar()?.getNumberValue());
    expect(a.getScalar()?.getNumberValue()).toBe(14);
  });
});
