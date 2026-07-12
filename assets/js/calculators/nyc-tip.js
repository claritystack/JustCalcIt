const NYC_TAX = 0.08875;

const billEl        = document.getElementById('bill');
const tipPctEl      = document.getElementById('tipPct');
const tipBtns       = document.querySelectorAll('#tipBtns .tip-btn');
const inputTypeBtns = document.querySelectorAll('#inputTypeBtns .tip-btn');
const gratBtns      = document.querySelectorAll('#gratBtns .tip-btn');
const peopleEl      = document.getElementById('peopleVal');

let people      = 1;
let inputType   = 'pretax';
let gratType    = 'none';

const fmt = n => '$' + n.toFixed(2);

function getIncludedGrat(pretax) {
  if (gratType === 'none')   return 0;
  if (gratType === '18')     return pretax * 0.18;
  if (gratType === '20')     return pretax * 0.20;
  if (gratType === 'custom') return parseFloat(document.getElementById('customGrat').value) || 0;
  return 0;
}

function calc() {
  const rawBill = parseFloat(billEl.value) || 0;
  const tipPct  = parseFloat(tipPctEl.value) || 0;

  let pretax;
  if (inputType === 'pretax') {
    pretax = rawBill;
  } else {
    // Work backwards from post-tax total
    pretax = rawBill / (1 + NYC_TAX);
  }

  const tax          = pretax * NYC_TAX;
  const includedGrat = getIncludedGrat(pretax);
  const extraTip     = pretax * (tipPct / 100);
  const grand        = pretax + tax + includedGrat + extraTip;

  document.getElementById('pretaxDisplay').textContent      = fmt(pretax);
  document.getElementById('taxDisplay').textContent         = fmt(tax);
  document.getElementById('includedGratDisplay').textContent = fmt(includedGrat);
  document.getElementById('extraTipDisplay').textContent    = fmt(extraTip);
  document.getElementById('grandTotal').textContent         = fmt(grand);
  document.getElementById('perPerson').textContent          = fmt(grand / people);
}

// Input type toggle
inputTypeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    inputTypeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    inputType = btn.dataset.input;
    document.getElementById('billLabel').textContent =
      inputType === 'pretax' ? 'Bill Amount (before tax)' : 'Bill Amount (after tax)';
    calc();
  });
});

// Gratuity toggle
gratBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    gratBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    gratType = btn.dataset.grat;
    document.getElementById('customGratField').style.display =
      gratType === 'custom' ? '' : 'none';
    calc();
  });
});

// Tip % presets
tipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tipBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tipPctEl.value = btn.dataset.val;
    calc();
  });
});

tipPctEl.addEventListener('input', () => {
  tipBtns.forEach(b => b.classList.remove('active'));
  calc();
});

billEl.addEventListener('input', calc);
document.getElementById('customGrat').addEventListener('input', calc);

// People stepper
document.getElementById('plus').addEventListener('click', () => {
  people = Math.min(people + 1, 99);
  peopleEl.textContent = people;
  calc();
});
document.getElementById('minus').addEventListener('click', () => {
  people = Math.max(people - 1, 1);
  peopleEl.textContent = people;
  calc();
});

// Reset
document.getElementById('resetBtn').addEventListener('click', () => {
  billEl.value    = '';
  tipPctEl.value  = 18;
  people          = 1;
  inputType       = 'pretax';
  gratType        = 'none';
  peopleEl.textContent = 1;
  document.getElementById('billLabel').textContent = 'Bill Amount (before tax)';
  document.getElementById('customGratField').style.display = 'none';
  inputTypeBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
  gratBtns.forEach((b, i)      => b.classList.toggle('active', i === 0));
  tipBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('#tipBtns [data-val="18"]').classList.add('active');
  calc();
});

calc();
