import { EvaluateBatchRequest } from '../gen/messages_pb';
import { evaluateBatch } from './evaluate_batch';
import { testContext, context } from './test_context';

describe('EvaluateBatch', () => {
  it('evaluates every formula against the same shared context, in order', () => {
    const ctx = context([
      [0, 0, 2],
      [0, 1, 3],
      [0, 2, 4],
    ]);
    const input = new EvaluateBatchRequest();
    input.setFormulasList(['SUM(A1:C1)', 'A1*B1', 'IF(C1>3,"big","small")']);
    input.setContext(ctx);
    const result = evaluateBatch(testContext, input);
    const results = result.getResultsList();
    expect(results).toHaveLength(3);
    expect(results[0].getOk()).toBe(true);
    expect(results[0].getScalar()?.getNumberValue()).toBe(9);
    expect(results[1].getOk()).toBe(true);
    expect(results[1].getScalar()?.getNumberValue()).toBe(6);
    expect(results[2].getOk()).toBe(true);
    expect(results[2].getScalar()?.getStringValue()).toBe('big');
  });

  it("isolates one formula's failure from the others in the same batch", () => {
    const ctx = context([[0, 0, 10]]);
    const input = new EvaluateBatchRequest();
    input.setFormulasList(['A1*2', 'SUM(', 'A1+1']);
    input.setContext(ctx);
    const result = evaluateBatch(testContext, input);
    const results = result.getResultsList();
    expect(results).toHaveLength(3);
    expect(results[0].getOk()).toBe(true);
    expect(results[0].getScalar()?.getNumberValue()).toBe(20);
    expect(results[1].getOk()).toBe(false);
    expect(results[1].getErrorCode()).toBe('PARSE_ERROR');
    expect(results[2].getOk()).toBe(true);
    expect(results[2].getScalar()?.getNumberValue()).toBe(11);
  });

  it('rejects a batch over the 500-formula cap without evaluating any of it', () => {
    const input = new EvaluateBatchRequest();
    input.setFormulasList(Array.from({ length: 501 }, () => '1+1'));
    input.setContext(context([]));
    const result = evaluateBatch(testContext, input);
    const results = result.getResultsList();
    expect(results).toHaveLength(1);
    expect(results[0].getOk()).toBe(false);
    expect(results[0].getErrorCode()).toBe('INVALID_INPUT');
  });

  it('returns an empty results list for an empty batch', () => {
    const input = new EvaluateBatchRequest();
    input.setFormulasList([]);
    input.setContext(context([]));
    const result = evaluateBatch(testContext, input);
    expect(result.getResultsList()).toHaveLength(0);
  });
});
