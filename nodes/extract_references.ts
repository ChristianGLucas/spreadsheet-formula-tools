import { CellRef, ExtractReferencesRequest, ExtractReferencesResult, RangeRef } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkFormulaBounds, stripLeadingEquals, supportedFunctionNames } from './formula_util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DepParser } = require('fast-formula-parser');

// A candidate function-call token: an identifier (letters/digits/dot,
// starting with a letter) immediately followed by "(". Matched case-
// insensitively then upper-cased and checked against the real supported-
// function catalog below, so this can only ever narrow (never invent) what
// DepParser + the function table actually recognize.
const FUNCTION_CALL_RE = /([A-Za-z][A-Za-z0-9_.]*)\s*\(/g;

/**
 * List every cell/range reference a formula reads, and every function name
 * it calls, WITHOUT evaluating it — no cell context needed. Useful for
 * building a dependency graph before fetching cell data (e.g. deciding
 * which office-tools ReadRange calls to make) or for a formula-auditing
 * tool. A leading "=" is optional and stripped automatically. ok=false only
 * for a formula this package cannot parse at all (see ValidateFormula for
 * the same syntax check on its own).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractReferences(ax: AxiomContext, input: ExtractReferencesRequest): ExtractReferencesResult {
  const out = new ExtractReferencesResult();
  try {
    const formula = stripLeadingEquals(input.getFormula());
    checkFormulaBounds(formula);
    const sheet = input.getSheet() || 'Sheet1';

    const depParser = new DepParser({});
    const refs: unknown[] = depParser.parse(formula, { row: 1, col: 1, sheet });

    const cellRefs: CellRef[] = [];
    const rangeRefs: RangeRef[] = [];
    for (const r of refs as Array<Record<string, unknown>>) {
      if ('from' in r && 'to' in r) {
        const from = r.from as { row: number; col: number };
        const to = r.to as { row: number; col: number };
        const rr = new RangeRef();
        rr.setSheet((r.sheet as string) || sheet);
        rr.setFromRow(from.row - 1);
        rr.setFromCol(from.col - 1);
        rr.setToRow(to.row - 1);
        rr.setToCol(to.col - 1);
        rangeRefs.push(rr);
      } else if ('row' in r && 'col' in r) {
        const cr = new CellRef();
        cr.setSheet((r.sheet as string) || sheet);
        cr.setRow((r.row as number) - 1);
        cr.setCol((r.col as number) - 1);
        cellRefs.push(cr);
      }
    }

    const supported = new Set(supportedFunctionNames());
    const found = new Set<string>();
    let match: RegExpExecArray | null;
    FUNCTION_CALL_RE.lastIndex = 0;
    while ((match = FUNCTION_CALL_RE.exec(formula)) !== null) {
      const name = match[1].toUpperCase();
      if (supported.has(name)) found.add(name);
    }

    out.setOk(true);
    out.setCellRefsList(cellRefs);
    out.setRangeRefsList(rangeRefs);
    out.setFunctionNamesList(Array.from(found).sort());
    return out;
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof Error ? err.message : String(err));
    return out;
  }
}
