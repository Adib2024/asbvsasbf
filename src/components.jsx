import { useEffect, useId, useRef, useState } from 'react';
import { num } from './i18n.js';

const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Tweens between numeric values so figures glide instead of jumping. */
export function Anim({ value, format }) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);

  useEffect(() => {
    const from = current.current;
    if (!Number.isFinite(value) || !Number.isFinite(from) || reducedMotion() || from === value) {
      current.current = value;
      setShown(value);
      return;
    }
    const start = performance.now();
    const duration = 260;
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = k === 1 ? value : from + (value - from) * eased;
      current.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="fig">{format(shown)}</span>;
}

/** Small "?" button with a plain-language popover. Works with hover, tap and keyboard. */
export function Info({ label, children }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const pointer = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const outside = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <span
      className="info"
      ref={wrap}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        className="info-btn"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={() => {
          // A mouse has already opened it by hovering; touch and keyboard toggle.
          const byMouse = pointer.current === 'mouse';
          pointer.current = null;
          setOpen((o) => (byMouse ? true : !o));
        }}
        onBlur={() => setOpen(false)}
      >
        ?
      </button>
      {open && (
        <span role="tooltip" id={id} className="info-pop">
          {children}
        </span>
      )}
    </span>
  );
}

const parse = (text) => {
  const cleaned = text.replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '.') return NaN;
  return Number(cleaned);
};
const clean = (text) => text.replace(/[^\d.,]/g, '');

/** Slider with a live value that can also be typed directly. */
export function SliderField({ id, label, value, min, max, step, dp = 0, prefix, suffix, onChange, tip, rangeText, disabled, children }) {
  const [text, setText] = useState(null); // null = not editing
  const show = (v) => (dp === 0 ? num(v) : v.toFixed(dp));
  const typed = text === null ? NaN : parse(text);
  const invalid = text !== null && text !== '' && !(typed >= min && typed <= max);
  const fill = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;

  const commit = () => {
    if (text !== null && Number.isFinite(typed)) {
      onChange(+Math.min(max, Math.max(min, typed)).toFixed(dp));
    }
    setText(null);
  };

  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        {tip}
        <span className={`valbox${invalid ? ' is-invalid' : ''}${disabled ? ' is-disabled' : ''}`}>
          {prefix && <span aria-hidden="true">{prefix}</span>}
          <input
            type="text"
            inputMode={dp === 0 ? 'numeric' : 'decimal'}
            autoComplete="off"
            disabled={disabled}
            aria-label={label}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-err` : undefined}
            style={{ width: `${Math.max(3, (text ?? show(value)).length + 1)}ch` }}
            value={text ?? show(value)}
            onFocus={(e) => {
              setText(show(value));
              const el = e.target;
              requestAnimationFrame(() => el.select());
            }}
            onChange={(e) => {
              const next = clean(e.target.value);
              setText(next);
              const n = parse(next);
              if (n >= min && n <= max) onChange(+n.toFixed(dp));
            }}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          />
          {suffix && <span aria-hidden="true">{suffix}</span>}
        </span>
      </div>
      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={{ '--fill': `${fill}%` }}
        onChange={(e) => onChange(+Number(e.target.value).toFixed(dp))}
      />
      {invalid && (
        <p className="hint is-error" id={`${id}-err`} role="alert">
          {rangeText}
        </p>
      )}
      {children}
    </div>
  );
}

/** Ringgit amount typed directly. `value` is a number, or null when left empty. */
export function MoneyField({ id, label, value, onChange, tip, hint, warn }) {
  const [text, setText] = useState(null);
  const display = text ?? (value === null ? '' : num(value));

  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        {tip}
      </div>
      <div className={`money${warn ? ' is-warn' : ''}`}>
        <span aria-hidden="true">RM</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={display}
          onFocus={() => setText(display)}
          onChange={(e) => {
            const next = clean(e.target.value);
            setText(next);
            const n = parse(next);
            onChange(Number.isFinite(n) ? Math.min(n, 100000000) : null);
          }}
          onBlur={() => setText(null)}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
        />
      </div>
      {hint && (
        <p className={`hint${warn ? ' is-warn' : ''}`} id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function Chips({ label, options, isActive, onPick }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className="chip"
          aria-pressed={isActive(o)}
          onClick={() => onPick(o)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
