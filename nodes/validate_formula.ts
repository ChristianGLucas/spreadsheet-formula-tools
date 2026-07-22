import { ValidateFormulaRequest, ValidateFormulaResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { buildCellIndex, checkFormulaBounds, createParser, stripLeadingEquals } from './formula_util';

const POSITION_RE = /position (\d+):(\d+)/i;

/**
 * Check whether a formula is syntactically well-formed and usable by
 * Evaluate — WITHOUT needing any cell context — e.g. for a formula editor
 * that wants to flag a bad formula as the user types, before it has real
 * cell data to evaluate against. A leading "=" is optional and stripped
 * automatically. valid=false covers both grammar-level syntax errors (an
 * unbalanced paren) and a formula that references a function this package
 * does not implement (see ListSupportedFunctions) — either way, Evaluate
 * could not produce a result for it. A formula that is syntactically fine
 * but would evaluate to an Excel error value (e.g. "1/0") is still
 * valid=true — that's Evaluate's job to report, not this node's.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateFormula(ax: AxiomContext, input: ValidateFormulaRequest): ValidateFormulaResult {
  const out = new ValidateFormulaResult();
  try {
    const formula = stripLeadingEquals(input.getFormula());
    checkFormulaBounds(formula);
    // Empty context: any cell/range reference resolves to blank. This is
    // enough to fully parse and evaluate the formula's grammar/function
    // calls — the only thing we don't get right is the RESULT (which this
    // node doesn't report), not whether the formula is well-formed.
    const idx = buildCellIndex(undefined);
    const parser = createParser(idx, 'Sheet1');
    parser.parse(formula, { row: 1, col: 1, sheet: 'Sheet1' }, true);
    out.setValid(true);
    return out;
  } catch (err) {
    out.setValid(false);
    const message = err instanceof Error ? err.message : String(err);
    out.setError(message);
    const m = POSITION_RE.exec(message);
    if (m) {
      out.setErrorLine(parseInt(m[1], 10));
      out.setErrorColumn(parseInt(m[2], 10));
    }
    return out;
  }
}
