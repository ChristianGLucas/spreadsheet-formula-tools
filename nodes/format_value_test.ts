import { FormatValueRequest, ScalarValue } from '../gen/messages_pb';
import { formatValue } from './format_value';
import { testContext } from './test_context';

function num(n: number): ScalarValue {
  const v = new ScalarValue();
  v.setType('NUMBER');
  v.setNumberValue(n);
  return v;
}

function run(formatCode: string, value: ScalarValue) {
  const input = new FormatValueRequest();
  input.setFormatCode(formatCode);
  input.setValue(value);
  return formatValue(testContext, input);
}

describe('FormatValue', () => {
  it('formats a number with thousands separator and 2 decimals', () => {
    const result = run('#,##0.00', num(1234.5));
    expect(result.getOk()).toBe(true);
    expect(result.getFormatted()).toBe('1,234.50');
  });

  it('formats an Excel date serial number as an ISO date (independently known reference date)', () => {
    // Excel serial 45000 is a widely-cited reference value for 2023-03-15
    // (days since the Excel epoch, including its intentional 1900 leap-year
    // bug) — this checks against that independently known fact, not merely
    // "SSF returned something".
    const result = run('yyyy-mm-dd', num(45000));
    expect(result.getOk()).toBe(true);
    expect(result.getFormatted()).toBe('2023-03-15');
  });

  it('formats a fraction as a percentage', () => {
    const result = run('0.00%', num(0.256));
    expect(result.getOk()).toBe(true);
    expect(result.getFormatted()).toBe('25.60%');
  });

  it('rejects a BOOLEAN value with a structured error', () => {
    const v = new ScalarValue();
    v.setType('BOOLEAN');
    v.setBoolValue(true);
    const result = run('0.00', v);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('rejects an empty format_code', () => {
    const result = run('', num(1));
    expect(result.getOk()).toBe(false);
  });
});
