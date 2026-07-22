// Shared AxiomContext test double for every node's test file — avoids
// repeating the same reflection/mutation/logging boilerplate seven times.
import { AxiomContext, AxiomLogger, AxiomMutation, AxiomReflection, AxiomSecrets } from '../gen/axiomContext';
import { CellValue, FormulaContext } from '../gen/messages_pb';

const testReflection: AxiomReflection = {
  flow: {
    nodes: [],
    edges: [],
    loopEdges: [],
    position: { currentInstance: 0, depth: 0, loopIterations: {}, subflowStackGraphIds: [] },
    graphId: '',
  },
};

const testMutation: AxiomMutation = {
  flow: {
    addNode: (_packageName: string, _packageVersion: string) => 0,
    addEdge: (_srcInstance: number, _dstInstance: number) => {},
  },
};

export const testContext: AxiomContext = {
  log: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  } satisfies AxiomLogger,
  secrets: {
    get: (_name: string): [string, boolean] => ['', false],
  } satisfies AxiomSecrets,
  executionId: 'test-execution-id',
  flowId: 'test-flow-id',
  tenantId: 'test-tenant-id',
  reflection: testReflection,
  mutation: testMutation,
};

/** Build a CellValue for test fixtures. */
export function cell(row: number, col: number, value: number | string | boolean, sheet = ''): CellValue {
  const cv = new CellValue();
  cv.setRow(row);
  cv.setCol(col);
  cv.setSheet(sheet);
  if (typeof value === 'number') {
    cv.setType('NUMBER');
    cv.setNumberValue(value);
  } else if (typeof value === 'boolean') {
    cv.setType('BOOLEAN');
    cv.setBoolValue(value);
  } else {
    cv.setType('STRING');
    cv.setStringValue(value);
  }
  return cv;
}

export function blankCell(row: number, col: number, sheet = ''): CellValue {
  const cv = new CellValue();
  cv.setRow(row);
  cv.setCol(col);
  cv.setSheet(sheet);
  cv.setType('BLANK');
  return cv;
}

/** Build a FormulaContext from a list of [row, col, value] tuples, all on
 * the default sheet "Sheet1". */
export function context(cells: Array<[number, number, number | string | boolean]>, sheet = 'Sheet1'): FormulaContext {
  const ctx = new FormulaContext();
  ctx.setSheet(sheet);
  ctx.setCellsList(cells.map(([r, c, v]) => cell(r, c, v)));
  return ctx;
}
