import { EvaluateBatchRequest, EvaluateBatchResult, EvaluateResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  FormulaInputError,
  buildCellIndex,
  checkFormulaBounds,
  createParser,
  flattenArrayResult,
  jsToScalar,
  stripLeadingEquals,
} from './formula_util';

/**
 * Evaluate several formulas against the SAME cell context in one call —
 * e.g. every formula cell in a sheet — building the context and parser
 * once instead of once per formula. Results are returned in the same order
 * as the input formulas; one formula's failure does not affect the others
 * (each result has its own independent ok/error, exactly like calling
 * Evaluate once per formula). No limit on the number of formulas per call
 * — the platform bounds payload size, not this node.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function evaluateBatch(ax: AxiomContext, input: EvaluateBatchRequest): EvaluateBatchResult {
  const out = new EvaluateBatchResult();
  const formulas = input.getFormulasList();

  const context = input.getContext();
  const defaultSheet = context?.getSheet() || 'Sheet1';

  // Build the cell index once for the whole batch; a failure here (context
  // too large / malformed) applies identically to every formula.
  let idx: ReturnType<typeof buildCellIndex>;
  try {
    idx = buildCellIndex(context);
  } catch (err) {
    const results = formulas.map(() => {
      const r = new EvaluateResult();
      r.setOk(false);
      r.setErrorCode('INVALID_INPUT');
      r.setError(err instanceof Error ? err.message : String(err));
      return r;
    });
    out.setResultsList(results.length > 0 ? results : [errorResult(err)]);
    return out;
  }

  const position = {
    row: (context?.getPositionRow() ?? 0) + 1,
    col: (context?.getPositionCol() ?? 0) + 1,
    sheet: defaultSheet,
  };

  const results = formulas.map((rawFormula) => {
    const r = new EvaluateResult();
    try {
      const formula = stripLeadingEquals(rawFormula);
      checkFormulaBounds(formula);
      // A fresh parser per formula: fast-formula-parser's parser holds
      // per-parse state internally, so reusing one instance across
      // formulas in a loop is not a documented-safe pattern; a fresh,
      // cheap parser keeps every formula's evaluation isolated.
      const parser = createParser(idx, defaultSheet);
      const raw = parser.parse(formula, position, true);
      if (Array.isArray(raw)) {
        const { values, numRows, numCols } = flattenArrayResult(raw as unknown[][]);
        r.setIsArray(true);
        r.setArrayValuesList(values);
        r.setArrayRows(numRows);
        r.setArrayCols(numCols);
      } else {
        r.setScalar(jsToScalar(raw));
      }
      r.setOk(true);
    } catch (err) {
      r.setOk(false);
      r.setErrorCode(err instanceof FormulaInputError ? 'INVALID_INPUT' : 'PARSE_ERROR');
      r.setError(err instanceof Error ? err.message : String(err));
    }
    return r;
  });
  out.setResultsList(results);
  return out;
}

function errorResult(err: unknown): EvaluateResult {
  const r = new EvaluateResult();
  r.setOk(false);
  r.setErrorCode('INVALID_INPUT');
  r.setError(err instanceof Error ? err.message : String(err));
  return r;
}
