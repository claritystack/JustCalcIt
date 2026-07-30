const billEl     = document.getElementById('bill');
const tipPctEl   = document.getElementById('tipPct');
const tipBtns    = document.querySelectorAll('#tipBtns .tip-btn');
const peopleEl   = document.getElementById('peopleVal');

let people        = 1;
let assistantTip  = 0;
let hasAssistant  = false;

const fmt = n => '$' + n.toFixed(2);

function calc() {
  const bill   = parseFloat(billEl.value) || 0;
  const tipPct = parseFloat(tipPctEl.value) || 0;
  assistantTip = hasAssistant ? (parseFloat(document.getElementById('assistantTip').value) || 0) : 0;

  const tip    = bill * (tipPct / 100);
  const total  = bill + tip + assistantTip;
  const perPerson = total / people;

  document.getElementById('billDisplay').textContent      = fmt(bill);
  document.getElementById('tipDisplay').textContent       = fmt(tip);
  document.getElementById('assistantDisplay').textContent = fmt(assistantTip);
  document.getElementById('totalDisplay').textContent     = fmt(total);
  document.getElementById('perPersonDisplay').textContent = fmt(perPerson);

  document.getElementById('tip15').textContent = fmt(bill * 0.15);
  document.getElementById('tip18').textContent = fmt(bill * 0.18);
  document.getElementById('tip20').textContent = fmt(bill * 0.20);
  document.getElementById('tip25').textContent = fmt(bill * 0.25);
}

// Service type toggle — updates default tip %
document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const defaultPct = btn.dataset.default;
    tipPctEl.value = defaultPct;
    tipBtns.forEach(b => b.classList.remove('active'));
    const match = document.querySelector(`#tipBtns [data-val="${defaultPct}"]`);
    if (match) match.classList.add('active');
    calc();
  });
});

// Assistant toggle
document.querySelectorAll('#assistantBtns .tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#assistantBtns .tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hasAssistant = btn.dataset.assistant === 'yes';
    document.getElementById('assistantAmtField').style.display = hasAssistant ? '' : 'none';
    document.getElementById('assistantRow').style.display      = hasAssistant ? '' : 'none';
    calc();
  });
});

document.getElementById('assistantTip').addEventListener('input', calc);

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

// People stepper
document.getElementById('plus').addEventListener('click', () => {
  people = Math.min(people + 1, 20);
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
  billEl.value   = '';
  tipPctEl.value = 20;
  people         = 1;
  hasAssistant   = false;
  peopleEl.textContent = 1;
  document.getElementById('assistantTip').value = '';
  document.getElementById('assistantAmtField').style.display = 'none';
  document.getElementById('assistantRow').style.display      = 'none';
  document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('#assistantBtns .tip-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  tipBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('#tipBtns [data-val="20"]').classList.add('active');
  calc();
});

calc();
