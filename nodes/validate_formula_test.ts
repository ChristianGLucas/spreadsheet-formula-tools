import { ValidateFormulaRequest } from '../gen/messages_pb';
import { validateFormula } from './validate_formula';
import { testContext } from './test_context';

function run(formula: string) {
  const input = new ValidateFormulaRequest();
  input.setFormula(formula);
  return validateFormula(testContext, input);
}

describe('ValidateFormula', () => {
  it('accepts a well-formed formula', () => {
    const result = run('SUM(A1:B2)+IF(C1>0,1,0)');
    expect(result.getValid()).toBe(true);
    expect(result.getError()).toBe('');
  });

  it('accepts a formula with a leading "="', () => {
    const result = run('=VLOOKUP("x",A1:B10,2,FALSE)');
    expect(result.getValid()).toBe(true);
  });

  it('rejects an unbalanced formula and reports a parser position', () => {
    const result = run('SUM(A1:B2');
    expect(result.getValid()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('rejects a call to an unimplemented function', () => {
    const result = run('NOTAREALFUNCTION(1,2)');
    expect(result.getValid()).toBe(false);
    expect(result.getError()).toMatch(/not implemented/i);
  });

  it('treats a formula that would evaluate to an Excel error value as valid (that is Evaluate’s job to report)', () => {
    const result = run('1/0');
    expect(result.getValid()).toBe(true);
  });

  it('rejects an empty formula', () => {
    const result = run('');
    expect(result.getValid()).toBe(false);
  });
});
