const billEl   = document.getElementById('bill');
const tipEl    = document.getElementById('tip');
const tipBtns  = document.querySelectorAll('.tip-btn');
const tipAmtEl = document.getElementById('tipAmt');
const totalEl  = document.getElementById('totalBill');
const tipPerEl = document.getElementById('tipPer');
const perEl    = document.getElementById('perPerson');
const peopleEl = document.getElementById('peopleVal');
let people = 1;

const fmt = n => '$' + n.toFixed(2);

function calc() {
  const bill   = parseFloat(billEl.value) || 0;
  const tip    = parseFloat(tipEl.value)  || 0;
  const tipAmt = bill * tip / 100;
  const total  = bill + tipAmt;
  tipAmtEl.textContent = fmt(tipAmt);
  totalEl.textContent  = fmt(total);
  tipPerEl.textContent = fmt(tipAmt / people);
  perEl.textContent    = fmt(total  / people);
}

tipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tipBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tipEl.value = btn.dataset.val;
    calc();
  });
});

tipEl.addEventListener('input', () => {
  tipBtns.forEach(b => b.classList.remove('active'));
  calc();
});

billEl.addEventListener('input', calc);

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

document.getElementById('resetBtn').addEventListener('click', () => {
  billEl.value = '';
  tipEl.value  = 15;
  people = 1;
  peopleEl.textContent = 1;
  tipBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('[data-val="15"]').classList.add('active');
  calc();
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

calc();
