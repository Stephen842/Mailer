// js/dashboard.js

// Validation: if userName or userPod not set, redirect to onboarding
if(!localStorage.getItem("userName") || !localStorage.getItem("userPod")) {
  window.location.href = "onboarding.html";
}

// User Info on Dashboard
const userName = localStorage.getItem('userName') || 'Learner';
const userPod = localStorage.getItem('userPod') || 'Pod';
const userGoal = localStorage.getItem('goal') || '';
document.getElementById('userName').textContent = userName;
document.getElementById('userPodBadge').textContent = userPod;

// Next Goal Text
const nextGoalText = {
  'Get Skilled': 'Complete your next live session! 🚀',
  'Build Projects': 'Start your first micro-project today!',
  'Find Work': 'Complete tasks to unlock job matching.',
  'Collaborate': 'Join a new pod collab this week!'
};
document.getElementById('nextGoal').textContent = nextGoalText[userGoal] || 'Progress to unlock more goals!';

// XP/Level management
let xp = Number(localStorage.getItem('xp') || 0);
let level = Number(localStorage.getItem('level') || 1);
const bar = document.getElementById('progressBar');
const xpVal = document.getElementById('xpValue');
const lvlVal = document.getElementById('levelValue');

function updateProgressDisplay() {
  let pct = Math.min(100, (xp / 100) * 100);
  bar.style.width = pct + '%';
  xpVal.textContent = xp + ' / 100';
  lvlVal.textContent = level;
}
updateProgressDisplay();

// Confetti effect (minimal, for Level Up)
function confettiBurst() {
  const confettiDiv = document.getElementById('confetti');
  confettiDiv.innerHTML = '';
  confettiDiv.classList.remove('hidden');
  for (let i = 0; i < 28; i++) {
    const c = document.createElement('div');
    c.className = 'fixed w-2 h-2 rounded-full z-50';
    c.style.background = ['#f6c960','#fff','#ffea9e','#ffd45b'][i%4];
    c.style.top = Math.random()*80+10+'%';
    c.style.left = Math.random()*98+1+'%';
    c.style.transform = `scale(${Math.random()*1.7+0.7})`;
    c.style.opacity = 1.0;
    confettiDiv.appendChild(c);
  }
  setTimeout(() => { confettiDiv.classList.add('hidden'); }, 1300);
}

// Gamified XP tracking system (Learn → Do → Earn)
let userXP = parseInt(localStorage.getItem('userXP')) || 0;
const progress = { learn: 0, do: 0, earn: 0 };

function updateXPDisplay() {
  document.getElementById('xp-display').innerText = `Total XP: ${userXP}`;
}

function updateJourneyProgress() {
  const maxXP = 99;
  const stageXP = Math.floor((userXP / maxXP) * 33);
  
  progress.learn = Math.min(stageXP, 33);
  progress.do = Math.max(0, Math.min(stageXP - 33, 33));
  progress.earn = Math.max(0, Math.min(stageXP - 66, 33));
  
  document.getElementById('learn-progress').style.width = `${progress.learn}%`;
  document.getElementById('do-progress').style.width = `${progress.do}%`;
  document.getElementById('earn-progress').style.width = `${progress.earn}%`;
  
  document.getElementById('learn-xp').textContent = Math.round(progress.learn) + '%';
  document.getElementById('do-xp').textContent = Math.round(progress.do) + '%';
  document.getElementById('earn-xp').textContent = Math.round(progress.earn) + '%';
  
  updateXPDisplay();
}

updateJourneyProgress();

// Toast notification function
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
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

// Complete Task button
const completeTaskBtn = document.getElementById('complete-task');
completeTaskBtn.addEventListener('click', function() {
  userXP = Math.min(userXP + 10, 99);
  localStorage.setItem('userXP', userXP);
  updateJourneyProgress();
  showToast('Task completed! +10 XP');
});

// Lesson Complete button (existing)
const lessonBtn = document.getElementById('completeLessonBtn');
lessonBtn.addEventListener('click', function() {
  xp = Number(localStorage.getItem('xp') || 0);
  level = Number(localStorage.getItem('level') || 1);
  xp += 10;
  if(xp >= 100) {
    level++;
    xp = 0;
    localStorage.setItem('level', level);
    confettiBurst();
  }
  localStorage.setItem('xp', xp);
  updateProgressDisplay();
  userXP = Math.min(userXP + 10, 99);
  localStorage.setItem('userXP', userXP);
  updateJourneyProgress();
});

// ============ GAMIFIED ENHANCEMENTS ============

// Badges System (Bronze/Silver/Gold based on XP)
function updateBadges() {
  const xp = parseInt(localStorage.getItem('userXP') || 0);
  const badges = document.querySelectorAll('#badges-container span');
  
  badges.forEach((badge, index) => {
    const milestone = [25, 50, 75];
    if (xp >= milestone[index]) {
      badge.style.opacity = '1';
      badge.style.transform = 'scale(1.2)';
    }
  });
}

// Weekly Challenge System
function initWeeklyChallenge() {
  const lastReset = localStorage.getItem('challengeResetDate');
  const now = new Date().getTime();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  
  if (!lastReset || (now - parseInt(lastReset)) > weekMs) {
    localStorage.setItem('challengeResetDate', now.toString());
    localStorage.setItem('weeklyChallengeProgress', '0');
  }
  
  const progress = parseInt(localStorage.getItem('weeklyChallengeProgress') || '0');
  const bar = document.getElementById('challenge-bar');
  const text = document.getElementById('challenge-progress');
  
  if (bar && text) {
    const pct = (progress / 2) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
    text.textContent = `${progress}/2`;
    
    if (progress >= 2) {
      text.textContent = 'Completed! 🎉';
      showToast('Weekly challenge completed!');
    }
  }
}

// Update Leaderboard
function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const currentUser = {
    name: localStorage.getItem('userName'),
    xp: parseInt(localStorage.getItem('userXP') || '0'),
    pod: localStorage.getItem('userPod')
  };
  
  const existingIndex = leaderboard.findIndex(u => u.name === currentUser.name);
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = currentUser;
  } else {
    leaderboard.push(currentUser);
  }
  
  leaderboard.sort((a, b) => b.xp - a.xp);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
}

// Feedback Modal System
let selectedRating = 0;

document.querySelectorAll('.feedback-rating')?.forEach(btn => {
  btn.addEventListener('click', function() {
    selectedRating = parseInt(this.getAttribute('data-rating'));
    document.querySelectorAll('.feedback-rating').forEach(b => b.classList.remove('border-gold', 'bg-gold/20'));
    this.classList.add('border-gold', 'bg-gold/20');
  });
});

document.getElementById('feedback-btn')?.addEventListener('click', function() {
  document.getElementById('feedback-modal').classList.remove('hidden');
});

document.getElementById('close-feedback')?.addEventListener('click', function() {
  document.getElementById('feedback-modal').classList.add('hidden');
});

document.getElementById('feedback-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const comment = document.getElementById('feedback-comment').value;
  
  const feedback = {
    rating: selectedRating,
    comment: comment,
    timestamp: new Date().toISOString()
  };
  
  let feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
  feedbacks.push(feedback);
  localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
  
  showToast('Thank you for your feedback! 🎉');
  document.getElementById('feedback-modal').classList.add('hidden');
  document.getElementById('feedback-form').reset();
  selectedRating = 0;
  document.querySelectorAll('.feedback-rating').forEach(b => b.classList.remove('border-gold', 'bg-gold/20'));
});

// Initialize on page load
updateBadges();
initWeeklyChallenge();
updateLeaderboard();

// Streak Logic
function updateStreakDisplay() {
  const c = parseInt(localStorage.getItem('dailyStreakCount')||'0');
  const best = parseInt(localStorage.getItem('bestStreak')||'0');
  const ws = parseInt(localStorage.getItem('weeklyStreak')||'0');
  document.getElementById('current-streak').textContent = c;
  document.getElementById('best-streak').textContent = best;
  document.getElementById('weekly-streak').textContent = ws;
  document.getElementById('streak-bonus').textContent = '';
  if([3,7,14,30].includes(c)) document.getElementById('streak-bonus').textContent = `+${c>=30?100:c>=14?50:c>=7?25:10} XP Bonus!`;
}
window.updateStreakDisplay = updateStreakDisplay;
function streakCheck() {
  const now = new Date();
  const last = localStorage.getItem('lastStreakDate');
  const todayStr = now.toISOString().slice(0,10);
  let c = parseInt(localStorage.getItem('dailyStreakCount')||'0');
  let best = parseInt(localStorage.getItem('bestStreak')||'0');
  let ws = parseInt(localStorage.getItem('weeklyStreak')||'0');
  let lw = localStorage.getItem('lastWeekStartDate');
  // Weekly/weekStart = Monday
  const monday = new Date(now); monday.setDate(now.getDate()-now.getDay()+1); const weekStr = monday.toISOString().slice(0,10);
  if(lw!==weekStr) { ws=0; localStorage.setItem('weeklyStreak','0'); localStorage.setItem('lastWeekStartDate',weekStr); }
  // Streak logic
  if(last!==todayStr) {
    if(last && (new Date(todayStr)-new Date(last)===86400000)) c++;
    else c=1;
    localStorage.setItem('lastStreakDate',todayStr);
    if(c>best) { best=c; localStorage.setItem('bestStreak',c+''); }
    ws++;
    localStorage.setItem('dailyStreakCount',c+'');
    localStorage.setItem('weeklyStreak',ws+'');
  }
  updateStreakDisplay();
  // Bonuses
  if([3,7,14,30].includes(c)) {
    let userXP = parseInt(localStorage.getItem('userXP')||'0');
    const bonus = c>=30?100:c>=14?50:c>=7?25:10;
    localStorage.setItem('userXP', userXP+bonus);
    showToast(`Streak bonus! 🚀 +${bonus} XP for a ${c}-day streak!`);
  }
}
window.addStreakForTesting=streakCheck;
updateStreakDisplay();

// --- Leaderboard and Pod Performance Rendering ---
function renderLeaderboardAndPodStats() {
  // Leaderboard
  const lbContainer = document.getElementById('leaderboard-list');
  const podStatsContainer = document.getElementById('pod-performance-list');
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const analytics = JSON.parse(localStorage.getItem('lessonAnalytics') || '{}');
  // XP, badges logic
  function badgeCount(user) {
    if (!user.xp) return 0;
    return (user.xp>=75 ? 3 : user.xp>=50 ? 2 : user.xp>=25 ? 1 : 0);
  }
  lbContainer.innerHTML = leaderboard.slice(0,10).map((u,i)=>{
    // Completions: count from analytics
    let completions = 0;
    Object.values(analytics).forEach(stats=>{if(stats && stats.completed) completions+=stats.completed;});
    return `<div class='flex gap-3 items-center'>
      <span class='text-gold font-bold w-5'>${i+1}.</span>
      <span class='min-w-[80px] font-poppins'>${u.name||'Anon'}</span>
      <span class='bg-gold/10 rounded px-2 text-gold font-bold'>${u.pod||''}</span>
      <span class='font-mono text-offwhite'>${u.xp||0} XP</span>
      <span>🏅x${badgeCount(u)}</span>
    </div>`;
  }).join('') || '<span class="text-accentgray">No leaderboard data yet</span>';

  // Pod Performance
  const podStats = {};
  leaderboard.forEach(u=>{
    if (!u.pod) return;
    if (!podStats[u.pod]) podStats[u.pod]={xp:0, users:0, completions:0};
    podStats[u.pod].xp += (u.xp||0);
    podStats[u.pod].users += 1;
  });
  // completions from analytics
  Object.keys(analytics).forEach(lid=>{
    let c = analytics[lid]?.completed||0;
    Object.keys(podStats).forEach(pod=>{ podStats[pod].completions += Math.floor(c/(podStats[pod].users||1)); });
  });
  podStatsContainer.innerHTML = Object.entries(podStats).map(([pod,s])=>
    `<div>${pod}: <span class='text-gold font-bold'>${s.xp||0} XP</span> | <span class='text-gold'>${s.completions||0} completions</span> (${s.users} users)</div>`
  ).join('') || '<span class="text-accentgray">No pod data yet</span>';
}
renderLeaderboardAndPodStats();

// --- Phase 6: Notification logic ---
function getNotifications() {
  return JSON.parse(localStorage.getItem('notifications')||'[]');
}
function saveNotifications(arr) {
  localStorage.setItem('notifications',JSON.stringify(arr));
}
function addNotification(type, text) {
  let arr = getNotifications();
  arr.push({id:'n'+Date.now(),type,text,seen:false,date:new Date().toLocaleString()});
  saveNotifications(arr); updateNotificationUI(); showToast(text);
}
function updateNotificationUI() {
  const bell = document.getElementById('notification-bell');
  const countSpan = document.getElementById('notification-count');
  const modal = document.getElementById('notifications-modal');
  const list = document.getElementById('notification-list');
  let arr = getNotifications();
  const unseen = arr.filter(n=>!n.seen).length;
  if(countSpan) {
    countSpan.textContent = unseen;
    countSpan.classList.toggle('hidden', unseen===0);
  }
  if(list) {
    list.innerHTML = arr.slice().reverse().map(n=>`<div class='bg-charcoal/60 rounded px-3 py-2'><span class='font-bold text-gold mr-2'>${n.type==='xp'?'⚡':n.type==='badge'?'🏅':n.type==='streak'?'🔥':n.type==='admin'?'🛠️':'🔔'}</span><span>${n.text}</span><span class='block text-xs text-accentgray float-right ml-2'>${n.date}</span></div>`).join('')||'<div class="text-xs text-accentgray">No notifications yet</div>';
  }
}
// Bell logic
const bellBtn=document.getElementById('notification-bell'),notifModal=document.getElementById('notifications-modal'),clearBtn=document.getElementById('clear-notifications');
bellBtn&&bellBtn.addEventListener('click',()=>{notifModal.classList.toggle('hidden');let arr=getNotifications();arr=arr.map(n=>({...n,seen:true}));saveNotifications(arr);updateNotificationUI();});
clearBtn&&clearBtn.addEventListener('click',()=>{saveNotifications([]);updateNotificationUI();notifModal.classList.add('hidden');});
window.addNotification=addNotification;
updateNotificationUI();
// --- Tie notifications to events ---
const prevShowToast=showToast;
showToast=function(message){prevShowToast(message);if(/XP|challenge|badge|level|streak|certificate|approved|rejected|reward/i.test(message))addNotification('xp',message);};

const topbarAvatar = document.getElementById('topbar-avatar');
if(topbarAvatar) {
  function setTopAvatar() {
    const avatar = localStorage.getItem('userAvatar');
    if (avatar) {
      topbarAvatar.src = avatar;
    } else {
      const userName = localStorage.getItem('userName')||'';
      const initials = userName.split(' ').map(n=>n[0]).join('').toUpperCase()||'👤';
      topbarAvatar.src=`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect fill='%23f6c960' width='80' height='80'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' fill='black' font-size='32' font-family='Arial'>${initials}</text></svg>`;
    }
  }
  setTopAvatar();
  topbarAvatar.onclick = ()=>location.href='profile.html';
}