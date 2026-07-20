const fareEl     = document.getElementById('fare');
const tipPctEl   = document.getElementById('tipPct');
const tipBtns    = document.querySelectorAll('#tipBtns .tip-btn');
const roundBtns  = document.querySelectorAll('#roundBtns .tip-btn');
const peopleEl   = document.getElementById('peopleVal');

let people    = 1;
let roundUp   = false;
let service   = 'ride';

const fmt = n => '$' + n.toFixed(2);

function calc() {
  const fare   = parseFloat(fareEl.value) || 0;
  const tipPct = parseFloat(tipPctEl.value) || 0;

  let tipAmt = fare * (tipPct / 100);
  let total  = fare + tipAmt;

  if (roundUp) {
    total  = Math.ceil(total);
    tipAmt = total - fare;
  }

  const perPerson = total / people;

  document.getElementById('fareDisplay').textContent      = fmt(fare);
  document.getElementById('tipDisplay').textContent       = fmt(tipAmt);
  document.getElementById('totalDisplay').textContent     = fmt(total);
  document.getElementById('perPersonDisplay').textContent = fmt(perPerson);

  // Suggested tips reference row
  document.getElementById('tip10').textContent = fmt(fare * 0.10);
  document.getElementById('tip15').textContent = fmt(fare * 0.15);
  document.getElementById('tip18').textContent = fmt(fare * 0.18);
  document.getElementById('tip20').textContent = fmt(fare * 0.20);
}

// Service type toggle — updates guide title
const guideTitle = document.getElementById('tipGuideTitle');
document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    service = btn.dataset.service;

    const titles = {
      ride:    'How Much to Tip Your Uber / Lyft Driver',
      eats:    'How Much to Tip for Uber Eats',
      airport: 'How Much to Tip for an Airport Ride',
      taxi:    'How Much to Tip a Taxi Driver',
    };
    guideTitle.textContent = titles[service];

    // Update default tip % per service type
    const defaults = { ride: 18, eats: 18, airport: 20, taxi: 15 };
    tipPctEl.value = defaults[service];
    tipBtns.forEach(b => b.classList.remove('active'));
    const matchBtn = document.querySelector(`#tipBtns [data-val="${defaults[service]}"]`);
    if (matchBtn) matchBtn.classList.add('active');

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

// Round up toggle
roundBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roundBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    roundUp = btn.dataset.round === 'yes';
    calc();
  });
});

// Fare input
fareEl.addEventListener('input', calc);

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
  fareEl.value   = '';
  tipPctEl.value = 18;
  people         = 1;
  roundUp        = false;
  service        = 'ride';
  peopleEl.textContent = 1;
  guideTitle.textContent = 'How Much to Tip Your Uber / Lyft Driver';
  document.querySelectorAll('#serviceTypeBtns .tip-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  roundBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
  tipBtns.forEach(b => b.classList.remove('active'));
  document.querySelector('#tipBtns [data-val="18"]').classList.add('active');
  calc();
});

calc();
