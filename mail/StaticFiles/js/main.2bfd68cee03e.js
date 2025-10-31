// main.js
import { renderHero } from './components/hero.js';
import { renderVision } from './components/vision.js';
import { renderGrowthLoop } from './components/growth-loop.js';
import { renderPods } from './components/pods.js';
import { renderPlans } from './components/plans.js';
import { renderCommunity } from './components/community.js';
import { renderTestimonials } from './components/testimonials.js';
import { renderCTAFooter } from './components/cta-footer.js';

const app = document.getElementById('app');

app.append(
  renderHero(),
  renderVision(),
  renderGrowthLoop(),
  renderPods(),
  renderPlans(),
  renderCommunity(),
  renderTestimonials(),
  renderCTAFooter()
);

// USER LOGIN/REGISTER HANDLING (Index)
const joinBtn = document.getElementById('join-movement-btn');
const authModal = document.getElementById('user-auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const regBtn = document.getElementById('auth-register-btn');
const loginBtn = document.getElementById('auth-login-btn');
const loginForm = document.getElementById('user-login-form');
const loginError = document.getElementById('login-user-error');
let loginMode = 'user';
const modeToggle = document.getElementById('login-mode-toggle');
if(joinBtn) joinBtn.onclick = e => { e.preventDefault(); authModal.classList.remove('hidden'); loginForm?.classList.add('hidden'); loginError?.classList.add('hidden'); };
if(closeAuthModal) closeAuthModal.onclick = ()=>authModal.classList.add('hidden');
if(regBtn) regBtn.onclick = ()=>window.location='onboarding.html';
if(loginBtn) loginBtn.onclick = ()=>{ loginForm.classList.remove('hidden'); loginError.classList.add('hidden'); };
if(modeToggle) modeToggle.onclick = function() {
  loginMode = (loginMode==='user') ? 'admin' : 'user';
  modeToggle.textContent=loginMode==='admin'?'Login as User':'Login as Admin';
  loginForm && (loginForm.querySelector('button[type="submit"]').textContent = loginMode==='admin' ? 'Admin Log In':'Log In');
};
loginForm && loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); loginError.classList.add('hidden');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if(loginMode==='admin') {
    let admins = JSON.parse(localStorage.getItem('adminAccounts')||'[]');
    const a = admins.find(u=>u.email===email && u.password===password);
    if(a) {
      sessionStorage.setItem('adminAuth','true');
      sessionStorage.setItem('adminRole',a.role);
      sessionStorage.setItem('adminName',a.name);
      sessionStorage.setItem('adminEmail',a.email);
      window.location = 'admin.html';
      return;
    }
  } else {
    let users = JSON.parse(localStorage.getItem('users')||'[]');
    const u = users.find(x=>x.email===email && x.password===password);
    if(u) {
      if(rememberMe && rememberMe.checked) localStorage.setItem('sessionUser',JSON.stringify(u));
      else sessionStorage.setItem('sessionUser',JSON.stringify(u));
      window.location = 'dashboard.html'; return;
    }
  }
  loginError.textContent='Invalid email or password.'; loginError.classList.remove('hidden');
});
// Remember Me: on login form
const rememberMe = document.getElementById('login-remember-me');
// Auto-redirect if remembered
window.addEventListener('DOMContentLoaded',()=>{
  if(localStorage.getItem('sessionUser')) window.location='dashboard.html';
});
// Forgot password logic
const forgotPwLink=document.getElementById('forgot-password-link');
const resetPwForm=document.getElementById('reset-password-form');
const resetMsg=document.getElementById('reset-pw-msg');
if(forgotPwLink) forgotPwLink.onclick=e=>{e.preventDefault(); loginForm.classList.add('hidden'); resetPwForm.classList.remove('hidden');resetMsg.classList.add('hidden');};
resetPwForm&&resetPwForm.addEventListener('submit',function(e){
  e.preventDefault(); resetMsg.classList.add('hidden');
  const email = document.getElementById('reset-email').value.trim();
  const newpw = document.getElementById('reset-new-pw').value;
  let success = false;
  if(loginMode==='admin') {
    let admins = JSON.parse(localStorage.getItem('adminAccounts')||'[]');
    const idx = admins.findIndex(u=>u.email===email);
    if(idx>-1) {admins[idx].password=newpw;localStorage.setItem('adminAccounts',JSON.stringify(admins)); success=true;}
  } else {
    let users = JSON.parse(localStorage.getItem('users')||'[]');
    const idx = users.findIndex(u=>u.email===email);
    if(idx>-1) {users[idx].password=newpw;localStorage.setItem('users',JSON.stringify(users)); success=true;}
  }
  if(success) { resetMsg.textContent='Password reset! You can now login.'; resetMsg.classList.remove('hidden'); setTimeout(()=>{resetPwForm.classList.add('hidden'); loginForm.classList.remove('hidden');},1500); }
  else { resetMsg.textContent='Email not found.'; resetMsg.classList.remove('hidden');}
});
// Close reset returns to main form
[loginForm,resetPwForm].forEach(f=>f&&f.addEventListener('reset',()=>{loginForm.classList.remove('hidden');resetPwForm.classList.add('hidden');}));
// Helpful: close modal on outside click
authModal && authModal.addEventListener('click', e=>{if(e.target===authModal)authModal.classList.add('hidden');});