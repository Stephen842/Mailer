// profile.js

// Validation: redirect if no onboarding data
if(!localStorage.getItem("userName") || !localStorage.getItem("userPod")) {
  window.location.href = "onboarding.html";
}

// Load and display current profile data
function loadProfileData() {
  const userName = localStorage.getItem('userName') || '';
  const userEmail = localStorage.getItem('userEmail') || '';
  const userPod = localStorage.getItem('userPod') || 'Creator';
  const userGoal = localStorage.getItem('goal') || 'Get Skilled';
  
  document.getElementById('profile-name').value = userName;
  document.getElementById('profile-email').value = userEmail;
  document.getElementById('profile-pod').value = userPod;
  document.getElementById('profile-goal').value = userGoal;
  
  // Load and display stats
  const xp = localStorage.getItem('userXP') || 0;
  const level = localStorage.getItem('level') || 1;
  const completedLessons = Object.keys(JSON.parse(localStorage.getItem('lessonState') || '{}')).length;
  
  document.getElementById('total-xp').textContent = xp;
  document.getElementById('user-level').textContent = level;
  document.getElementById('completed-lessons').textContent = completedLessons;
  document.getElementById('user-pod-badge').textContent = userPod.charAt(0);
}

// Save profile changes
function saveProfileChanges() {
  const newName = document.getElementById('profile-name').value.trim();
  const newEmail = document.getElementById('profile-email').value.trim();
  const newPod = document.getElementById('profile-pod').value;
  const newGoal = document.getElementById('profile-goal').value;
  
  if (!newName || !newEmail) {
    showToast('Please fill in all required fields!');
    return;
  }
  
  localStorage.setItem('userName', newName);
  localStorage.setItem('userEmail', newEmail);
  localStorage.setItem('userPod', newPod);
  localStorage.setItem('goal', newGoal);
  
  // Update stats display
  document.getElementById('user-pod-badge').textContent = newPod.charAt(0);
  
  showToast('Profile updated successfully! Redirecting to dashboard...');
  
  // Redirect after a short delay
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1500);
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to log out? This will clear your current session.')) {
    // Clear all localStorage data
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPod');
    localStorage.removeItem('goal');
    localStorage.removeItem('xp');
    localStorage.removeItem('level');
    localStorage.removeItem('userXP');
    localStorage.removeItem('lessonState');
    
    // Redirect to home page
    window.location.href = 'index.html';
  }
}

// Toast notification
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-gold text-charcoal font-bold px-6 py-3 rounded-full shadow-lg animate-fadeIn cursor-pointer whitespace-nowrap';
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
  
  toast.addEventListener('click', () => toast.remove());
}

// Event listeners
document.getElementById('save-profile-btn').addEventListener('click', saveProfileChanges);
document.getElementById('logout-btn').addEventListener('click', logout);

// Load profile data on page load
loadProfileData();

document.addEventListener('DOMContentLoaded', function() {
  const refCode = localStorage.getItem('referralCode') || '';
  if(refCode && document.getElementById('profile-user-referral')) {
    document.getElementById('profile-user-referral').firstElementChild.textContent = refCode;
    document.getElementById('copy-referral-btn').onclick = () => {
      navigator.clipboard.writeText(refCode);
      alert('Referral code copied!');
    };
  }
});

const avatarImg = document.getElementById('profile-avatar-img');
const avatarInput = document.getElementById('profile-avatar-input');
const avatarUploadBtn = document.getElementById('profile-avatar-upload');

function setAvatarDisplay() {
  const avatar = localStorage.getItem('userAvatar');
  if (avatar) {
    avatarImg.src = avatar;
    avatarImg.alt = 'User Avatar';
  } else {
    // Show default (initials or emoji)
    const userName = localStorage.getItem('userName')||'';
    const initials = userName.split(' ').map(n=>n[0]).join('').toUpperCase()||'👤';
    // Generate SVG fallback with initials
    avatarImg.src=`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect fill='%23f6c960' width='80' height='80'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' fill='black' font-size='32' font-family='Arial'>${initials}</text></svg>`;
    avatarImg.alt = 'Default Avatar';
  }
}
setAvatarDisplay();
avatarUploadBtn.onclick = () => avatarInput.click();
avatarInput.onchange = function(e) {
  const file = avatarInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    localStorage.setItem('userAvatar', ev.target.result);
    setAvatarDisplay();
    alert('Avatar updated!');
  };
  reader.readAsDataURL(file);
};

