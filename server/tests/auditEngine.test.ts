import { test } from 'node:test';
import assert from 'node:assert';
import { runAudit } from '../src/services/auditEngine.js';
import { ISpendInput } from '../src/models/Audit.js';

test('1. Overkill-seat detection: 1 seat on Cursor Teams Standard', () => {
  const inputs: ISpendInput[] = [
    {
      toolId: 'cursor',
      plan: 'business', // Teams Standard
      monthlySpend: 40,
      seats: 1,
      useCase: 'coding',
    },
  ];

  const result = runAudit(inputs, 1, 'coding');
  const cursorResult = result.results.find(r => r.toolId === 'cursor');

  assert.ok(cursorResult);
  assert.strictEqual(cursorResult.recommendedAction, 'downgrade_plan');
  assert.strictEqual(cursorResult.recommendedPlan, 'pro');
  assert.strictEqual(cursorResult.monthlySavings, 20); // 40 - 20 = 20
  assert.strictEqual(result.totalMonthlySavings, 20);
});

test('2. Cheaper plan (same vendor): 2 seats on Claude Team', () => {
  const inputs: ISpendInput[] = [
    {
      toolId: 'claude',
      plan: 'team', // Claude Team
      monthlySpend: 125, // paying for 5-seat minimum ($25 * 5)
      seats: 2,
      useCase: 'mixed',
    },
  ];

  const result = runAudit(inputs, 2, 'mixed');
  const claudeResult = result.results.find(r => r.toolId === 'claude');

  assert.ok(claudeResult);
  assert.strictEqual(claudeResult.recommendedAction, 'downgrade_plan');
  assert.strictEqual(claudeResult.recommendedPlan, 'pro');
  assert.strictEqual(claudeResult.monthlySavings, 85); // 125 - (2 * 20) = 85
  assert.strictEqual(result.totalMonthlySavings, 85);
});

test('3. Cheaper alternative tool: Overlapping Cursor + Copilot', () => {
  const inputs: ISpendInput[] = [
    {
      toolId: 'cursor',
      plan: 'pro',
      monthlySpend: 20,
      seats: 1,
      useCase: 'coding',
    },
    {
      toolId: 'copilot',
      plan: 'individual',
      monthlySpend: 10,
      seats: 1,
      useCase: 'coding',
    },
  ];

  const result = runAudit(inputs, 1, 'coding');
  const copilotResult = result.results.find(r => r.toolId === 'copilot');

  assert.ok(copilotResult);
  assert.strictEqual(copilotResult.recommendedAction, 'switch_tool');
  assert.strictEqual(copilotResult.recommendedPlan, 'free');
  assert.strictEqual(copilotResult.monthlySavings, 10);
  assert.strictEqual(result.totalMonthlySavings, 10);
});

test('4. Already-optimal: entire stack spend < $100', () => {
  const inputs: ISpendInput[] = [
    {
      toolId: 'cursor',
      plan: 'pro',
      monthlySpend: 20,
      seats: 1,
      useCase: 'coding',
    },
    {
      toolId: 'claude',
      plan: 'pro',
      monthlySpend: 20,
      seats: 1,
      useCase: 'mixed',
    },
  ];

  const result = runAudit(inputs, 1, 'mixed');
  const cursorResult = result.results.find(r => r.toolId === 'cursor');
  const claudeResult = result.results.find(r => r.toolId === 'claude');

  assert.ok(cursorResult);
  assert.ok(claudeResult);
  assert.strictEqual(cursorResult.recommendedAction, 'already_optimal');
  assert.strictEqual(claudeResult.recommendedAction, 'already_optimal');
  assert.strictEqual(result.totalMonthlySavings, 0);
});

test('5. API-direct vs subscription breakeven: high API usage', () => {
  const inputs: ISpendInput[] = [
    {
      toolId: 'anthropic_api',
      plan: 'pay_as_you_go',
      monthlySpend: 300,
      seats: 2,
      useCase: 'mixed',
    },
  ];

  const result = runAudit(inputs, 2, 'mixed');
  const apiResult = result.results.find(r => r.toolId === 'anthropic_api');

  assert.ok(apiResult);
  assert.strictEqual(apiResult.recommendedAction, 'switch_tool');
  assert.strictEqual(apiResult.recommendedPlan, 'team');
  assert.strictEqual(apiResult.monthlySavings, 175); // 300 - (5-seat min * 25) = 175
  assert.strictEqual(result.totalMonthlySavings, 175);
});
