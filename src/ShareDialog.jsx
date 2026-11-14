import { useEffect, useMemo, useRef, useState } from 'react';
import qrcode from 'qrcode-generator';

/** QR code drawn as a single SVG path. Always dark-on-white so phone cameras can read it. */
function QrCode({ text, label }) {
  const { size, path } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c + 2} ${r + 2}h1v1h-1z`;
      }
    }
    return { size: n + 4, path: d };
  }, [text]);

  return (
    <svg className="qr" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect width={size} height={size} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}

/**
 * Banker-facing share sheet: builds a read-only customer link and offers
 * WhatsApp, copy, QR code and print.
 */
export default function ShareDialog({ open, onClose, t, makeUrl, name, setName, includeDsr, setIncludeDsr, hasSalary, onCopy, onPrint }) {
  const ref = useRef(null);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const dlg = ref.current;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
    if (!open) setShowQr(false);
  }, [open]);

  const url = open ? makeUrl() : '';
  const whatsapp = () => {
    const greeting = name.trim() ? t('waGreetingName', { name: name.trim() }) : t('waGreeting');
    window.open(`https://wa.me/?text=${encodeURIComponent(`${greeting} ${t('waBody')}\n${url}`)}`, '_blank', 'noopener');
  };

  return (
    <dialog
      ref={ref}
      className="dialog no-print"
      aria-labelledby="share-h"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && (
        <div className="dialog-in">
          <div className="dialog-head">
            <h2 id="share-h">{t('shareTitle')}</h2>
            <button type="button" className="icon-btn" aria-label={t('close')} onClick={onClose}>
              ×
            </button>
          </div>
          <p className="muted">{t('shareIntro')}</p>

          <label className="dialog-label" htmlFor="share-name">
            {t('customerName')}
          </label>
          <input
            id="share-name"
            className="text-input"
            type="text"
            maxLength={60}
            autoComplete="off"
            placeholder={t('customerNamePh')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="check">
            <input
              type="checkbox"
              checked={includeDsr && hasSalary}
              disabled={!hasSalary}
              onChange={(e) => setIncludeDsr(e.target.checked)}
            />
            <span>
              {t('includeDsr')}
              <small>{hasSalary ? t('includeDsrHint') : t('includeDsrNoSalary')}</small>
            </span>
          </label>

          <div className="share-grid">
            <button type="button" className="btn btn-wa" onClick={whatsapp}>
              WhatsApp
            </button>
            <button type="button" className="btn" onClick={() => onCopy(url)}>
              {t('copyLink')}
            </button>
            <button type="button" className="btn btn-line" aria-pressed={showQr} onClick={() => setShowQr((s) => !s)}>
              {t('qrCode')}
            </button>
            <button type="button" className="btn btn-line" onClick={onPrint}>
              {t('printPdf')}
            </button>
          </div>

          {showQr && (
            <div className="qr-box">
              <QrCode text={url} label={t('qrAlt')} />
              <p className="muted small">{t('qrHint')}</p>
            </div>
          )}

          <p className="link-preview" aria-label={t('linkPreview')}>
            {url}
          </p>
          <p className="muted small">{t('sharePrivacy')}</p>
        </div>
      )}
    </dialog>
  );
}
