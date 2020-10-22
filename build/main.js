"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
  Normally would throw this all in an IIFE to encapsulate these variables.
  But left them global so one could more easily play around in the console.
*/
var SESSION_STORATE_ID = 'donationFund'; // Query DOM and save necessary elements

var form = document.forms.donateForm;
var reset = document.querySelector('[data-reset]');
var amount = document.getElementById('amount');
var diff = document.querySelector('[data-diff]');
var donorCount = document.querySelector('[data-donors]');
var ariaLive = document.getElementById('ariaLive');
var progress = document.querySelector('progress');
var time = document.querySelector('time');
var fieldset = form.querySelector('fieldset');
var blurb = document.querySelector('.topBlurb'); // For the reset

var isDone = false; // Setup data model for fund

var projectFundDefaultConfig = {
  goal: 5000,
  current: 0,
  donors: 0
};

var ProjectFund = function ProjectFund() {
  var _this = this;

  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : projectFundDefaultConfig,
      _goal = _ref.goal,
      _current = _ref.current,
      _donors = _ref.donors;

  var _ref2 = arguments.length > 1 ? arguments[1] : undefined,
      onDonate = _ref2.onDonate,
      onDone = _ref2.onDone;

  _classCallCheck(this, ProjectFund);

  _defineProperty(this, "donate", function () {
    var _this$onDonate;

    var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    _this.current += amount;
    _this.donors++;
    _this.difference = _this.goal - _this.current;
    (_this$onDonate = _this.onDonate) === null || _this$onDonate === void 0 ? void 0 : _this$onDonate.call(_this, _this);

    _this.save();

    if (_this.difference === 0) {
      var _this$onDone;

      (_this$onDone = _this.onDone) === null || _this$onDone === void 0 ? void 0 : _this$onDone.call(_this, _this);
    }
  });

  _defineProperty(this, "save", function () {
    var goal = _this.goal,
        current = _this.current,
        donors = _this.donors,
        difference = _this.difference;
    sessionStorage[SESSION_STORATE_ID] = JSON.stringify({
      goal: goal,
      current: current,
      donors: donors
    });
  });

  _defineProperty(this, "reset", function () {
    var _this$onDonate2;

    var goal = projectFundDefaultConfig.goal,
        current = projectFundDefaultConfig.current,
        donors = projectFundDefaultConfig.donors;
    _this.goal = goal;
    _this.current = current;
    _this.donors = donors;
    _this.difference = _this.goal - _this.current;
    (_this$onDonate2 = _this.onDonate) === null || _this$onDonate2 === void 0 ? void 0 : _this$onDonate2.call(_this, _this);
  });

  this.goal = _goal;
  this.current = _current;
  this.donors = _donors;
  this.difference = _goal - _current;
  this.onDone = onDone;
  this.onDonate = onDonate;
  onDonate === null || onDonate === void 0 ? void 0 : onDonate(this);

  if (this.difference === 0 && onDone) {
    onDone(this);
  }
}; // Helper to ensure we don't get snagged on any malformed JSON strings


var tryParse = function tryParse(possibleJsonString) {
  var json;

  try {
    json = JSON.parse(possibleJsonString);
  } catch (e) {// Would likely save an error log somewhere here
  }

  return json;
};

var initConfig = tryParse(sessionStorage[SESSION_STORATE_ID]); // Very naive pluralize helper

var pluralize = function pluralize(str, count) {
  return count === 1 ? str : "".concat(str, "s");
};

var onDone = function onDone(_ref3) {
  var donors = _ref3.donors;
  form.querySelector('h1').innerText = 'Project fully funded!🎈🎉🎊';
  form.querySelector('p').innerText = "Thanks to the ".concat(donors, " ").concat(pluralize('donor', donors), " who supported this project.");
  fieldset.classList.add('hidden');
  blurb.classList.add('hidden');
  isDone = true;
};

var onDonate = function onDonate(_ref4) {
  var goal = _ref4.goal,
      current = _ref4.current,
      difference = _ref4.difference,
      donors = _ref4.donors;

  // Update top "still needed" text
  if (diff) {
    diff.innerText = difference;
  } // Update donor count


  if (donorCount) {
    donorCount.innerText = donors;
  } // Update input max so we don't go over


  if (amount) {
    amount.max = difference; // If someone donates 4999, I want to let someone donate the last dollar

    if (difference < 5) {
      amount.min = 1;
    }
  } // Announce submit on aria-live


  if (ariaLive && amount.value) {
    ariaLive.innerText = "Success! Thank you for your donation of ".concat(amount.value, " dollars!");
  } // Update progress bar


  if (progress) {
    progress.max = goal;
    progress.value = current;
    progress.innerText = current;
  } // Reset form


  form === null || form === void 0 ? void 0 : form.reset();
}; // Initialize form


var fund = new ProjectFund(initConfig, {
  onDonate: onDonate,
  onDone: onDone
}); // Add event listener

form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (amount) {
    fund.donate(parseInt(amount.value));
  }
});
reset === null || reset === void 0 ? void 0 : reset.addEventListener('click', function () {
  fund.reset();
  delete sessionStorage[SESSION_STORATE_ID];

  if (isDone) {
    location.reload();
  }
}); // Set four days from now time tag

var futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 4); // 4 days ahead

time.dateTime = "".concat(futureDate.getFullYear(), "-").concat(futureDate.getMonth() + 1, "-").concat(futureDate.getDate());
//# sourceMappingURL=build/main.js.map
