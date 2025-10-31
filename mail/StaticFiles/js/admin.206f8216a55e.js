// admin.js

// Admin credentials (Change these to your secure credentials!)
const ADMIN_EMAIL = 'admin@owlphadao.xyz';
const ADMIN_PASSWORD = 'admin123'; // Change this to a strong password!

// ========== MULTI-ADMIN ROLES & AUTH ==========
const ADMIN_STORE_KEY = 'adminAccounts';
function getAdmins() {
  return JSON.parse(localStorage.getItem(ADMIN_STORE_KEY)||'[]');
}
function saveAdmins(a) {
  localStorage.setItem(ADMIN_STORE_KEY,JSON.stringify(a));
}
// On first use, auto-create superadmin if none exists
function ensureDefaultSuperadmin() {
  let admins = getAdmins();
  if (!admins.length) {
    admins = [{email:'admin@owlphadao.xyz', name:'Super Admin', password:'admin123', role:'superadmin', createdAt:new Date().toLocaleString()}];
    saveAdmins(admins);
  }
}
ensureDefaultSuperadmin();

// LOGIN HANDLING
function tryAdminLogin(email, pass) {
  const adm = getAdmins().find(a=>a.email===email);
  if (adm && adm.password === pass) {
    sessionStorage.setItem('adminAuth','true');
    sessionStorage.setItem('adminRole',adm.role);
    sessionStorage.setItem('adminName',adm.name);
    sessionStorage.setItem('adminEmail',adm.email);
    showAdminPanel();
    showToast('Logged in as '+adm.role);
  } else {
    document.getElementById('login-error').classList.remove('hidden');
    setTimeout(()=>document.getElementById('login-error').classList.add('hidden'), 3000);
  }
}
document.getElementById('admin-login-btn').onclick = function() {
  const email=document.getElementById('admin-email').value.trim();
  const pass=document.getElementById('admin-password').value;
  tryAdminLogin(email,pass);
};
// Enter key on password

document.getElementById('admin-password').onkeypress = function(e) { if(e.key==='Enter'){document.getElementById('admin-login-btn').click();} };

// Panel access on load
(function(){
  if(sessionStorage.getItem('adminAuth')==='true') showAdminPanel();
  else showLoginModal();
})();

// INVITE/ADMIN MANAGEMENT
const adminInviteBtn=document.getElementById('admin-invite-btn');
const adminInviteModal=document.getElementById('admin-invite-modal');
const adminInviteForm=document.getElementById('admin-invite-form');
const inviteCancelBtn=document.getElementById('invite-cancel-btn');

function renderAdminTable() {
  const tbody = document.querySelector('#admin-table tbody');
  if(!tbody) return;
  const loggedRole = sessionStorage.getItem('adminRole');
  const loggedEmail = sessionStorage.getItem('adminEmail');
  const admins = getAdmins();
  tbody.innerHTML = admins.map((a,i)=>{
    let actions = '';
    if (loggedRole==='superadmin') {
      actions += `<select onchange="window.changeRole('${a.email}',this.value)" ${a.email===loggedEmail?'disabled':''} class='bg-charcoal border border-gold rounded px-2 mr-2'><option value='admin' ${a.role==='admin'?'selected':''}>Admin</option><option value='moderator' ${a.role==='moderator'?'selected':''}>Moderator</option><option value='superadmin' ${a.role==='superadmin'?'selected':''}>Superadmin</option></select>`;
      if(!(a.role==='superadmin' && countSuperadmins()===1 && a.email===loggedEmail))
        actions += `<button onclick="window.removeAdmin('${a.email}')" class='px-2 py-1 bg-red-500 text-white rounded text-xs'>Remove</button>`;
      else actions += `<span class='text-accentgray text-xs'>—</span>`;
    }
    return `<tr><td>${a.name}</td><td>${a.email}</td><td>${a.role}</td><td>${a.createdAt}</td><td>${actions}</td></tr>`;
  }).join('');
}
function countSuperadmins() {
  return getAdmins().filter(a=>a.role==='superadmin').length;
}
window.changeRole = function(email,role) {
  const admins = getAdmins();
  const a = admins.find(x=>x.email===email); if(!a) return;
  a.role=role; saveAdmins(admins); renderAdminTable(); showToast('Role updated!');
};
window.removeAdmin = function(email) {
  let admins = getAdmins();
  if(email===sessionStorage.getItem('adminEmail') && countSuperadmins()===1) return showToast('Cannot remove last superadmin!');
  admins = admins.filter(a=>a.email!==email); saveAdmins(admins); renderAdminTable(); showToast('Admin removed.');
};
adminInviteBtn && adminInviteBtn.addEventListener('click', ()=>{
  if(sessionStorage.getItem('adminRole')!=='superadmin') return showToast('Only superadmin can invite!');
  adminInviteModal.classList.remove('hidden');
  adminInviteForm.reset();
});
inviteCancelBtn && inviteCancelBtn.addEventListener('click',()=>adminInviteModal.classList.add('hidden'));
adminInviteForm && adminInviteForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name=document.getElementById('admin-invite-name').value.trim();
  const email=document.getElementById('admin-invite-email').value.trim();
  const password=document.getElementById('admin-invite-password').value;
  const role=document.getElementById('admin-invite-role').value;
  if(!email||!password) return showToast('Email and password required!');
  let admins = getAdmins();
  if(admins.find(a=>a.email===email)) return showToast('Admin already exists!');
  admins.push({email,name,password,role,createdAt:new Date().toLocaleString()}); saveAdmins(admins); renderAdminTable(); adminInviteModal.classList.add('hidden');
  showToast(`Admin invited!\nEmail: ${email}\nPassword: ${password}`);
});

// Only show Invite Admin and Actions to superadmin
function updateAdminUIVis() {
  const role=sessionStorage.getItem('adminRole');
  (adminInviteBtn && (adminInviteBtn.style.display=(role==='superadmin'?'':'none')));
}
renderAdminTable();
updateAdminUIVis();

// Check if user is already authenticated
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
  if (isAuthenticated) {
    showAdminPanel();
  } else {
    showLoginModal();
  }
}

// Show login modal
function showLoginModal() {
  document.getElementById('admin-login-modal').classList.remove('hidden');
  document.getElementById('admin-panel').classList.add('hidden');
}

// Show admin panel
function showAdminPanel() {
  document.getElementById('admin-login-modal').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
}

// Handle admin login
document.getElementById('admin-login-btn').addEventListener('click', function() {
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorDiv = document.getElementById('login-error');
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminAuth', 'true');
    showAdminPanel();
    showToast('Successfully logged in!');
  } else {
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 3000);
  }
});

// Allow Enter key to submit login
document.getElementById('admin-password').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('admin-login-btn').click();
  }
});

// Load auth status on page load
checkAuth();

// Navigation handling
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    
    // Hide all sections
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    
    // Show target section
    document.getElementById(target.substring(1)).classList.remove('hidden');
    
    // Update active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    
    // Update page title
    document.getElementById('page-title').textContent = this.textContent.trim();
    
    // Load section-specific data
    loadSectionData(target.substring(1));
  });
});

// Load section-specific data
function loadSectionData(section) {
  switch(section) {
    case 'dashboard':
      loadDashboardStats();
      break;
    case 'users':
      loadUsersData();
      break;
    case 'lessons':
      loadLessonsData();
      break;
    case 'analytics':
      loadAnalyticsData();
      break;
    case 'settings':
      loadSettingsData();
      break;
  }
}

// Dashboard Stats
function loadDashboardStats() {
  const lessonState = JSON.parse(localStorage.getItem('lessonState') || '{}');
  const userXP = parseInt(localStorage.getItem('userXP') || 0);
  const level = parseInt(localStorage.getItem('level') || 1);
  const userName = localStorage.getItem('userName');
  const userPod = localStorage.getItem('userPod');
  
  // Since we're only tracking one user in localStorage, we simulate multi-user data
  const totalUsers = userName ? 1 : 0;
  const completedLessons = Object.keys(lessonState).length;
  const totalXP = userXP || 0;
  const activeSessions = userName ? 1 : 0;
  
  document.getElementById('total-users').textContent = totalUsers;
  document.getElementById('active-sessions').textContent = activeSessions;
  document.getElementById('completed-lessons').textContent = completedLessons;
  document.getElementById('total-xp').textContent = totalXP;
  
  // Pod distribution (simulated)
  const pods = ['Creator', 'Builder', 'Educator', 'Community'];
  const podContainer = document.getElementById('pod-distribution');
  podContainer.innerHTML = '';
  
  pods.forEach(pod => {
    const count = userPod === pod ? 1 : 0;
    podContainer.innerHTML += `
      <div class="bg-charcoal/60 rounded-lg p-4 text-center">
        <p class="text-2xl font-bold text-gold">${count}</p>
        <p class="text-xs text-accentgray">${pod}</p>
      </div>
    `;
  });
  
  // Recent Activity
  const activityContainer = document.getElementById('recent-activity');
  if (userName) {
    activityContainer.innerHTML = `
      <div class="flex items-center justify-between p-3 bg-charcoal/60 rounded-lg">
        <div>
          <p class="font-semibold">${userName} completed a lesson</p>
          <p class="text-xs text-accentgray">Just now</p>
        </div>
        <span class="text-gold text-xl">✓</span>
      </div>
    `;
  } else {
    activityContainer.innerHTML = '<p class="text-accentgray text-center py-4">No recent activity</p>';
  }
}

// Users Data
function loadUsersData() {
  const tbody = document.getElementById('users-tbody');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userPod = localStorage.getItem('userPod');
  const userXP = localStorage.getItem('userXP') || 0;
  
  tbody.innerHTML = '';
  
  if (userName) {
    tbody.innerHTML = `
      <tr class="border-b border-gold/10">
        <td class="p-3">${userName}</td>
        <td class="p-3 text-accentgray">${userEmail || 'N/A'}</td>
        <td class="p-3"><span class="bg-gold/90 text-charcoal px-2 py-1 rounded text-xs font-bold">${userPod}</span></td>
        <td class="p-3 font-mono text-gold">${userXP}</td>
        <td class="p-3">
          <button class="text-gold hover:text-offwhite transition text-sm">View</button>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-6 text-accentgray">No users found</td></tr>';
  }
}

// Local lesson storage key
const LESSONS_STORAGE_KEY = 'allLessons';

// New lesson structure for robust multi-step creation
function newLessonTemplate() {
  return {
    id: null,
    title: '',
    desc: '',
    video: '',
    doType: 'instructions', // 'quiz', 'upload', 'instructions'
    doInstructions: '',
    quizQuestions: [],      // [{question, type: 'mcq'|'text', options:[], answer:''}]
    uploadInstruction: '',  // if doType=='upload'
    earnType: 'xp',         // 'xp' | 'badge' | 'contact'
    xpAmount: 0,
    badgeLabel: '',
    contactFields: [{ label: 'Name', required: true }, { label: 'Email', required: true }], // array for custom fields
    earnMessage: '',        // admin text for reward step
    status: 'published'
  };
}

// When reading existing (old) lessons, convert/inject empty new fields as needed for backward compatibility
function upgradeLessonFields(les) {
  return {
    ...newLessonTemplate(),
    ...les,
    doType: les.doType || 'instructions',
    doInstructions: les.doInstructions || les.doTask || '',
    quizQuestions: les.quizQuestions || [],
    uploadInstruction: les.uploadInstruction || '',
    earnType: les.earnType || (les.earnReward ? 'xp' : 'xp'),
    xpAmount: les.xpAmount || parseInt(les.earnReward) || 0,
    badgeLabel: les.badgeLabel || '',
    contactFields: les.contactFields || [{ label: 'Name', required: true }, { label: 'Email', required: true }],
    earnMessage: les.earnMessage || '',
    status: les.status || 'published',
  };
}

function getLessons() {  // override previous
  let lessons = JSON.parse(localStorage.getItem(LESSONS_STORAGE_KEY) || '[]');
  if (!lessons.length) {
    // fallback: load old lessons, migrate if available
    lessons = [
      { id: 1, title: 'Introduction to Content Creation', desc: '', video: '', doInstructions: '', quizQuestions: [], uploadInstruction:'', doType: 'instructions', earnType: 'xp', xpAmount: 25, badgeLabel: '', contactFields: [{label:'Name',required:true},{label:'Email',required:true}], earnMessage:'', status: 'published'},
      { id: 2, title: 'Social Media Strategy', desc: '', video: '', doInstructions: '', quizQuestions: [], uploadInstruction:'', doType: 'instructions', earnType: 'xp', xpAmount: 25, badgeLabel: '', contactFields: [{label:'Name',required:true},{label:'Email',required:true}], earnMessage:'', status: 'published'},
      { id: 3, title: 'Video Editing Fundamentals', desc: '', video: '', doInstructions: '', quizQuestions: [], uploadInstruction:'', doType: 'instructions', earnType: 'xp', xpAmount: 25, badgeLabel: '', contactFields: [{label:'Name',required:true},{label:'Email',required:true}], earnMessage:'', status: 'published'},
      { id: 4, title: 'Building Your Brand', desc: '', video: '', doInstructions: '', quizQuestions: [], uploadInstruction:'', doType: 'instructions', earnType: 'xp', xpAmount: 25, badgeLabel: '', contactFields: [{label:'Name',required:true},{label:'Email',required:true}], earnMessage:'', status: 'draft'},
    ];
    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
  }
  return lessons.map(upgradeLessonFields);
}

function saveLessons(lessons) {
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
}

// Modal listeners
const addLessonBtn = document.getElementById('add-lesson-btn');
const modal = document.getElementById('lesson-modal-admin');
const closeModalBtn = document.getElementById('close-lesson-modal-admin');
const lessonForm = document.getElementById('lesson-form-admin');
const cancelLessonBtn = document.getElementById('cancel-lesson-btn');
const modalTitle = document.getElementById('lesson-modal-title');
// store for editing
let editLessonId = null;

addLessonBtn.addEventListener('click', () => {
  modal.classList.remove('hidden');
  lessonForm.reset();
  modalTitle.textContent = 'Add New Lesson';
  editLessonId = null;
});
closeModalBtn.addEventListener('click', closeLessonModal);
cancelLessonBtn.addEventListener('click', (e) => { e.preventDefault(); closeLessonModal(); });

function closeLessonModal() {
  modal.classList.add('hidden');
  lessonForm.reset();
  editLessonId = null;
}

// Multi-step modal state
let lessonStep = 0; // 0=Learn, 1=Do, 2=Earn
const steps = ["lesson-step-1","lesson-step-2","lesson-step-3"];
const bars = ["lesson-step-1-bar","lesson-step-2-bar","lesson-step-3-bar"];
const nextBtn = document.getElementById('lesson-next-btn');
const prevBtn = document.getElementById('lesson-prev-btn');
const saveBtn = document.getElementById('lesson-save-btn');
const stepElems = steps.map(id => document.getElementById(id));
const barElems = bars.map(id => document.getElementById(id));

function showStep(idx) {
  lessonStep = idx;
  stepElems.forEach((el, i) => el.classList.toggle('hidden', i !== idx));
  barElems.forEach((el, i) => {
    el.className = 'h-2 w-1/3 rounded-full ' + (i < idx ? 'bg-gold/80' : i === idx ? 'bg-gold/70' : 'bg-gold/20');
  });
  prevBtn.disabled = idx === 0;
  nextBtn.classList.toggle('hidden', idx === steps.length - 1);
  saveBtn.classList.toggle('hidden', idx !== steps.length - 1);
}
showStep(0);
nextBtn.addEventListener('click', () => showStep(Math.min(lessonStep + 1, steps.length-1)));
prevBtn.addEventListener('click', () => showStep(Math.max(lessonStep - 1, 0)));

// --- DO step dynamic type logic ---
function updateDoTypeUI() {
  const type = document.querySelector('input[name="do-type"]:checked').value;
  document.getElementById('do-type-instructions').classList.toggle('hidden', type !== 'instructions');
  document.getElementById('do-type-quiz').classList.toggle('hidden', type !== 'quiz');
  document.getElementById('do-type-upload').classList.toggle('hidden', type !== 'upload');
}
document.querySelectorAll('input[name="do-type"]').forEach(r => r.addEventListener('change', updateDoTypeUI));

// Quiz builder logic
const quizBuilder = document.getElementById('quiz-builder');
let quizQuestions = [];
function renderQuizBuilder() {
  quizBuilder.innerHTML = quizQuestions.map((q, idx) => {
    let questionInput = `<input type='text' class='w-full mb-1 bg-charcoal/40 rounded text-offwhite' placeholder='Question text' value="${q.question}">`;
    let typeSelect = `<select>${['mcq','text','tf','file','code'].map(t=>`<option value='${t}' ${q.type===t?'selected':''}>${({mcq:'Multiple Choice',text:'Short Answer',tf:'True/False',file:'File Upload',code:'Code/Text'})[t]}</option>`).join('')}</select>`;
    let body = '';
    if(q.type==='mcq') {
      body = `<span class='text-xs text-accentgray'>Options:</span><div class='mb-1'>${q.options.map((opt,i)=>`<input type='text' class='bg-accentgray/40 rounded px-2 py-1 mr-1 mb-1' value="${opt}"> <button type='button' class='remove-option text-xs text-red-400' data-opt='${i}'>✕</button>`).join(' ')}<button type='button' class='text-gold text-xs add-option'>+ Add Option</button></div><span class='text-xs mr-2'>Correct Answer:</span><select class='quiz-correct-ans'>${q.options.map(opt=>`<option value="${opt}" ${opt===q.answer?'selected':''}>${opt}</option>`).join('')}</select>`;
    } else if(q.type==='text') {
      body = `<span class='text-xs text-accentgray'>Expected Answer: <input type='text' class='bg-accentgray/40 rounded px-2 py-1 ml-1' value="${q.answer||''}"></span>`;
    } else if(q.type==='tf') {
      body = `<span class='text-xs font-bold'>True/False</span> <span class='text-accentgray ml-3'>Correct: </span><select class='quiz-correct-ans'><option value='True' ${q.answer==='True'?'selected':''}>True</option><option value='False' ${q.answer==='False'?'selected':''}>False</option></select>`;
    } else if(q.type==='file') {
      body = `<span class='text-xs text-accentgray'>File upload: (admin will review user file)</span><input type='text' class='bg-accentgray/40 rounded px-2 py-1 w-full mt-1' value="${q.instructions||''}" placeholder='File/task instructions'>`;
    } else if(q.type==='code') {
      body = `<span class='text-xs text-accentgray'>Expected Output: <input type='text' class='bg-accentgray/40 rounded px-2 py-1 ml-3' value="${q.answer||''}" placeholder='Output for auto-grading'></span>`;
    }
    return `<div class='border border-gold/20 rounded p-2' data-q="${idx}">${questionInput}<div class='flex gap-2 mb-1'>${typeSelect}<button type='button' class='text-red-400 text-xs remove-question'>Remove</button></div><div class='mb-1'>${body}</div></div>`;
  }).join('');
}
function syncQuizBuilderEvents() {
  // Question input/events
  quizBuilder.querySelectorAll('input[type=text]').forEach((inp, i) => {
    inp.addEventListener('input', e => {
      const parent = inp.closest('[data-q]');
      const idx = Number(parent.getAttribute('data-q'));
      if (inp.parentNode.classList.contains('mb-1')) {
        // option
        const optIdx = Array.from(inp.parentNode.children).indexOf(inp); // fudge
        const optRealIdx = Array.from(inp.parentNode.querySelectorAll('input[type=text]')).indexOf(inp);
        quizQuestions[idx].options[optRealIdx] = inp.value;
        renderQuizBuilder(); syncQuizBuilderEvents();
      } else if (inp.previousSibling && inp.previousSibling.nodeType === 3 && inp.previousSibling.textContent.includes('Expected Answer')) {
        quizQuestions[idx].answer = inp.value;
      } else {
        quizQuestions[idx].question = inp.value;
      }
    });
  });
  // Select type (mcq/text)
  quizBuilder.querySelectorAll('select').forEach((sel,i) => {
    sel.addEventListener('change', e => {
      const parent = sel.closest('[data-q]');
      const idx = Number(parent.getAttribute('data-q'));
      if (sel.className==='') {
        quizQuestions[idx].type = sel.value;
        if (sel.value==='mcq' && !quizQuestions[idx].options.length) quizQuestions[idx].options.push('');
        renderQuizBuilder(); syncQuizBuilderEvents();
      } else if (sel.classList.contains('quiz-correct-ans')) {
        quizQuestions[idx].answer = sel.value;
      }
    });
  });
  // Add option
  quizBuilder.querySelectorAll('.add-option').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('[data-q]');
      const qIdx = Number(parent.getAttribute('data-q'));
      quizQuestions[qIdx].options.push('');
      renderQuizBuilder(); syncQuizBuilderEvents();
    });
  });
  // Remove option
  quizBuilder.querySelectorAll('.remove-option').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('[data-q]');
      const qIdx = Number(parent.getAttribute('data-q'));
      const optIdx = Number(btn.getAttribute('data-opt'));
      quizQuestions[qIdx].options.splice(optIdx, 1);
      // fix answer if deleted
      if (quizQuestions[qIdx].answer && !quizQuestions[qIdx].options.includes(quizQuestions[qIdx].answer)) quizQuestions[qIdx].answer = '';
      renderQuizBuilder(); syncQuizBuilderEvents();
    });
  });
  // Remove question
  quizBuilder.querySelectorAll('.remove-question').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('[data-q]');
      const qIdx = Number(parent.getAttribute('data-q'));
      quizQuestions.splice(qIdx, 1);
      renderQuizBuilder(); syncQuizBuilderEvents();
    });
  });
}
renderQuizBuilder(); syncQuizBuilderEvents();
document.getElementById('add-quiz-question').addEventListener('click', function () {
  quizQuestions.push({ question: '', type: 'mcq', options: [''], answer: '' });
  renderQuizBuilder(); syncQuizBuilderEvents();
});

// --- Earn: dynamic contact fields logic ---
let contactFields = [{label:'Name',required:true},{label:'Email',required:true}];
const contactFieldsBuilder = document.getElementById('contact-fields-builder');
function renderContactFields() {
  contactFieldsBuilder.innerHTML = contactFields.map((field,i) => `
    <div class='flex items-center gap-2 mb-1'><input type='text' class='bg-charcoal/40 rounded px-2 py-1 text-offwhite' value="${field.label}" data-idx="${i}">
    <label class='ml-1'><input type='checkbox' class='mr-1' ${field.required?'checked':''}> Required</label>
    <button type='button' class='text-red-400 text-xs remove-field'>Remove</button>
    </div>
  `).join('');
}
function syncContactFieldsEvents() {
  contactFieldsBuilder.querySelectorAll('input[type=text]').forEach(inp => {
    inp.addEventListener('input', () => {
      const i = Number(inp.getAttribute('data-idx'));
      contactFields[i].label = inp.value;
    });
  });
  contactFieldsBuilder.querySelectorAll('input[type=checkbox]').forEach((cbx,i) => {
    cbx.addEventListener('change', () => {
      contactFields[i].required = cbx.checked;
    });
  });
  contactFieldsBuilder.querySelectorAll('.remove-field').forEach((btn,i) => {
    btn.addEventListener('click', () => {
      contactFields.splice(i,1); renderContactFields(); syncContactFieldsEvents();
    });
  });
}
renderContactFields(); syncContactFieldsEvents();
document.getElementById('add-contact-field').addEventListener('click', function () {
  contactFields.push({ label: '', required: false });
  renderContactFields(); syncContactFieldsEvents();
});

// Earn type logic
function updateEarnTypeUI() {
  const earnType = document.querySelector('input[name="earn-type"]:checked').value;
  document.getElementById('earn-type-xp').classList.toggle('hidden', earnType !== 'xp');
  document.getElementById('earn-type-badge').classList.toggle('hidden', earnType !== 'badge');
  document.getElementById('earn-type-contact').classList.toggle('hidden', earnType !== 'contact');
}
document.querySelectorAll('input[name="earn-type"]').forEach(r => r.addEventListener('change', updateEarnTypeUI));

// Save/Submit logic
lessonForm.addEventListener('submit', function(event) {
  event.preventDefault();
  // Compile all data from steps
  const title = document.getElementById('lesson-title-input').value.trim();
  const desc = document.getElementById('lesson-desc-input').value.trim();
  const video = document.getElementById('lesson-video-input').value.trim();
  const doType = document.querySelector('input[name="do-type"]:checked').value;
  let doInstructions = '', uploadInstruction = '', quizData = [];
  if (doType === 'instructions') {
    doInstructions = document.getElementById('lesson-do-instructions').value.trim();
  } else if (doType === 'upload') {
    uploadInstruction = document.getElementById('lesson-upload-instruction').value.trim();
  } else if (doType === 'quiz') {
    quizData = quizQuestions.map(q => ({
      question: q.question, type: q.type, options: q.options.slice(), answer: q.answer
    }));
  }
  const earnType = document.querySelector('input[name="earn-type"]:checked').value;
  const xpAmount = earnType === 'xp' ? Number(document.getElementById('lesson-xp-amount').value) : 0;
  const badgeLabel = earnType === 'badge' ? document.getElementById('lesson-badge-label').value.trim() : '';
  const badgeImage = earnType === 'badge' ? badgeImageDataURL : '';
  const earnMsg = document.getElementById('lesson-earn-message').value.trim();
  const earnContactFields = earnType === 'contact' ? contactFields.filter(f => !!f.label) : [];
  const certificateEnabled = document.getElementById('certificate-enabled-input')?.checked;
  let lessons = getLessons();
  let id;
  if (editLessonId == null) {
    id = lessons.length ? Math.max(...lessons.map(l => l.id)) + 1 : 1;
  } else {
    id = editLessonId;
    lessons = lessons.filter(l => l.id !== id);
  }
  const quizTimeLimitRaw = document.getElementById('quiz-time-limit')?.value;
  const quizTimeLimit = (quizTimeLimitRaw && Number(quizTimeLimitRaw)>0) ? Number(quizTimeLimitRaw) : null;
  const prereqIds = Array.from(document.querySelectorAll('#lesson-prereq-select input[type=checkbox]:checked')).map(cb=>parseInt(cb.value));
  const lesson = {
    id, title, desc, video, doType,
    doInstructions, quizQuestions: quizData, uploadInstruction,
    earnType, xpAmount, badgeLabel, contactFields: earnContactFields,
    earnMessage: earnMsg,
    status: 'published',
    quizTimeLimit: quizTimeLimit,
    badgeImage: badgeImage,
    certificateEnabled: certificateEnabled,
    prerequisites: prereqIds
  };
  lessons.push(lesson);
  saveLessons(lessons);
  showToast('Lesson saved!');
  closeLessonModal();
  loadLessonsData();
});
// Modal reset for new
addLessonBtn.addEventListener('click', () => {
  showStep(0);
  lessonForm.reset();
  document.querySelector('input[name="do-type"][value="instructions"]').checked = true;
  updateDoTypeUI();
  quizQuestions = [];
  renderQuizBuilder(); syncQuizBuilderEvents();
  document.querySelector('input[name="earn-type"][value="xp"]').checked = true;
  updateEarnTypeUI();
  contactFields = [{label:'Name',required:true},{label:'Email',required:true}];
  renderContactFields(); syncContactFieldsEvents();
  badgeImageDataURL = '';
  document.getElementById('lesson-badge-image-input').value = '';
  document.getElementById('badge-image-preview').innerHTML = '';
  renderPrereqSelect([]);
});

// Edit logic
function editLesson(lessonId) {
  const lessons = getLessons();
  const lesson = lessons.find(x => x.id === lessonId);
  if (!lesson) return;
  document.getElementById('lesson-title-input').value = lesson.title;
  document.getElementById('lesson-desc-input').value = lesson.desc;
  document.getElementById('lesson-video-input').value = lesson.video;
  document.getElementById('lesson-do-input').value = lesson.doTask || '';
  document.getElementById('lesson-earn-input').value = lesson.earnReward || '';
  modalTitle.textContent = 'Edit Lesson';
  modal.classList.remove('hidden');
  editLessonId = lessonId;
  badgeImageDataURL = lesson.badgeImage || '';
  if(badgeImageDataURL) badgePreviewDiv.innerHTML = `<img src='${badgeImageDataURL}' style='max-width:100px;max-height:80px;' class='rounded shadow' />`;
  else badgePreviewDiv.innerHTML = '';
  if(document.getElementById('certificate-enabled-input')) document.getElementById('certificate-enabled-input').checked = !!lesson.certificateEnabled;
  renderPrereqSelect(lesson.prerequisites||[]);
}

// Lessons display
function loadLessonsData() {
  const container = document.getElementById('lessons-list');
  const lessons = getLessons();
  container.innerHTML = '';
  lessons.forEach(lesson => {
    container.innerHTML += `
      <div class="bg-charcoal/60 rounded-lg p-4 border border-gold/10">
        <h4 class="font-bold text-gold mb-2">${lesson.title}</h4>
        <p class="text-xs text-accentgray mb-1">${lesson.desc || ''}</p>
        <ul class="text-offwhite text-xs mb-2">
          <li><span class="text-gold font-semibold">Do:</span> ${lesson.doInstructions || lesson.doTask || '<span class=\'text-accentgray\'>No Do task defined</span>'}</li>
          <li><span class="text-gold font-semibold">Earn:</span> ${(lesson.earnType==='xp') ? lesson.xpAmount+' XP' : (lesson.earnType==='badge' ? (lesson.badgeLabel||'Badge') : (lesson.earnType==='contact' ? 'Contact Info' : (lesson.earnReward || '<span class=\'text-accentgray\'>No reward defined</span>')))}</li>
        </ul>
        <div class="mt-1 text-xs text-accentgray">${getLessonStatsDisplay(lesson.id)}</div>
        <div class="flex gap-2 mt-3">
          <button class="text-xs bg-gold text-charcoal px-3 py-1 rounded-full hover:scale-105 transition" onclick="editLesson(${lesson.id})">Edit</button>
          <button class="text-xs bg-red-500 text-white px-3 py-1 rounded-full hover:scale-105 transition" onclick="deleteLesson(${lesson.id})">Delete</button>
        </div>
      </div>
    `;
  });
}
// Delete logic
window.editLesson = editLesson;
window.deleteLesson = function(id) {
  if (!confirm('Delete this lesson?')) return;
  let lessons = getLessons();
  lessons = lessons.filter(l => l.id !== id);
  saveLessons(lessons);
  showToast('Lesson deleted!');
  loadLessonsData();
};

// Initial admin lessons load
loadLessonsData();

// LESSON ANALYTICS (Tracking views/completion/quiz attempts/uploads)
const ANALYTICS_KEY = 'lessonAnalytics';
function getAnalytics() {
  let analytics = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '{}');
  return analytics;
}
function saveAnalytics(an) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(an));
}
function incrementAnalytics(lessonId, kind, val) {
  let analytics = getAnalytics();
  analytics[lessonId] = analytics[lessonId] || { views:0, completed:0, quizAttempts:0, quizScoreSum:0, uploads:0 };
  if (kind==='views') analytics[lessonId].views += 1;
  if (kind==='completed') analytics[lessonId].completed += 1;
  if (kind==='quizAttempt' && val) { analytics[lessonId].quizAttempts += 1; analytics[lessonId].quizScoreSum += val; }
  if (kind==='upload') analytics[lessonId].uploads += 1;
  saveAnalytics(analytics);
}
function getLessonStatsDisplay(lessonId) {
  const a = getAnalytics()[lessonId] || {views:0,completed:0,quizAttempts:0,quizScoreSum:0,uploads:0};
  const avgScore = a.quizAttempts ? Math.round(a.quizScoreSum/a.quizAttempts) : '--';
  return `Views: <span class='text-gold'>${a.views}</span>, Completed: <span class='text-gold'>${a.completed}</span>, Quiz: <span class='text-gold'>${a.quizAttempts}</span> (${avgScore}%), Uploads: <span class='text-gold'>${a.uploads}</span>`
}

// --- Giveaway Draw Feature ---
function getDrawPool(period, start, end) {
  let pool = JSON.parse(localStorage.getItem('drawPool')||'[]');
  let now = new Date();
  let weekStart = new Date(now);weekStart.setDate(now.getDate() - now.getDay() + 1);const weekStr = weekStart.toISOString().slice(0,10);
  const monthStr = now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
  if(period==='week') pool = pool.filter(e=>e.week===weekStr);
  else if(period==='month') pool = pool.filter(e=>e.month===monthStr);
  else if(period==='custom' && start && end) {
    let s=new Date(start),e=new Date(end); pool = pool.filter(x=>{let d=new Date(x.date);return d>=s&&d<=e});
  }
  // Only one entry per user (prefer latest)
  let seen = {}; let result=[];
  for(let i=pool.length-1;i>=0;i--){const ent=pool[i];if(!seen[ent.user]){seen[ent.user]=1;result.unshift(ent);}}
  return result;
}
function renderDrawUI() {
  const periodSel=document.getElementById('draw-period'),poolDiv=document.getElementById('draw-pool-entries'),winDiv=document.getElementById('draw-winner-result');
  const dateDiv=document.getElementById('draw-date-custom'),dateStart=document.getElementById('draw-date-start'),dateEnd=document.getElementById('draw-date-end');
  let period=periodSel.value,start=dateStart?.value,end=dateEnd?.value;
  if(period==='custom'){dateDiv.classList.remove('hidden');}else{dateDiv.classList.add('hidden');}
  let pool = getDrawPool(period,start,end);
  poolDiv.innerHTML = pool.length ? `<div>Entrants (${pool.length}):<ul class='mt-1 mb-2'>${pool.map(e=>`<li>👤 ${e.user} (${e.pod})</li>`).join('')}</ul></div>` : '<div class="text-accentgray">No entries for selected period</div>';
  winDiv.textContent = '';
}
document.getElementById('draw-period')?.addEventListener('change',renderDrawUI);
document.getElementById('draw-date-start')?.addEventListener('input',renderDrawUI);
document.getElementById('draw-date-end')?.addEventListener('input',renderDrawUI);
document.getElementById('draw-winner-btn')?.addEventListener('click',function(){
  let period=document.getElementById('draw-period').value,start=document.getElementById('draw-date-start').value,end=document.getElementById('draw-date-end').value;
  let pool=getDrawPool(period,start,end);
  if(!pool.length) return document.getElementById('draw-winner-result').textContent='No eligible entries.';
  let winner = pool[Math.floor(Math.random()*pool.length)];
  let avatar = getAvatarForUser(winner.user);
  document.getElementById('draw-winner-result').innerHTML = `<img src='${avatar}' class='w-10 h-10 rounded-full border-2 border-gold inline-block mr-2 align-middle' /> 🎉 Winner: ${winner.user} (${winner.pod})!`;
  // Save winner history
  let hist = JSON.parse(localStorage.getItem('drawWinners')||'[]');
  hist.push({date:new Date().toLocaleString(),user:winner.user,pod:winner.pod,period,entries:pool.length});
  localStorage.setItem('drawWinners',JSON.stringify(hist));
  if(window.addNotification) window.addNotification('admin',`Giveaway Winner: ${winner.user} (${winner.pod})!`);
});
window.renderDrawUI=renderDrawUI;
// On tab load (Analytics):
document.getElementById('draw-period') && renderDrawUI();

// --- Submission review workflow ---
function getSubmissions() {
  return JSON.parse(localStorage.getItem('submissions') || '[]');
}
function saveSubmissions(subs) {
  localStorage.setItem('submissions', JSON.stringify(subs));
}
function updateSubmissionStatus(id, status) {
  let subs = getSubmissions();
  const si = subs.findIndex(s=>s.id===id);
  if(si>-1) subs[si].status=status;
  saveSubmissions(subs);
  renderSubmissions();
}
function renderSubmissions() {
  const uploadsDiv = document.getElementById('submission-uploads-list')||{};
  const contactsDiv = document.getElementById('submission-contact-list')||{};
  const subs = getSubmissions();
  // Uploads/Tasks:
  let uploads = subs.filter(s => s.type==='upload' || s.type==='do');
  uploadsDiv.innerHTML = `<table class='w-full text-xs'><thead><tr><th>User</th><th>Lesson</th><th>Date</th><th>Status</th><th>File</th><th>Action</th></tr></thead><tbody>${uploads.map(s=>`<tr><td><img src='${getAvatarForUser(s.user?.name||"")}' class='w-7 h-7 rounded-full inline mr-2 align-middle' />${s.user?.name||''}</td><td>${s.lessonId}</td><td>${s.date||''}</td><td>${s.status}</td><td>${s.data&&s.data.fileName?`<a href='${s.data.fileUrl}' target='_blank'>${s.data.fileName}</a>`:'N/A'}</td><td>
    <button onclick="window._approveSubmission('${s.id}')" class='text-green-600 border px-2 py-1 rounded mr-2'>Approve</button>
    <button onclick="window._rejectSubmission('${s.id}')" class='text-red-600 border px-2 py-1 rounded'>Reject</button>
  </td></tr>`).join('')}</tbody></table>`;
  // Contact reward claims:
  let contacts = subs.filter(s => s.type==='contact');
  contactsDiv.innerHTML = `<table class='w-full text-xs'><thead><tr><th>User</th><th>Lesson</th><th>Date</th><th>Status</th><th>Fields</th><th>Action</th></tr></thead><tbody>${contacts.map(s=>`<tr><td><img src='${getAvatarForUser(s.user?.name||"")}' class='w-7 h-7 rounded-full inline mr-2 align-middle' />${s.user?.name||''}</td><td>${s.lessonId}</td><td>${s.date||''}</td><td>${s.status}</td><td>${Object.entries(s.data||{}).map(([k,v])=>`${k}: <span class='text-gold'>${v}</span>`).join('<br>')}</td><td>
    <button onclick="window._approveSubmission('${s.id}')" class='text-green-600 border px-2 py-1 rounded mr-2'>Approve</button>
    <button onclick="window._rejectSubmission('${s.id}')" class='text-red-600 border px-2 py-1 rounded'>Reject</button>
  </td></tr>`).join('')}</tbody></table>`;
}
window._approveSubmission=id=>updateSubmissionStatus(id,'approved');
window._rejectSubmission=id=>updateSubmissionStatus(id,'rejected');
// Submissions section navigation
const tabUploads=document.getElementById('tab-uploads'),tabContact=document.getElementById('tab-contact');
tabUploads?.addEventListener('click',()=>{tabUploads.classList.add('border-b-2','border-gold');tabContact.classList.remove('border-b-2','border-gold');document.getElementById('submission-uploads-list').classList.remove('hidden');document.getElementById('submission-contact-list').classList.add('hidden');});
tabContact?.addEventListener('click',()=>{tabContact.classList.add('border-b-2','border-gold');tabUploads.classList.remove('border-b-2','border-gold');document.getElementById('submission-contact-list').classList.remove('hidden');document.getElementById('submission-uploads-list').classList.add('hidden');});
// Navigation to open section
// (Connect to your sidebar nav, or for demo: expose globally window.openSubmissions=()=>{renderSubmissions();document.getElementById('submissions-section').classList.remove('hidden');})
renderSubmissions();

// --- Deep Export Tools ---
function parseDate(dstr) { try { return dstr ? new Date(dstr) : null; } catch { return null; } }
function filterByDate(data, field, start, end) {
  if (!start && !end) return data;
  return data.filter(x=>{
    let d = parseDate(x[field]||x.date);
    if (!d) return false;
    if (start && d < parseDate(start)) return false;
    if (end && d > parseDate(end+'T24:00')) return false;
    return true;
  });
}
function downloadCSV(filename, csv) {
  const blob = new Blob([csv], {type:'text/csv'});
  const link = document.createElement('a');
  link.href=URL.createObjectURL(blob); link.download=filename; document.body.appendChild(link); link.click(); link.remove();
}
document.getElementById('export-users-csv')?.addEventListener('click', function(){
  let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  let admins = JSON.parse(localStorage.getItem('adminAccounts')||'[]');
  let start = document.getElementById('export-filter-start').value;
  let end = document.getElementById('export-filter-end').value;
  lb = filterByDate(lb, 'joined', start, end);
  let csv = 'Name,Email,Pod,XP,Referral,Badges,Joined\n';
  lb.forEach(u=>csv += `${u.name||''},${u.email||''},${u.pod||''},${u.xp||0},${u.referralCode||''},${u.badges||''},${u.joined||''}\n`);
  admins.forEach(a=>csv += `${a.name},${a.email},,,[ADMIN],,${a.createdAt}\n`);
  downloadCSV('users.csv',csv);
});
document.getElementById('export-lessons-csv')?.addEventListener('click', function(){
  let lessons = JSON.parse(localStorage.getItem('allLessons')||'[]');
  let analytics = JSON.parse(localStorage.getItem('lessonAnalytics')||'{}');
  let csv = 'ID,Title,Views,Completed,QuizAttempts,QuizScore,Uploads\n';
  lessons.forEach(l=>{
    let a=analytics[l.id]||{};
    csv += `${l.id},"${l.title}",${a.views||0},${a.completed||0},${a.quizAttempts||0},${a.quizScoreSum||0},${a.uploads||0}\n`;
  });
  downloadCSV('lessons.csv',csv);
});
document.getElementById('export-submissions-csv')?.addEventListener('click', function(){
  let subs = JSON.parse(localStorage.getItem('submissions')||'[]');
  let start = document.getElementById('export-filter-start').value;
  let end = document.getElementById('export-filter-end').value;
  subs = filterByDate(subs,'date',start,end);
  let csv='User,Pod,Type,Lesson,Status,Date,Fields/File\n';
  subs.forEach(s=>{
    let dat = s.type==='contact'?Object.entries(s.data||{}).map(([k,v])=>`${k}:${v}`).join('; '):s.data?.fileName||'';
    csv+=`"${s.user?.name||''}",${s.user?.pod||''},${s.type||''},${s.lessonId||''},${s.status||''},${s.date||''},"${dat}"\n`;
  });
  downloadCSV('submissions.csv',csv);
});
document.getElementById('export-draws-csv')?.addEventListener('click', function(){
  let draws = JSON.parse(localStorage.getItem('drawWinners')||'[]');
  let start = document.getElementById('export-filter-start').value;
  let end = document.getElementById('export-filter-end').value;
  draws = filterByDate(draws,'date',start,end);
  let csv='Date,Winner,Pod,Period,Entries\n';
  draws.forEach(d=>csv+=`${d.date},${d.user},${d.pod},${d.period},${d.entries}\n`);
  downloadCSV('draws.csv',csv);
});
// --- done ---

function updateTeamSummaryBox() {
  const role = sessionStorage.getItem('adminRole');
  const box = document.getElementById('team-summary-card');
  if (!box) return;
  if(role==='superadmin') {
    box.classList.remove('hidden');
    const admins = getAdmins();
    document.getElementById('count-superadmins').textContent = admins.filter(a=>a.role==='superadmin').length;
    document.getElementById('count-admins').textContent = admins.filter(a=>a.role==='admin').length;
    document.getElementById('count-moderators').textContent = admins.filter(a=>a.role==='moderator').length;
  } else {
    box.classList.add('hidden');
  }
}
updateTeamSummaryBox();
const manageRolesBtn=document.getElementById('manage-roles-btn');
if(manageRolesBtn) manageRolesBtn.onclick=function(){
  // For one-page: scroll to admin table; for tabbed: switch to settings tab
  const admTbl = document.getElementById('admin-table');
  const settingsTab = document.querySelector("a[href='#settings']");
  if(settingsTab) settingsTab.click(); // switch nav if possible
  setTimeout(()=>{if(admTbl) admTbl.scrollIntoView({behavior:'smooth',block:'center'});}, 250);
};