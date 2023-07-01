import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 6, b: 2, action: Action.Add, expected: 8 },
  { a: 6, b: 2, action: Action.Subtract, expected: 4 },
  { a: 6, b: 2, action: Action.Multiply, expected: 12 },
  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 6, b: 2, action: Action.Exponentiate, expected: 36 },
  { a: 6, b: 2, action: 'action', expected: null },
  { a: '6', b: 2, action: Action.Exponentiate, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)('.$action($a, $b)', ({ a, b, action, expected }) => {
    expect(simpleCalculator({ a, b, action })).toBe(expected);
  });
});
