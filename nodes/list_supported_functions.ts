import { FunctionInfo, ListSupportedFunctionsRequest, ListSupportedFunctionsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { functionInfos } from './formula_util';

/**
 * List every Excel-style function Evaluate/EvaluateBatch/ExtractReferences
 * recognize in a formula — fast-formula-parser's ~280 built-in functions
 * (math, statistical, text, date/time, lookup, logical, engineering,
 * information) plus this package's financial-function bridge (PMT, FV, PV,
 * NPV, IRR, RATE, NPER, and more — see the FINANCIAL category), each with
 * its category. Useful for an agent to check a function is supported before
 * generating a formula that calls it.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listSupportedFunctions(ax: AxiomContext, input: ListSupportedFunctionsRequest): ListSupportedFunctionsResult {
  const out = new ListSupportedFunctionsResult();
  const infos = functionInfos().map((f) => {
    const fi = new FunctionInfo();
    fi.setName(f.name);
    fi.setCategory(f.category);
    return fi;
  });
  out.setFunctionsList(infos);
  out.setCount(infos.length);
  return out;
}
