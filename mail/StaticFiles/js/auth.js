// Auth page logic (user accounts only)
const regBtn = document.getElementById('auth-register-btn');
const loginBtn = document.getElementById('auth-login-btn');
const loginForm = document.getElementById('user-login-form');
const loginError = document.getElementById('login-user-error');
const forgotPwLink = document.getElementById('forgot-password-link');
const resetPwForm = document.getElementById('reset-password-form');
const resetMsg = document.getElementById('reset-pw-msg');
const rememberMe = document.getElementById('login-remember-me');
regBtn && (regBtn.onclick = ()=>window.location='onboarding.html');
loginBtn && (loginBtn.onclick = ()=>{ loginForm.classList.remove('hidden'); loginError.classList.add('hidden'); resetPwForm.classList.add('hidden'); });
loginForm && loginForm.addEventListener('submit', function(e){
  e.preventDefault(); loginError.classList.add('hidden');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  const u = users.find(x=>x.email===email && x.password===password);
  if(u) {
    if(rememberMe && rememberMe.checked) localStorage.setItem('sessionUser',JSON.stringify(u));
    else sessionStorage.setItem('sessionUser',JSON.stringify(u));
    window.location = 'dashboard.html'; return;
  }
  loginError.textContent='Invalid email or password.'; loginError.classList.remove('hidden');
});
// Redirect if already logged in
window.addEventListener('DOMContentLoaded',()=>{
  if(localStorage.getItem('sessionUser')) window.location='dashboard.html';
});
// Forgot password logic
forgotPwLink && (forgotPwLink.onclick = e=>{e.preventDefault(); loginForm.classList.add('hidden'); resetPwForm.classList.remove('hidden');resetMsg.classList.add('hidden');});
resetPwForm && resetPwForm.addEventListener('submit',function(e){
  e.preventDefault(); resetMsg.classList.add('hidden');
  const email = document.getElementById('reset-email').value.trim();
  const newpw = document.getElementById('reset-new-pw').value;
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  const idx = users.findIndex(u=>u.email===email);
  if(idx>-1) {users[idx].password=newpw;localStorage.setItem('users',JSON.stringify(users)); resetMsg.textContent='Password reset! You can now login.'; resetMsg.classList.remove('hidden'); setTimeout(()=>{resetPwForm.classList.add('hidden');loginForm.classList.remove('hidden');},1500);} else { resetMsg.textContent='Email not found.'; resetMsg.classList.remove('hidden');}
});
