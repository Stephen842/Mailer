// js/onboarding.js

const steps = [
  document.getElementById("step-1"),
  document.getElementById("step-2"),
  document.getElementById("step-3")
];
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");

let currentStep = 0;
let selectedPod = "";
let selectedGoal = "";

// Step 1: Pod selection
const podCards = document.querySelectorAll(".pod-card");
const nextToStep2 = document.getElementById("next-to-step-2");
podCards.forEach(card => {
  card.addEventListener("click", function () {
    podCards.forEach(c => c.classList.remove("border-gold", "ring-2"));
    this.classList.add("border-gold", "ring-2");
    selectedPod = this.getAttribute("data-pod");
    nextToStep2.disabled = false;
  });
});
nextToStep2.addEventListener("click", function () { moveToStep(1); });

// Step 2: Goal selection
const backToStep1 = document.getElementById("back-to-step-1");
const nextToStep3 = document.getElementById("next-to-step-3");
const goalRadios = document.querySelectorAll("input[name='goal']");
goalRadios.forEach(radio => {
  radio.addEventListener("change", function () {
    selectedGoal = this.value;
    nextToStep3.disabled = false;
  });
});
backToStep1.addEventListener("click", () => moveToStep(0));
nextToStep3.addEventListener("click", () => moveToStep(2));

// Step 3: User details
const backToStep2 = document.getElementById("back-to-step-2");
const onboardingForm = document.getElementById("onboarding-form");
const connectWalletBtn = document.getElementById("connect-wallet-later");
let walletLater = false;
connectWalletBtn.addEventListener("click", function () {
  walletLater = !walletLater;
  this.classList.toggle("bg-gold", walletLater);
  this.classList.toggle("text-charcoal", walletLater);
});
backToStep2.addEventListener("click", () => moveToStep(1));
onboardingForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  // Referral logic
  const referralRaw = document.getElementById('referral-code-input')?.value.trim()||'';
  if (referralRaw) localStorage.setItem('referredBy', referralRaw);
  // Generate user referralCode
  const refPart = userName.split(' ')[0]||'user';
  const myRefCode = refPart.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,8) + (Math.floor(1000+Math.random()*9000));
  localStorage.setItem('referralCode', myRefCode);
  localStorage.setItem("userPod", selectedPod);
  localStorage.setItem("goal", selectedGoal);
  localStorage.setItem("userName", userName);
  localStorage.setItem("userEmail", email);
  const pw1 = document.getElementById('onboarding-password').value;
  const pw2 = document.getElementById('onboarding-password-confirm').value;
  const pwErr = document.getElementById('onboarding-pw-error');
  pwErr.classList.add('hidden');
  if(!pw1 || pw1.length<3) { pwErr.textContent='Password too short (min 3 chars).'; pwErr.classList.remove('hidden'); return; }
  if(pw1!==pw2) { pwErr.textContent='Passwords do not match.'; pwErr.classList.remove('hidden'); return; }
  const profile = { name: userName, email, password: pw1, pod: selectedPod, goal: selectedGoal, joined: new Date().toLocaleString() };
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  if(users.find(u=>u.email===email)) { alert('An account with that email already exists.'); return; }
  users.push(profile); localStorage.setItem('users', JSON.stringify(users));
  let rememberMeFlag = localStorage.getItem('_rememberMe');
  if(rememberMeFlag==='yes') { localStorage.setItem('sessionUser',JSON.stringify(profile)); localStorage.removeItem('_rememberMe'); }
  else sessionStorage.setItem('sessionUser',JSON.stringify(profile));
  window.location = 'dashboard.html';
});

function moveToStep(stepIdx) {
  steps.forEach((s, i) => s.classList.toggle("hidden", i !== stepIdx));
  currentStep = stepIdx;
  if (progressBar) progressBar.style.width = `${(stepIdx + 1) / steps.length * 100}%`;
  if (progressLabel) progressLabel.textContent = `Step ${stepIdx + 1} of 3`;
  if (stepIdx === 0) nextToStep2.disabled = !selectedPod;
  if (stepIdx === 1) nextToStep3.disabled = !selectedGoal;
}
moveToStep(0);
