// Pure calculation engine for the ASBF vs ASB Calculator. No DOM, no React.

export const DEFAULTS = {
  financing: 115000,
  tenure: 40,
  rate: 4.2,
  takaful: 500,
  dividend: 5.75,
  balance: 20000,
  salary: 4000,
  commitments: 0,
  year: 10,
  exitFee: 0,
  installment: null, // actual installment, when the user already knows it
};

export const LIMITS = {
  financing: { min: 5000, max: 200000, step: 5000, dp: 0 },
  tenure: { min: 5, max: 40, step: 1, dp: 0 },
  rate: { min: 3, max: 6, step: 0.05, dp: 2 },
  dividend: { min: 3, max: 7, step: 0.25, dp: 2 },
};

export const ASB_LIMIT = 200000;
export const DSR_LIMIT = 0.6;
export const HOME_RATE = 4; // % p.a.
export const HOME_YEARS = 35;

/** Monthly installment for principal P at an annual rate (%) over `years`. */
export function installment(P, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Annual rate (%) implied by a known monthly installment.
 * Returns null when the installment cannot repay P (at or below 0%) or implies more than 20%.
 */
export function impliedRate(P, inst, years) {
  if (!(P > 0) || !(inst > 0)) return null;
  if (inst <= installment(P, 0, years) || inst > installment(P, 20, years)) return null;
  let lo = 0;
  let hi = 20;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (installment(P, mid, years) < inst) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Future value of saving `monthly` every month into ASB for `years`. */
export function cashFutureValue(monthly, dividendPct, years) {
  const i = Math.pow(1 + dividendPct / 100, 1 / 12) - 1;
  let cash = 0;
  for (let m = 0; m < years * 12; m++) cash = (cash + monthly) * (1 + i);
  return cash;
}

/**
 * Year-by-year projection of both scenarios.
 * `exitFee` is charged only when closing before the end of the tenure.
 */
export function project({ financing, tenure, rate, takaful, dividend, balance, exitFee = 0 }) {
  const P = financing + takaful;
  const r = rate / 100 / 12;
  const n = tenure * 12;
  const inst = installment(P, rate, tenure);
  const d = dividend / 100;
  const i = Math.pow(1 + d, 1 / 12) - 1;

  const rows = [];
  let loan = P;
  let cash = 0;
  for (let y = 1; y <= tenure; y++) {
    for (let m = 0; m < 12; m++) {
      loan = Math.max(0, loan * (1 + r) - inst);
      cash = (cash + inst) * (1 + i);
    }
    if (y === tenure || loan < 0.005) loan = 0;
    const growth = Math.pow(1 + d, y);
    const units = financing * growth;
    const own = balance * growth;
    const fee = y < tenure ? exitFee : 0;
    const surrender = units - loan - fee;
    const totalPaid = inst * 12 * y;
    const asbf = surrender + own;
    const cashTotal = own + cash;
    rows.push({
      year: y,
      units,
      loan,
      fee,
      surrender,
      own,
      cash,
      totalPaid,
      asbf,
      cashTotal,
      diff: asbf - cashTotal,
      gainAsbf: asbf - balance - totalPaid,
      gainCash: cashTotal - balance - totalPaid,
    });
  }

  return {
    P,
    n,
    installment: inst,
    totalPayment: inst * n,
    bankProfit: inst * n - P,
    rows,
  };
}

/**
 * Dividend rate (%) at which ASBF and cash are equal at the end of the tenure.
 * Own ASB balance cancels out, so only the financed units and the savings matter.
 * Returns null when no break-even exists between 0% and 25%.
 */
export function breakEvenDividend({ financing, tenure, rate, takaful }) {
  const inst = installment(financing + takaful, rate, tenure);
  const diffAt = (pct) =>
    financing * Math.pow(1 + pct / 100, tenure) - cashFutureValue(inst, pct, tenure);
  let lo = 0;
  let hi = 25;
  if (diffAt(lo) >= 0) return 0;
  if (diffAt(hi) < 0) return null;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (diffAt(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Debt service ratio and home-loan eligibility with and without the ASBF installment. */
export function dsr({ salary, commitments, installment: inst }) {
  if (!(salary > 0)) return null;
  const limit = salary * DSR_LIMIT;
  const perRinggit = installment(1, HOME_RATE, HOME_YEARS);
  const without = Math.max(0, limit - commitments) / perRinggit;
  const withAsbf = Math.max(0, limit - commitments - inst) / perRinggit;
  return {
    limit,
    ratio: (commitments + inst) / salary,
    ratioWithout: commitments / salary,
    without,
    withAsbf,
    reduction: without - withAsbf,
    roomLeft: limit - commitments - inst,
  };
}
