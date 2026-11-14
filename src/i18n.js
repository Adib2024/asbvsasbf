export const STRINGS = {
  bm: {
    appTitle: 'Kalkulator ASBF vs ASB',
    tagline: 'Pinjam untuk beli ASB, atau simpan sendiri setiap bulan?',
    share: 'Kongsi',
    reset: 'Set semula',
    resetLong: 'Set semula kepada asal',
    langSwitch: 'Tukar bahasa',
    copied: 'Pautan disalin',
    copyFailed: 'Tidak dapat salin. Salin pautan ini:',
    resetDone: 'Nilai asal dipulihkan',

    inputs: 'Maklumat anda',
    presets: 'Pilihan pantas',
    presetLabel: 'RM{amt}k / {yrs} thn',
    financing: 'Jumlah pembiayaan',
    tenure: 'Tempoh',
    rate: 'Kadar pembiayaan',
    takaful: 'Takaful (sekali, dibiayai)',
    dividend: 'Dividen ASB',
    dividendChips: 'Senario dividen',
    balance: 'Baki ASB semasa',
    salary: 'Gaji bersih bulanan',
    commitments: 'Komitmen bank lain sebulan',
    exitFee: 'Fi penamatan awal (pilihan)',
    knownInstallment: 'Ansuran sebenar saya (pilihan)',
    installmentEmpty: 'Dah ada ASBF? Taip ansuran bulanan anda. Kosongkan untuk kira daripada kadar.',
    installmentInvalid:
      'Ansuran ini tidak munasabah untuk jumlah dan tempoh ini, jadi kadar di atas digunakan ({calc}/bulan). Semak jumlah pembiayaan dan tempoh.',
    rateImplied: 'Dikira daripada ansuran anda: {rate}% setahun. Kosongkan ansuran untuk ubah kadar.',
    tipKnownInstallment:
      'Jika anda sudah tahu ansuran bulanan (contohnya RM499), taip di sini. Kalkulator akan mengira kadar pembiayaan yang sepadan dengan jumlah, takaful dan tempoh anda, dan guna ansuran ini dalam semua pengiraan.',
    year: 'Tahun tutup / semak',
    years: 'tahun',
    yearShort: 'thn',
    perMonth: '/bulan',
    range: 'Julat: {min} – {max}',
    emptyZero: 'Kosong — dikira sebagai RM0',
    enterSalary: 'Masukkan gaji untuk lihat DSR',
    asbLimit:
      'Baki semasa + ASBF = {total}, melebihi had pegangan ASB RM200,000. Bank mungkin luluskan jumlah yang lebih rendah.',

    verdictAsbf: 'Pada dividen {div}%, ASBF beri anda {amt} lebih selepas {y} tahun.',
    verdictCash: 'Pada dividen {div}%, simpanan tunai beri anda {amt} lebih selepas {y} tahun.',
    verdictEven: 'Pada dividen {div}%, kedua-dua pilihan hampir sama selepas {y} tahun.',

    cardInstallment: 'Ansuran bulanan',
    cardBankProfit: 'Jumlah keuntungan bank',
    cardBankProfitSub: 'sepanjang {y} tahun',
    cardDiff: 'Beza pada tahun {y}',
    cardBreakEven: 'Dividen pulang modal',
    cardBreakEvenSub: 'ASBF menang jika dividen melebihi kadar ini',
    noBreakEven: 'Tiada',
    asbfWins: 'ASBF menang',
    cashWins: 'Tunai menang',
    even: 'Seri',

    chartTitle: 'Nilai bersih mengikut tahun',
    chartHint: 'Ketik atau hala pada carta untuk pilih tahun.',
    chartAria:
      'Carta garis nilai bersih ASBF, simpanan tunai dan jumlah dibayar dari tahun 1 hingga {y}. Butiran penuh ada dalam jadual di bawah.',
    seriesAsbf: 'ASBF',
    seriesCash: 'Tunai',
    seriesPaid: 'Jumlah dibayar',
    yearN: 'Tahun {y}',

    closeTitle: 'Jika anda tutup pada tahun {y}',
    units: 'Unit ASBF',
    loan: 'Baki pembiayaan',
    fee: 'Fi penamatan awal',
    surrender: 'Nilai serahan',
    own: 'ASB sendiri',
    asbfTotal: 'Jumlah ASBF',
    totalPaid: 'Jumlah dibayar',
    cashSaved: 'Simpanan tunai terkumpul',
    cashTotal: 'Jumlah tunai',
    diff: 'Beza (ASBF − tunai)',
    gainAsbf: 'Untung bersih — ASBF',
    gainCash: 'Untung bersih — tunai',
    groupAsbf: 'Pilihan ASBF',
    groupCash: 'Pilihan tunai',
    groupCompare: 'Perbandingan',

    dsrTitle: 'DSR & kelayakan pinjaman rumah',
    dsrLimit: 'Had komitmen (60% gaji)',
    dsrRatio: 'DSR dengan ASBF',
    dsrRatioWithout: 'DSR tanpa ASBF',
    homeWithout: 'Kelayakan rumah tanpa ASBF',
    homeWith: 'Kelayakan rumah dengan ASBF',
    homeReduction: 'Pengurangan kelayakan',
    dsrNote: 'Anggaran pinjaman rumah pada 4% selama 35 tahun.',
    dsrOver: 'Komitmen anda melebihi had 60%. Bank berkemungkinan menolak pembiayaan baharu.',

    tableTitle: 'Jadual tahun demi tahun',
    tableHint: 'Ketik baris untuk pilih tahun.',
    colYear: 'Tahun',
    colUnits: 'Unit ASBF',
    colLoan: 'Baki pembiayaan',
    colSurrender: 'Nilai serahan',
    colAsbf: 'Jumlah ASBF',
    colCash: 'Jumlah tunai',
    colDiff: 'Beza',
    colPaid: 'Jumlah dibayar',
    selectYear: 'Pilih tahun {y}',

    barInstallment: 'Ansuran',
    barDiff: 'Beza thn {y}',

    info: 'Maklumat: {topic}',
    tipKas:
      'KAS ialah Kadar Asas Standard (SBR), kadar rujukan yang mengikut Kadar Dasar Semalaman (OPR) Bank Negara. Kadar ASBF = KAS + margin bank, jadi ansuran anda boleh naik atau turun apabila OPR berubah.',
    tipTakaful:
      'Takaful melangsaikan baki pembiayaan jika berlaku kematian atau hilang upaya kekal. Di sini ia dibayar sekali sahaja dan dimasukkan ke dalam jumlah pembiayaan, jadi anda turut membayar keuntungan bank ke atasnya.',
    tipSurrender:
      'Nilai serahan ialah wang yang anda terima jika menutup ASBF awal: nilai unit ASB tolak baki pembiayaan (dan fi penamatan, jika ada). Bank mungkin kenakan fi penamatan awal, dan takaful biasanya tidak dipulangkan sepenuhnya.',
    tipDsr:
      'DSR (Nisbah Khidmat Hutang) ialah peratus gaji bersih yang digunakan untuk membayar komitmen bulanan bank. Kalkulator ini menggunakan had 60%; had sebenar berbeza mengikut bank dan pendapatan.',
    tipBreakEven:
      'Kadar dividen ASB yang menjadikan ASBF dan simpanan tunai sama nilainya di hujung tempoh. Jika dividen sebenar lebih rendah, simpanan tunai lebih baik.',
    tipExitFee:
      'Sesetengah bank mengenakan fi jika ASBF ditutup dalam tempoh kunci. Jumlah ini ditolak daripada nilai serahan bagi setiap tahun sebelum tempoh tamat. Biarkan 0 jika tiada.',
    tipBankProfit:
      'Jumlah semua ansuran tolak jumlah yang dibiayai (pembiayaan + takaful). Inilah kos meminjam jika anda kekal hingga habis tempoh.',

    disclaimer:
      'Penafian: Anggaran sahaja, bukan nasihat kewangan atau kelulusan pembiayaan. Dividen ASB tidak dijamin, dan kadar berasaskan KAS boleh berubah. Semak Surat Tawaran dan Helaian Pendedahan Produk daripada bank anda.',
    offlineReady: 'Boleh dipasang dan digunakan tanpa internet.',
  },

  en: {
    appTitle: 'ASBF vs ASB Calculator',
    tagline: 'Borrow to buy ASB, or save the same amount yourself every month?',
    share: 'Share',
    reset: 'Reset',
    resetLong: 'Reset to defaults',
    langSwitch: 'Switch language',
    copied: 'Link copied',
    copyFailed: 'Could not copy. Copy this link:',
    resetDone: 'Defaults restored',

    inputs: 'Your details',
    presets: 'Quick presets',
    presetLabel: 'RM{amt}k / {yrs} yrs',
    financing: 'Financing amount',
    tenure: 'Tenure',
    rate: 'Financing rate',
    takaful: 'Takaful (one-off, financed)',
    dividend: 'ASB dividend',
    dividendChips: 'Dividend scenarios',
    balance: 'Current ASB balance',
    salary: 'Net monthly salary',
    commitments: 'Other bank commitments per month',
    exitFee: 'Early exit fee (optional)',
    knownInstallment: 'My actual installment (optional)',
    installmentEmpty: 'Already have ASBF? Type your monthly installment. Leave empty to calculate it from the rate.',
    installmentInvalid:
      'This installment does not fit this amount and tenure, so the rate above is used ({calc}/month). Check the financing amount and tenure.',
    rateImplied: 'Worked out from your installment: {rate}% a year. Clear the installment to change the rate.',
    tipKnownInstallment:
      'If you already know your monthly installment (for example RM499), type it here. The calculator works out the financing rate that matches your amount, takaful and tenure, and uses this installment in every calculation.',
    year: 'Close / review year',
    years: 'years',
    yearShort: 'yrs',
    perMonth: '/month',
    range: 'Range: {min} – {max}',
    emptyZero: 'Empty — treated as RM0',
    enterSalary: 'Enter a salary to see DSR',
    asbLimit:
      'Current balance + ASBF = {total}, above the RM200,000 ASB holding limit. The bank may approve a lower amount.',

    verdictAsbf: 'At {div}%, ASBF gives you {amt} more after {y} years.',
    verdictCash: 'At {div}%, saving cash gives you {amt} more after {y} years.',
    verdictEven: 'At {div}%, both options are about equal after {y} years.',

    cardInstallment: 'Monthly installment',
    cardBankProfit: 'Total profit to bank',
    cardBankProfitSub: 'over {y} years',
    cardDiff: 'Difference in year {y}',
    cardBreakEven: 'Break-even dividend',
    cardBreakEvenSub: 'ASBF wins if the dividend stays above this',
    noBreakEven: 'None',
    asbfWins: 'ASBF wins',
    cashWins: 'Cash wins',
    even: 'Even',

    chartTitle: 'Net worth by year',
    chartHint: 'Tap or hover the chart to select a year.',
    chartAria:
      'Line chart of net worth for ASBF, cash savings and total paid from year 1 to {y}. Full details are in the table below.',
    seriesAsbf: 'ASBF',
    seriesCash: 'Cash',
    seriesPaid: 'Total paid',
    yearN: 'Year {y}',

    closeTitle: 'If you close in year {y}',
    units: 'ASBF units',
    loan: 'Loan balance',
    fee: 'Early exit fee',
    surrender: 'Surrender value',
    own: 'Own ASB',
    asbfTotal: 'ASBF total',
    totalPaid: 'Total paid',
    cashSaved: 'Cash savings built up',
    cashTotal: 'Cash total',
    diff: 'Difference (ASBF − cash)',
    gainAsbf: 'Net gain — ASBF',
    gainCash: 'Net gain — cash',
    groupAsbf: 'ASBF option',
    groupCash: 'Cash option',
    groupCompare: 'Comparison',

    dsrTitle: 'DSR & home loan eligibility',
    dsrLimit: 'Commitment limit (60% of salary)',
    dsrRatio: 'DSR with ASBF',
    dsrRatioWithout: 'DSR without ASBF',
    homeWithout: 'Home loan without ASBF',
    homeWith: 'Home loan with ASBF',
    homeReduction: 'Reduction in eligibility',
    dsrNote: 'Home loan estimated at 4% over 35 years.',
    dsrOver: 'Your commitments exceed the 60% limit. A bank is likely to decline new financing.',

    tableTitle: 'Year-by-year table',
    tableHint: 'Tap a row to select that year.',
    colYear: 'Year',
    colUnits: 'ASBF units',
    colLoan: 'Loan balance',
    colSurrender: 'Surrender value',
    colAsbf: 'ASBF total',
    colCash: 'Cash total',
    colDiff: 'Difference',
    colPaid: 'Total paid',
    selectYear: 'Select year {y}',

    barInstallment: 'Installment',
    barDiff: 'Diff. yr {y}',

    info: 'Info: {topic}',
    tipKas:
      'KAS is Kadar Asas Standard, the Standardised Base Rate (SBR) that follows Bank Negara’s Overnight Policy Rate (OPR). The ASBF rate = KAS + the bank’s margin, so your installment can go up or down when the OPR changes.',
    tipTakaful:
      'Takaful settles the outstanding financing if you die or become permanently disabled. Here it is paid once and added to the financed amount, so you also pay bank profit on it.',
    tipSurrender:
      'Surrender value is the money you get if you close the ASBF early: the value of the ASB units minus the outstanding loan (and any exit fee). Banks may charge an early settlement fee, and takaful is usually not refunded in full.',
    tipDsr:
      'DSR (Debt Service Ratio) is the share of your net salary that goes to monthly bank commitments. This calculator uses a 60% limit; actual limits vary by bank and income.',
    tipBreakEven:
      'The ASB dividend rate at which ASBF and cash savings end up equal at the end of the tenure. If actual dividends are lower, saving cash is better.',
    tipExitFee:
      'Some banks charge a fee if you close the ASBF within a lock-in period. This amount is deducted from the surrender value for every year before the tenure ends. Leave it at 0 if none applies.',
    tipBankProfit:
      'All installments added up, minus the amount financed (financing + takaful). This is the cost of borrowing if you stay for the full tenure.',

    disclaimer:
      'Disclaimer: Estimates only, not financial advice or a financing approval. ASB dividends are not guaranteed, and KAS-based rates can change. Check the bank’s Letter of Offer and Product Disclosure Sheet.',
    offlineReady: 'Installable and works offline.',
  },
};

export function makeT(lang) {
  const dict = STRINGS[lang] || STRINGS.bm;
  return (key, vars) => {
    let s = dict[key] ?? STRINGS.en[key] ?? key;
    if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k]);
    return s;
  };
}

const whole = new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const neg = (n, body) => (n < 0 ? `−${body}` : body);

/** RM1,234 (whole ringgit; avoids "-0"). */
export function rm(n) {
  const v = Math.round(n);
  return neg(v, `RM${whole.format(Math.abs(v))}`);
}

/** RM497.18 */
export function rm2(n) {
  return neg(n, `RM${cents.format(Math.abs(n))}`);
}

/** +RM1,234 / −RM1,234 */
export function rmSigned(n) {
  const v = Math.round(n);
  return v > 0 ? `+${rm(v)}` : rm(v);
}

export function rmCompact(n) {
  const a = Math.abs(n);
  if (a >= 1e6) return neg(n, `RM${+(a / 1e6).toFixed(1)}M`);
  if (a >= 1e3) return neg(n, `RM${Math.round(a / 1e3)}k`);
  return rm(n);
}

export const num = (n) => whole.format(n);
export const pct = (n, dp = 2) => `${(+n).toFixed(dp)}%`;
/** 5.75 -> "5.75", 4 -> "4", 4.5 -> "4.5" */
export const trimPct = (n) => String(+(+n).toFixed(2));
