import { ConvertCellReferenceRequest, ConvertCellReferenceResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { formatA1, parseA1 } from './formula_util';

/**
 * Convert between A1-notation text and 0-based row/col indices — the
 * addressing scheme ExtractReferences and office-tools' Cell/ReadRange
 * nodes use. Parse mode: supply a1_ref (e.g. "B7", "B2:D10",
 * "Sheet1!B2:D10") to get its sheet + row/col (+ range end) back. Format
 * mode: supply row/col (a1_ref empty) to render the equivalent A1 string;
 * set is_range plus to_row/to_col for a range, and sheet to prefix it
 * (e.g. "Sheet1!B1:D10"). a1_ref takes precedence when both are given.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function convertCellReference(ax: AxiomContext, input: ConvertCellReferenceRequest): ConvertCellReferenceResult {
  const out = new ConvertCellReferenceResult();
  try {
    const a1Ref = input.getA1Ref();
    if (a1Ref.trim().length > 0) {
      const parsed = parseA1(a1Ref);
      out.setSheet(parsed.sheet);
      out.setRow(parsed.row);
      out.setCol(parsed.col);
      out.setIsRange(parsed.isRange);
      out.setToRow(parsed.toRow);
      out.setToCol(parsed.toCol);
      out.setOk(true);
      return out;
    }
    const rendered = formatA1(input.getRow(), input.getCol(), input.getIsRange(), input.getToRow(), input.getToCol(), input.getSheet());
    out.setA1Ref(rendered);
    out.setOk(true);
    return out;
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof Error ? err.message : String(err));
    return out;
  }
}
