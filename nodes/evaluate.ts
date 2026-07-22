import { EvaluateRequest, EvaluateResult } from '../gen/messages_pb';
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
 * Evaluate one Excel/Google-Sheets-style formula (SUM, VLOOKUP, IF,
 * date/text/financial functions, cell references — see
 * ListSupportedFunctions for the full catalog) against a caller-supplied
 * cell context, returning the computed value. A leading "=" is optional and
 * stripped automatically. Cells not present in the context are treated as
 * blank, exactly like an empty Excel cell. ok=false only for a genuine
 * parse failure or a bound violation (formula/context too large) — a
 * formula that legitimately evaluates to an Excel error (e.g. 1/0) is
 * still ok=true with scalar.type=="ERROR", the correct result Excel itself
 * would show.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function evaluate(ax: AxiomContext, input: EvaluateRequest): EvaluateResult {
  const out = new EvaluateResult();
  try {
    const formula = stripLeadingEquals(input.getFormula());
    checkFormulaBounds(formula);
    const context = input.getContext();
    const defaultSheet = context?.getSheet() || 'Sheet1';
    const idx = buildCellIndex(context);
    const parser = createParser(idx, defaultSheet);
    const position = {
      row: (context?.getPositionRow() ?? 0) + 1,
      col: (context?.getPositionCol() ?? 0) + 1,
      sheet: defaultSheet,
    };
    const raw = parser.parse(formula, position, true);
    if (Array.isArray(raw)) {
      const { values, numRows, numCols } = flattenArrayResult(raw as unknown[][]);
      out.setIsArray(true);
      out.setArrayValuesList(values);
      out.setArrayRows(numRows);
      out.setArrayCols(numCols);
    } else {
      out.setScalar(jsToScalar(raw));
    }
    out.setOk(true);
    return out;
  } catch (err) {
    out.setOk(false);
    out.setErrorCode(err instanceof FormulaInputError ? 'INVALID_INPUT' : 'PARSE_ERROR');
    out.setError(err instanceof Error ? err.message : String(err));
    return out;
  }
}
