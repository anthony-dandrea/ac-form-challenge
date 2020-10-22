/*
  Normally would throw this all in an IIFE to encapsulate these variables.
  But left them global so one could more easily play around in the console.
*/
const SESSION_STORATE_ID = 'donationFund';

// Query DOM and save necessary elements
const form = document.forms.donateForm;
const reset = document.querySelector('[data-reset]');
const amount = document.getElementById('amount');
const diff = document.querySelector('[data-diff]');
const donorCount = document.querySelector('[data-donors]');
const ariaLive = document.getElementById('ariaLive');
const progress = document.querySelector('progress');
const time = document.querySelector('time');
const fieldset = form.querySelector('fieldset');
const blurb = document.querySelector('.topBlurb');

// For the reset
let isDone = false;

// Setup data model for fund
const projectFundDefaultConfig = { goal: 5000, current: 0, donors: 0 };
class ProjectFund {
  constructor({ goal, current, donors } = projectFundDefaultConfig, { onDonate, onDone }) {
    this.goal = goal;
    this.current = current;
    this.donors = donors;
    this.difference = goal - current;
    this.onDone = onDone;
    this.onDonate = onDonate;
    onDonate?.(this);
    if (this.difference === 0 && onDone) {
      onDone(this);
    }
  }

  donate = (amount = 0) => {
    this.current += amount;
    this.donors++;
    this.difference = this.goal - this.current;
    this.onDonate?.(this);
    this.save();
    if (this.difference === 0) {
      this.onDone?.(this);
    }
  };

  save = () => {
    const { goal, current, donors, difference } = this;
    sessionStorage[SESSION_STORATE_ID] = JSON.stringify({
      goal, current, donors 
    })
  };

  reset = () => {
    const { goal, current, donors } = projectFundDefaultConfig;
    this.goal = goal;
    this.current = current;
    this.donors = donors;
    this.difference = this.goal - this.current;
    this.onDonate?.(this);
  };
}

// Helper to ensure we don't get snagged on any malformed JSON strings
const tryParse = (possibleJsonString) => {
  let json;
  try {
    json = JSON.parse(possibleJsonString);
  } catch(e) {
    // Would likely save an error log somewhere here
  }
  return json;
};

const initConfig = tryParse(sessionStorage[SESSION_STORATE_ID])

// Very naive pluralize helper
const pluralize = (str, count) => count === 1 ? str : `${str}s`;

const onDone = ({ donors }) => {
  form.querySelector('h1').innerText = 'Project fully funded!🎈🎉🎊';
  form.querySelector('p').innerText = `Thanks to the ${donors} ${pluralize('donor', donors)} who supported this project.`;
  fieldset.classList.add('hidden');
  blurb.classList.add('hidden');
  isDone = true;
};

const onDonate = ({ goal, current, difference, donors }) => {
  // Update top "still needed" text
  if (diff) {
    diff.innerText = difference;
  }
  // Update donor count
  if (donorCount) {
    donorCount.innerText = donors;
  }
  // Update input max so we don't go over
  if (amount) {
    amount.max = difference;
    // If someone donates 4999, I want to let someone donate the last dollar
    if (difference < 5) {
      amount.min = 1;
    }
  }
  // Announce submit on aria-live
  if (ariaLive && amount.value) {
    ariaLive.innerText = `Success! Thank you for your donation of ${amount.value} dollars!`;
  }
  // Update progress bar
  if (progress) {
    progress.max = goal;
    progress.value = current;
    progress.innerText = current;
  }
  // Reset form
  form?.reset();
};

// Initialize form
const fund = new ProjectFund(initConfig, { onDonate, onDone });

// Add event listener
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (amount) {
    fund.donate(parseInt(amount.value));
  }
});

reset?.addEventListener('click', () => {
  fund.reset();
  delete sessionStorage[SESSION_STORATE_ID];
  if (isDone) {
    location.reload();
  }
});

// Set four days from now time tag
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 4); // 4 days ahead
time.dateTime = `${futureDate.getFullYear()}-${futureDate.getMonth() + 1}-${futureDate.getDate()}`;
