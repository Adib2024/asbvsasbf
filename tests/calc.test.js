import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, installment, project, breakEvenDividend, dsr, cashFutureValue } from '../src/calc.js';

test('RM115,000 / 40 yrs / 4.20% / RM500 takaful is about RM497 a month', () => {
  const inst = installment(115500, 4.2, 40);
  assert.ok(Math.abs(inst - 497) < 1, `got ${inst}`);
});

test('loan is fully paid at the end of the tenure', () => {
  const p = project(DEFAULTS);
  assert.equal(p.rows.length, 40);
  assert.equal(p.rows.at(-1).loan, 0);
  assert.ok(p.rows[0].loan < p.P && p.rows[0].loan > 0);
  assert.ok(Math.abs(p.bankProfit - (p.installment * 480 - 115500)) < 1e-6);
});

test('row identities hold', () => {
  const p = project({ ...DEFAULTS, exitFee: 300 });
  for (const r of p.rows) {
    assert.ok(Math.abs(r.surrender - (r.units - r.loan - r.fee)) < 1e-6);
    assert.ok(Math.abs(r.asbf - (r.surrender + r.own)) < 1e-6);
    assert.ok(Math.abs(r.cashTotal - (r.own + r.cash)) < 1e-6);
    assert.ok(Math.abs(r.diff - (r.asbf - r.cashTotal)) < 1e-6);
  }
  assert.equal(p.rows[0].fee, 300);
  assert.equal(p.rows.at(-1).fee, 0);
});

test('units and own ASB compound yearly at the dividend rate', () => {
  const p = project(DEFAULTS);
  assert.ok(Math.abs(p.rows[9].units - 115000 * 1.0575 ** 10) < 1e-6);
  assert.ok(Math.abs(p.rows[9].own - 20000 * 1.0575 ** 10) < 1e-6);
});

test('break-even dividend makes the end-of-tenure difference zero', () => {
  const be = breakEvenDividend(DEFAULTS);
  const end = project({ ...DEFAULTS, dividend: be }).rows.at(-1);
  assert.ok(Math.abs(end.diff) < 0.01, `diff ${end.diff}`);
  assert.ok(be > 3 && be < 6);
});

test('cash future value with zero dividend is just the deposits', () => {
  assert.equal(cashFutureValue(100, 0, 2), 2400);
});

test('DSR and home loan eligibility', () => {
  const inst = installment(115500, 4.2, 40);
  const d = dsr({ salary: 4000, commitments: 0, installment: inst });
  assert.equal(d.limit, 2400);
  const per = installment(1, 4, 35);
  assert.ok(Math.abs(d.without - 2400 / per) < 1e-6);
  assert.ok(Math.abs(d.reduction - inst / per) < 1e-6);
  assert.equal(dsr({ salary: 0, commitments: 0, installment: inst }), null);
});
