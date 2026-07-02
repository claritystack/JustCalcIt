// ── Tax data (2026) ──────────────────────────────────────────────
const STANDARD_DEDUCTION = { single: 15000, married: 30000, hoh: 22500 };

const BRACKETS = {
  single: [
    { min: 0,       max: 11925,  rate: 0.10 },
    { min: 11925,   max: 48475,  rate: 0.12 },
    { min: 48475,   max: 103350, rate: 0.22 },
    { min: 103350,  max: 197300, rate: 0.24 },
    { min: 197300,  max: 250525, rate: 0.32 },
    { min: 250525,  max: 626350, rate: 0.35 },
    { min: 626350,  max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0,       max: 23850,  rate: 0.10 },
    { min: 23850,   max: 96950,  rate: 0.12 },
    { min: 96950,   max: 206700, rate: 0.22 },
    { min: 206700,  max: 394600, rate: 0.24 },
    { min: 394600,  max: 501050, rate: 0.32 },
    { min: 501050,  max: 751600, rate: 0.35 },
    { min: 751600,  max: Infinity, rate: 0.37 },
  ],
  hoh: [
    { min: 0,       max: 17000,  rate: 0.10 },
    { min: 17000,   max: 64850,  rate: 0.12 },
    { min: 64850,   max: 103350, rate: 0.22 },
    { min: 103350,  max: 197300, rate: 0.24 },
    { min: 197300,  max: 250500, rate: 0.32 },
    { min: 250500,  max: 626350, rate: 0.35 },
    { min: 626350,  max: Infinity, rate: 0.37 },
  ],
};

const SS_WAGE_BASE = 184500;

function calcFederal(gross, filing) {
  const deduction = STANDARD_DEDUCTION[filing];
  const taxable = Math.max(0, gross - deduction);
  const brackets = BRACKETS[filing];
  let tax = 0;
  for (const b of brackets) {
    if (taxable <= b.min) break;
    tax += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return tax;
}

function calcFICA(gross) {
  const ss = Math.min(gross, SS_WAGE_BASE) * 0.062;
  const medicare = gross * 0.0145;
  const additionalMedicare = gross > 200000 ? (gross - 200000) * 0.009 : 0;
  return ss + medicare + additionalMedicare;
}

function calcNet(gross, filing) {
  const fed = calcFederal(gross, filing);
  const fica = calcFICA(gross);
  return { gross, fed, fica, net: gross - fed - fica };
}

function fmt(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function toAnnual(val, period, hours) {
  switch (period) {
    case 'hourly':   return val * hours * 52;
    case 'monthly':  return val * 12;
    case 'biweekly': return val * 26;
    default:         return val;
  }
}

// ── Raise type toggle ─────────────────────────────────────────────
let raiseType = 'percent';

document.querySelectorAll('#raiseTypeBtns .tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#raiseTypeBtns .tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    raiseType = btn.dataset.type;
    document.getElementById('percentField').style.display = raiseType === 'percent' ? '' : 'none';
    document.getElementById('flatField').style.display   = raiseType === 'flat'    ? '' : 'none';
  });
});

// ── Raise % presets ───────────────────────────────────────────────
document.querySelectorAll('#raisePresets .tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#raisePresets .tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('raisePercent').value = btn.dataset.pct;
  });
});

// ── Show hours field for hourly ───────────────────────────────────
document.getElementById('payPeriod').addEventListener('change', function () {
  document.getElementById('hoursField').style.display = this.value === 'hourly' ? '' : 'none';
});

// ── Calculate ─────────────────────────────────────────────────────
document.getElementById('calcBtn').addEventListener('click', () => {
  const rawPay = parseFloat(document.getElementById('currentPay').value);
  const period = document.getElementById('payPeriod').value;
  const hours  = parseFloat(document.getElementById('hoursPerWeek').value) || 40;
  const filing = document.getElementById('filingStatus').value;

  if (!rawPay || rawPay <= 0) { alert('Please enter your current pay.'); return; }

  const currentAnnual = toAnnual(rawPay, period, hours);

  let raiseAmount = 0;
  if (raiseType === 'percent') {
    const pct = parseFloat(document.getElementById('raisePercent').value);
    if (!pct || pct <= 0) { alert('Please enter a raise percentage.'); return; }
    raiseAmount = currentAnnual * (pct / 100);
  } else {
    raiseAmount = parseFloat(document.getElementById('raiseFlat').value);
    if (!raiseAmount || raiseAmount <= 0) { alert('Please enter a raise amount.'); return; }
  }

  const newAnnual = currentAnnual + raiseAmount;
  const oldCalc   = calcNet(currentAnnual, filing);
  const newCalc   = calcNet(newAnnual, filing);

  const extraNet         = newCalc.net - oldCalc.net;
  const extraNetMonth    = extraNet / 12;
  const extraNetBiweekly = extraNet / 26;

  // Results section
  document.getElementById('newSalaryDisplay').textContent      = fmt(newAnnual);
  document.getElementById('raiseAmountDisplay').textContent    = fmt(raiseAmount) + '/yr';
  document.getElementById('extraTakeHome').textContent         = fmt(extraNet) + '/yr';
  document.getElementById('extraTakeHomeMonth').textContent    = fmt(extraNetMonth);
  document.getElementById('extraTakeHomeBiweekly').textContent = fmt(extraNetBiweekly);

  // Compare section
  document.getElementById('oldGross').textContent = fmt(oldCalc.gross);
  document.getElementById('newGross').textContent = fmt(newCalc.gross);
  document.getElementById('oldFed').textContent   = fmt(oldCalc.fed);
  document.getElementById('newFed').textContent   = fmt(newCalc.fed);
  document.getElementById('oldFica').textContent  = fmt(oldCalc.fica);
  document.getElementById('newFica').textContent  = fmt(newCalc.fica);
  document.getElementById('oldNet').textContent   = fmt(oldCalc.net);
  document.getElementById('newNet').textContent   = fmt(newCalc.net);

  document.getElementById('results').style.display     = '';
  document.getElementById('compareCard').style.display = '';
  document.getElementById('resetBtn').style.display    = '';
  document.getElementById('calcBtn').style.display     = 'none';

  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── Reset ─────────────────────────────────────────────────────────
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('results').style.display     = 'none';
  document.getElementById('compareCard').style.display = 'none';
  document.getElementById('resetBtn').style.display    = 'none';
  document.getElementById('calcBtn').style.display     = '';
  document.getElementById('currentPay').value  = '';
  document.getElementById('raisePercent').value = '';
  document.getElementById('raiseFlat').value   = '';
  document.querySelectorAll('#raisePresets .tip-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#raiseTypeBtns .tip-btn').forEach((b, i) => {
    b.classList.toggle('active', i === 0);
  });
  raiseType = 'percent';
  document.getElementById('percentField').style.display = '';
  document.getElementById('flatField').style.display    = 'none';
});
