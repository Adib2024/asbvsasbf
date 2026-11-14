import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ASB_LIMIT, DEFAULTS, DSR_LIMIT, LIMITS, breakEvenDividend, dsr, impliedRate, project } from './calc.js';
import { makeT, num, pct, rm, rm2, rmSigned, trimPct } from './i18n.js';
import { loadInitial, save, toUrl } from './state.js';
import { Anim, Chips, Info, MoneyField, SliderField } from './components.jsx';
import NetWorthChart from './NetWorthChart.jsx';

const PRESETS = [
  { key: '50-20', amt: 50, yrs: 20 },
  { key: '100-30', amt: 100, yrs: 30 },
  { key: '200-40', amt: 200, yrs: 40 },
];
const DIVIDENDS = [4, 4.5, 5, 5.75, 6];

function useDarkMode() {
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = (e) => setDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return dark;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function Row({ label, tip, children, strong, tone }) {
  return (
    <div className={`kv${strong ? ' kv-strong' : ''}`}>
      <dt>
        {label}
        {tip}
      </dt>
      <dd className={tone ? `tone-${tone}` : undefined}>{children}</dd>
    </div>
  );
}

const toneOf = (n) => (Math.abs(n) < 0.5 ? 'flat' : n > 0 ? 'good' : 'bad');

export default function App() {
  const initial = useRef(null);
  if (!initial.current) initial.current = loadInitial();
  const [inputs, setInputs] = useState(initial.current.inputs);
  const [lang, setLang] = useState(initial.current.lang);
  const [toast, setToast] = useState(null);
  const dark = useDarkMode();
  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => save(inputs, lang), [inputs, lang]);
  useEffect(() => {
    document.documentElement.lang = lang === 'bm' ? 'ms' : 'en';
    document.title = t('appTitle');
  }, [lang, t]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), toast.sticky ? 12000 : 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const set = useCallback((key, value) => {
    setInputs((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'tenure') next.tenure = Math.round(value);
      if (key === 'year') next.year = Math.round(value);
      next.year = Math.min(Math.max(1, next.year), next.tenure);
      return next;
    });
  }, []);
  const selectYear = useCallback((y) => set('year', y), [set]);

  // Empty money fields count as zero in the maths.
  const base = {
    ...inputs,
    takaful: inputs.takaful ?? 0,
    balance: inputs.balance ?? 0,
    commitments: inputs.commitments ?? 0,
    exitFee: inputs.exitFee ?? 0,
    salary: inputs.salary ?? 0,
  };
  // A known installment overrides the rate: we work out the rate it implies.
  const hasKnown = inputs.installment > 0;
  const implied = hasKnown ? impliedRate(base.financing + base.takaful, inputs.installment, base.tenure) : null;
  const v = implied === null ? base : { ...base, rate: implied };

  const result = useMemo(
    () => project(v),
    [v.financing, v.tenure, v.rate, v.takaful, v.dividend, v.balance, v.exitFee],
  );
  const breakEven = useMemo(
    () => breakEvenDividend(v),
    [v.financing, v.tenure, v.rate, v.takaful],
  );
  const row = result.rows[v.year - 1];
  const debt = dsr({ salary: v.salary, commitments: v.commitments, installment: result.installment });
  const tone = toneOf(row.diff);
  const pill = tone === 'good' ? t('asbfWins') : tone === 'bad' ? t('cashWins') : t('even');
  const overLimit = v.balance + v.financing > ASB_LIMIT;

  const verdict = t(tone === 'good' ? 'verdictAsbf' : tone === 'bad' ? 'verdictCash' : 'verdictEven', {
    div: trimPct(v.dividend),
    amt: rm(Math.abs(row.diff)),
    y: v.year,
  });

  const chartLabels = useMemo(
    () => ({
      asbf: t('seriesAsbf'),
      cash: t('seriesCash'),
      paid: t('seriesPaid'),
      yearN: (y) => t('yearN', { y }),
    }),
    [t],
  );

  const share = async () => {
    const url = toUrl(inputs, lang);
    const ok = await copyText(url);
    setToast(ok ? { text: t('copied') } : { text: `${t('copyFailed')} ${url}`, sticky: true });
  };
  const reset = () => {
    setInputs({ ...DEFAULTS });
    setToast({ text: t('resetDone') });
  };

  const tip = (topic, key) => <Info label={t('info', { topic })}>{t(key)}</Info>;
  const rangeOf = (key, fmt = num) =>
    t('range', { min: fmt(LIMITS[key].min), max: fmt(LIMITS[key].max) });

  // Keep the selected row visible inside the table's own scroller (never scrolls the page).
  const tableWrap = useRef(null);
  useEffect(() => {
    const wrap = tableWrap.current;
    const tr = wrap?.querySelector('tr.is-selected');
    if (!tr) return;
    const head = wrap.querySelector('thead').offsetHeight;
    const top = tr.offsetTop - head;
    const bottom = tr.offsetTop + tr.offsetHeight;
    if (top < wrap.scrollTop) wrap.scrollTop = top;
    else if (bottom > wrap.scrollTop + wrap.clientHeight) wrap.scrollTop = bottom - wrap.clientHeight;
  }, [v.year, v.tenure]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="36" height="36" />
            <div>
              <h1>{t('appTitle')}</h1>
              <p>{t('tagline')}</p>
            </div>
          </div>
          <div className="actions">
            <div className="lang" role="group" aria-label={t('langSwitch')}>
              <button type="button" aria-pressed={lang === 'bm'} onClick={() => setLang('bm')} lang="ms">
                BM
              </button>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">
                EN
              </button>
            </div>
            <button type="button" className="btn" onClick={share}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path
                  d="M10 14a4 4 0 0 0 5.7 0l3.5-3.5a4 4 0 0 0-5.7-5.7L12.4 6M14 10a4 4 0 0 0-5.7 0l-3.5 3.5a4 4 0 0 0 5.7 5.7l1.1-1.1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {t('share')}
            </button>
          </div>
        </div>
      </header>

      <main className="layout">
        <p className={`verdict tone-bg-${tone}`} aria-live="polite">
          {verdict}
        </p>

        <section className="panel inputs" aria-labelledby="inputs-h">
          <div className="panel-head">
            <h2 id="inputs-h">{t('inputs')}</h2>
            <button type="button" className="btn btn-quiet" onClick={reset}>
              {t('resetLong')}
            </button>
          </div>

          <div className="field">
            <span className="mini-label">{t('presets')}</span>
            <Chips
              label={t('presets')}
              options={PRESETS.map((p) => ({ ...p, label: t('presetLabel', p) }))}
              isActive={(p) => v.financing === p.amt * 1000 && v.tenure === p.yrs}
              onPick={(p) =>
                setInputs((prev) => ({
                  ...prev,
                  financing: p.amt * 1000,
                  tenure: p.yrs,
                  year: Math.min(prev.year, p.yrs),
                }))
              }
            />
          </div>

          <SliderField
            id="financing"
            label={t('financing')}
            prefix="RM"
            value={v.financing}
            {...LIMITS.financing}
            rangeText={rangeOf('financing')}
            onChange={(n) => set('financing', n)}
          >
            {overLimit && (
              <p className="hint is-warn" role="status">
                ⚠ {t('asbLimit', { total: rm(v.balance + v.financing) })}
              </p>
            )}
          </SliderField>

          <SliderField
            id="tenure"
            label={t('tenure')}
            suffix={t('years')}
            value={v.tenure}
            {...LIMITS.tenure}
            rangeText={rangeOf('tenure')}
            onChange={(n) => set('tenure', n)}
          />

          <SliderField
            id="rate"
            label={t('rate')}
            suffix="%"
            value={v.rate}
            {...LIMITS.rate}
            rangeText={rangeOf('rate', (n) => n.toFixed(2))}
            onChange={(n) => set('rate', n)}
            tip={tip('KAS', 'tipKas')}
            disabled={implied !== null}
          >
            {implied !== null && <p className="hint">{t('rateImplied', { rate: implied.toFixed(2) })}</p>}
          </SliderField>

          <MoneyField
            id="takaful"
            label={t('takaful')}
            value={inputs.takaful}
            onChange={(n) => set('takaful', n)}
            tip={tip('Takaful', 'tipTakaful')}
            hint={inputs.takaful === null ? t('emptyZero') : null}
          />

          <MoneyField
            id="installment"
            label={t('knownInstallment')}
            value={inputs.installment}
            onChange={(n) => set('installment', n)}
            tip={tip(t('knownInstallment'), 'tipKnownInstallment')}
            hint={
              hasKnown && implied === null
                ? t('installmentInvalid', { calc: rm2(result.installment) })
                : !hasKnown
                  ? t('installmentEmpty')
                  : null
            }
            warn={hasKnown && implied === null}
          />

          <SliderField
            id="dividend"
            label={t('dividend')}
            suffix="%"
            value={v.dividend}
            {...LIMITS.dividend}
            rangeText={rangeOf('dividend', (n) => n.toFixed(2))}
            onChange={(n) => set('dividend', n)}
          >
            <Chips
              label={t('dividendChips')}
              options={DIVIDENDS.map((d) => ({ key: d, value: d, label: `${trimPct(d)}%` }))}
              isActive={(o) => v.dividend === o.value}
              onPick={(o) => set('dividend', o.value)}
            />
          </SliderField>

          <MoneyField
            id="balance"
            label={t('balance')}
            value={inputs.balance}
            onChange={(n) => set('balance', n)}
            hint={inputs.balance === null ? t('emptyZero') : null}
          />

          <MoneyField
            id="salary"
            label={t('salary')}
            value={inputs.salary}
            onChange={(n) => set('salary', n)}
            hint={!debt ? t('enterSalary') : null}
            warn={!debt}
          />

          <MoneyField
            id="commitments"
            label={t('commitments')}
            value={inputs.commitments}
            onChange={(n) => set('commitments', n)}
            hint={inputs.commitments === null ? t('emptyZero') : null}
          />

          <MoneyField
            id="exitFee"
            label={t('exitFee')}
            value={inputs.exitFee}
            onChange={(n) => set('exitFee', n)}
            tip={tip(t('exitFee'), 'tipExitFee')}
          />

          <SliderField
            id="year"
            label={t('year')}
            value={v.year}
            min={1}
            max={v.tenure}
            step={1}
            rangeText={t('range', { min: 1, max: v.tenure })}
            onChange={(n) => set('year', n)}
          />
        </section>

        <div className="results">
          <section className="cards" aria-label={t('groupCompare')}>
            <div className="card stat">
              <h3>{t('cardInstallment')}</h3>
              <p className="stat-val">
                <Anim value={result.installment} format={rm2} />
              </p>
              <p className="stat-sub">{t('perMonth')}</p>
            </div>
            <div className="card stat">
              <h3>
                {t('cardBankProfit')}
                {tip(t('cardBankProfit'), 'tipBankProfit')}
              </h3>
              <p className="stat-val">
                <Anim value={result.bankProfit} format={rm} />
              </p>
              <p className="stat-sub">{t('cardBankProfitSub', { y: v.tenure })}</p>
            </div>
            <div className="card stat">
              <h3>{t('cardDiff', { y: v.year })}</h3>
              <p className={`stat-val tone-${tone}`}>
                <Anim value={row.diff} format={rmSigned} />
              </p>
              <p className="stat-sub">
                <span className={`pill pill-${tone}`}>{pill}</span>
              </p>
            </div>
            <div className="card stat">
              <h3>
                {t('cardBreakEven')}
                {tip(t('cardBreakEven'), 'tipBreakEven')}
              </h3>
              <p className="stat-val">
                {breakEven === null ? t('noBreakEven') : <Anim value={breakEven} format={pct} />}
              </p>
              <p className="stat-sub">{t('cardBreakEvenSub')}</p>
            </div>
          </section>

          <section className="card" aria-labelledby="chart-h">
            <div className="card-head">
              <h2 id="chart-h">{t('chartTitle')}</h2>
              <p className="muted">{t('chartHint')}</p>
            </div>
            <NetWorthChart
              rows={result.rows}
              year={v.year}
              onSelect={selectYear}
              dark={dark}
              labels={chartLabels}
              ariaLabel={t('chartAria', { y: v.tenure })}
            />
          </section>

          <div className="pair">
            <section className="card" aria-labelledby="close-h">
              <div className="card-head">
                <h2 id="close-h">{t('closeTitle', { y: v.year })}</h2>
                <span className={`pill pill-${tone}`}>{pill}</span>
              </div>
              <h3 className="group">{t('groupAsbf')}</h3>
              <dl>
                <Row label={t('units')}>
                  <Anim value={row.units} format={rm} />
                </Row>
                <Row label={t('loan')}>
                  <Anim value={-row.loan} format={rm} />
                </Row>
                {row.fee > 0 && (
                  <Row label={t('fee')}>
                    <Anim value={-row.fee} format={rm} />
                  </Row>
                )}
                <Row label={t('surrender')} tip={tip(t('surrender'), 'tipSurrender')} strong>
                  <Anim value={row.surrender} format={rm} />
                </Row>
                <Row label={t('own')}>
                  <Anim value={row.own} format={rm} />
                </Row>
                <Row label={t('asbfTotal')} strong>
                  <Anim value={row.asbf} format={rm} />
                </Row>
              </dl>
              <h3 className="group">{t('groupCash')}</h3>
              <dl>
                <Row label={t('totalPaid')}>
                  <Anim value={row.totalPaid} format={rm} />
                </Row>
                <Row label={t('cashSaved')}>
                  <Anim value={row.cash} format={rm} />
                </Row>
                <Row label={t('own')}>
                  <Anim value={row.own} format={rm} />
                </Row>
                <Row label={t('cashTotal')} strong>
                  <Anim value={row.cashTotal} format={rm} />
                </Row>
              </dl>
              <h3 className="group">{t('groupCompare')}</h3>
              <dl>
                <Row label={t('diff')} strong tone={tone}>
                  <Anim value={row.diff} format={rmSigned} />
                </Row>
                <Row label={t('gainAsbf')} tone={toneOf(row.gainAsbf)}>
                  <Anim value={row.gainAsbf} format={rmSigned} />
                </Row>
                <Row label={t('gainCash')} tone={toneOf(row.gainCash)}>
                  <Anim value={row.gainCash} format={rmSigned} />
                </Row>
              </dl>
            </section>

            <section className="card" aria-labelledby="dsr-h">
              <div className="card-head">
                <h2 id="dsr-h">
                  {t('dsrTitle')}
                  {tip('DSR', 'tipDsr')}
                </h2>
              </div>
              {!debt ? (
                <p className="empty">{t('enterSalary')}</p>
              ) : (
                <>
                  <div
                    className="meter"
                    role="img"
                    aria-label={`${t('dsrRatio')}: ${pct(debt.ratio * 100, 1)}`}
                  >
                    <div
                      className={`meter-bar${debt.ratio > DSR_LIMIT ? ' is-over' : ''}`}
                      style={{ width: `${Math.min(100, debt.ratio * 100)}%` }}
                    />
                    <div className="meter-mark" style={{ left: `${DSR_LIMIT * 100}%` }} />
                  </div>
                  <dl>
                    <Row label={t('dsrLimit')}>
                      <Anim value={debt.limit} format={rm} />
                    </Row>
                    <Row label={t('dsrRatioWithout')}>
                      <Anim value={debt.ratioWithout * 100} format={(n) => pct(n, 1)} />
                    </Row>
                    <Row label={t('dsrRatio')} strong tone={debt.ratio > DSR_LIMIT ? 'bad' : undefined}>
                      <Anim value={debt.ratio * 100} format={(n) => pct(n, 1)} />
                    </Row>
                    <Row label={t('homeWithout')}>
                      <Anim value={debt.without} format={rm} />
                    </Row>
                    <Row label={t('homeWith')} strong>
                      <Anim value={debt.withAsbf} format={rm} />
                    </Row>
                    <Row label={t('homeReduction')} tone={debt.reduction > 0.5 ? 'bad' : undefined}>
                      <Anim value={-debt.reduction} format={rm} />
                    </Row>
                  </dl>
                  {debt.roomLeft < 0 && (
                    <p className="hint is-warn" role="status">
                      ⚠ {t('dsrOver')}
                    </p>
                  )}
                  <p className="muted small">{t('dsrNote')}</p>
                </>
              )}
            </section>
          </div>

          <section className="card" aria-labelledby="table-h">
            <div className="card-head">
              <h2 id="table-h">{t('tableTitle')}</h2>
              <p className="muted">{t('tableHint')}</p>
            </div>
            <div className="table-wrap" ref={tableWrap} tabIndex={0} role="region" aria-labelledby="table-h">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{t('colYear')}</th>
                    <th scope="col">{t('colUnits')}</th>
                    <th scope="col">{t('colLoan')}</th>
                    <th scope="col">{t('colSurrender')}</th>
                    <th scope="col">{t('colAsbf')}</th>
                    <th scope="col">{t('colCash')}</th>
                    <th scope="col">{t('colDiff')}</th>
                    <th scope="col">{t('colPaid')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r) => (
                    <tr
                      key={r.year}
                      className={r.year === v.year ? 'is-selected' : undefined}
                      onClick={() => selectYear(r.year)}
                    >
                      <th scope="row">
                        <button type="button" aria-label={t('selectYear', { y: r.year })} aria-pressed={r.year === v.year}>
                          {r.year}
                        </button>
                      </th>
                      <td>{rm(r.units)}</td>
                      <td>{rm(r.loan)}</td>
                      <td>{rm(r.surrender)}</td>
                      <td>{rm(r.asbf)}</td>
                      <td>{rm(r.cashTotal)}</td>
                      <td className={`tone-${toneOf(r.diff)}`}>{rmSigned(r.diff)}</td>
                      <td>{rm(r.totalPaid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>{t('disclaimer')}</p>
        <p className="small">{t('offlineReady')}</p>
      </footer>

      <div className="stickybar" aria-hidden="true">
        <div>
          <span>{t('barInstallment')}</span>
          <strong className="fig">{rm2(result.installment)}</strong>
        </div>
        <div>
          <span>{t('barDiff', { y: v.year })}</span>
          <strong className={`fig tone-${tone}`}>{rmSigned(row.diff)}</strong>
        </div>
        <span className={`pill pill-${tone}`}>{pill}</span>
      </div>

      <div className="toast-zone" role="status" aria-live="polite">
        {toast && <div className="toast">{toast.text}</div>}
      </div>
    </>
  );
}
