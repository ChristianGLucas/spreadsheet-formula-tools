import { FormatValueRequest, FormatValueResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { formatWithSSF } from './formula_util';

/**
 * Render a raw value as Excel would display it under a given number-format
 * code — e.g. format_code "#,##0.00" on 1234.5 -> "1,234.50", "yyyy-mm-dd"
 * on the date serial 45000 -> "2023-03-15", "0.00%" on 0.256 -> "25.60%".
 * Uses the same SSF (SpreadSheetFormat) engine fast-formula-parser itself
 * uses for Excel-compatible number formatting. value.type must be NUMBER
 * (including Excel date/time serials) or STRING; BOOLEAN/BLANK/ERROR
 * inputs return a structured error since Excel number formats apply to
 * numbers and text, not to those.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function formatValue(ax: AxiomContext, input: FormatValueRequest): FormatValueResult {
  const out = new FormatValueResult();
  try {
    const formatCode = input.getFormatCode();
    if (formatCode.length === 0) {
      throw new Error('format_code must not be empty');
    }
    const value = input.getValue();
    if (!value) {
      throw new Error('value must be set');
    }
    out.setFormatted(formatWithSSF(formatCode, value));
    out.setOk(true);
    return out;
  } catch (err) {
    out.setOk(false);
    out.setError(err instanceof Error ? err.message : String(err));
    return out;
  }
}
