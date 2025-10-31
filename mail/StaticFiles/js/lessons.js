// lessons.js

// Validation: redirect if no onboarding data
if(!localStorage.getItem("userName") || !localStorage.getItem("userPod")) {
  window.location.href = "onboarding.html";
}

const userPod = localStorage.getItem('userPod') || 'Creator';
document.getElementById('userPodBadge').textContent = userPod;

// Lesson data structure
const lessonData = {
  'Creator': [
    { id: 1, title: 'Introduction to Content Creation', desc: 'Learn the basics of creating engaging content', video: 'https://example.com/video1', locked: false, completed: false },
    { id: 2, title: 'Social Media Strategy', desc: 'Develop a winning social media strategy', video: 'https://example.com/video2', locked: false, completed: false },
    { id: 3, title: 'Video Editing Fundamentals', desc: 'Master the art of video editing', video: 'https://example.com/video3', locked: true, completed: false },
    { id: 4, title: 'Building Your Brand', desc: 'Create and maintain a strong personal brand', video: 'https://example.com/video4', locked: true, completed: false },
  ],
  'Builder': [
    { id: 1, title: 'Web Development Basics', desc: 'Start building websites from scratch', video: 'https://example.com/video1', locked: false, completed: false },
    { id: 2, title: 'JavaScript Fundamentals', desc: 'Learn core JavaScript concepts', video: 'https://example.com/video2', locked: false, completed: false },
    { id: 3, title: 'APIs and Integration', desc: 'Connect your apps to external services', video: 'https://example.com/video3', locked: true, completed: false },
    { id: 4, title: 'Deployment Essentials', desc: 'Launch your projects to the web', video: 'https://example.com/video4', locked: true, completed: false },
  ],
  'Educator': [
    { id: 1, title: 'Teaching Methods 101', desc: 'Discover effective teaching techniques', video: 'https://example.com/video1', locked: false, completed: false },
    { id: 2, title: 'Course Design Principles', desc: 'Structure engaging online courses', video: 'https://example.com/video2', locked: false, completed: false },
    { id: 3, title: 'Student Engagement', desc: 'Keep learners motivated and active', video: 'https://example.com/video3', locked: true, completed: false },
    { id: 4, title: 'Advanced Pedagogy', desc: 'Master advanced teaching strategies', video: 'https://example.com/video4', locked: true, completed: false },
  ],
  'Community': [
    { id: 1, title: 'Community Building Basics', desc: 'Foundations of great communities', video: 'https://example.com/video1', locked: false, completed: false },
    { id: 2, title: 'Event Planning', desc: 'Organize and execute community events', video: 'https://example.com/video2', locked: false, completed: false },
    { id: 3, title: 'Discord & Telegram Management', desc: 'Master community platforms', video: 'https://example.com/video3', locked: true, completed: false },
    { id: 4, title: 'Community Growth', desc: 'Scale your community sustainably', video: 'https://example.com/video4', locked: true, completed: false },
  ]
};

// Load lesson completion state
function loadLessonState() {
  const state = localStorage.getItem('lessonState');
  return state ? JSON.parse(state) : {};
}

// Save lesson completion state
function saveLessonState(state) {
  localStorage.setItem('lessonState', JSON.stringify(state));
}

let lessonState = loadLessonState();

// Unified lessons retrieval
function getLessonsFromStorage() {
  let lessons = JSON.parse(localStorage.getItem('allLessons') || '[]');
  if (!lessons.length) {
    // fallback to default/hardcoded (for first use)
    if (lessonData[userPod]) {
      lessons = lessonData[userPod].map(l => ({
        ...l,
        doTask: l.doTask || '',
        earnReward: l.earnReward || '',
        desc: l.desc || '',
        video: l.video || '',
        status: l.status || 'published',
      }));
    }
    localStorage.setItem('allLessons', JSON.stringify(lessons));
  }
  return lessons;
}

// override currentLessons:
const currentLessons = getLessonsFromStorage();

// Render lesson cards
function renderLessons() {
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = '';
  
  currentLessons.forEach((lesson, index) => {
    const completed = lessonState[`${userPod}-${lesson.id}`] || lesson.completed;
    const prereqTitles = (lesson.prerequisites||[]).map(pid=>{
      const found = currentLessons.find(l=>l.id===pid); return found ? found.title : 'Lesson '+pid;
    });
    const allPrereqsDone = (lesson.prerequisites||[]).every(pid => lessonState[`${userPod}-${pid}`]);
    const locked = (!allPrereqsDone) || (index > 0 && !(lessonState[`${userPod}-${currentLessons[index - 1].id}`] || currentLessons[index - 1].completed));
    
    const card = document.createElement('div');
    card.className = `lesson-card bg-accentgray/60 rounded-2xl p-6 shadow-lg border border-gold/10 ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200'} ${completed ? 'border-gold border-2' : ''}`;
    card.innerHTML = `
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-bold font-poppins text-gold">${lesson.title}</h3>
        ${completed ? '<span class="text-gold text-xl">✓</span>' : ''}
      </div>
      <p class="text-sm text-offwhite font-inter mb-2">${lesson.desc || ''}</p>
      ${locked && prereqTitles.length ? `<div class='mb-3 text-xs text-red-400 font-bold'><span class='mr-1'>🔒</span>Locked: Complete ${prereqTitles.join(', ')} to unlock.</div>` : ''}
      <ul class="mb-2 text-xs text-offwhite">
        <li><span class="text-gold font-semibold">Do:</span> ${lesson.doTask || '<span class=\'text-accentgray\'>No Do task defined</span>'}</li>
        <li><span class="text-gold font-semibold">Earn:</span> ${lesson.earnReward || '<span class=\'text-accentgray\'>No reward defined</span>'}</li>
      </ul>
      ${locked ? '<button disabled class="text-xs text-accentgray">🔒 Locked</button>' : completed ? '<button class="text-xs text-gold">Completed</button>' : '<button class="bg-gold text-charcoal text-xs font-bold px-4 py-2 rounded-full hover:scale-105 transition">Start Lesson</button>'}
    `;
    
    if (!locked) {
      card.addEventListener('click', () => openLessonModal(lesson));
    }
    
    grid.appendChild(card);
  });
}

// Multi-step user modal state
let lessonModalStep = 0;
let activeLesson = null;
let userQuizAnswers = [];
let userFileUpload = null;
let userContactInput = {};

  const modal = document.getElementById('lesson-modal');
  const content = document.getElementById('modal-content');
  
// --- ADMIN ANALYTICS TRACKING ---
function incrementAnalytics(lessonId, kind, val) {
  let analytics = JSON.parse(localStorage.getItem('lessonAnalytics') || '{}');
  analytics[lessonId] = analytics[lessonId] || { views:0, completed:0, quizAttempts:0, quizScoreSum:0, uploads:0 };
  if (kind==='views') analytics[lessonId].views += 1;
  if (kind==='completed') analytics[lessonId].completed += 1;
  if (kind==='quizAttempt' && typeof val==='number') { analytics[lessonId].quizAttempts += 1; analytics[lessonId].quizScoreSum += val; }
  if (kind==='upload') analytics[lessonId].uploads += 1;
  localStorage.setItem('lessonAnalytics', JSON.stringify(analytics));
}
// track view
function openLessonModal(lesson) {
  activeLesson = lesson;
  lessonModalStep = 0;
  userQuizAnswers = (lesson.quizQuestions || []).map(()=>'');
  userFileUpload = null;
  userContactInput = {};
  incrementAnalytics(lesson.id, 'views');
  renderLessonModalStep();
  modal.classList.remove('hidden');
}

function renderLessonModalStep() {
  // Step bar/nav
  const progressBar = `
  <div class='flex items-center gap-2 mb-5 mt-1'>
    <div class='h-2 w-1/3 rounded-full '+${lessonModalStep===0?'bg-gold/80':'bg-gold/40'}></div>
    <div class='h-2 w-1/3 rounded-full '+${lessonModalStep>0?'bg-gold/80':'bg-gold/20'}></div>
    <div class='h-2 w-1/3 rounded-full '+${lessonModalStep===2?'bg-gold/80':'bg-gold/20'}></div>
  </div>`;
  let html = '';
  if (lessonModalStep===0) {
    html = `
    <h2 class="text-2xl font-bold font-poppins text-gold mb-4">${activeLesson.title}</h2>
    <p class="text-offwhite mb-6 font-inter">${activeLesson.desc || ''}</p>
    <div class="aspect-video bg-charcoal rounded-lg flex items-center justify-center mb-6">
      <div class="text-center">
        <div class="text-4xl mb-2">📹</div>
        <p class="text-sm text-accentgray">Video Player Placeholder</p>
        <p class="text-xs text-accentgray mt-1">URL: ${activeLesson.video||''}</p>
      </div>
    </div>
    <div class="flex justify-end mt-6">
      <button id='modal-next-btn' class='bg-gold text-charcoal font-bold px-8 py-3 rounded-full hover:scale-105 transition shadow-lg'>Next</button>
    </div>
    `;
  } else if (lessonModalStep===1) {
    if (activeLesson.doType==='quiz' && (activeLesson.quizQuestions||[]).length) {
      let timerUI = '';
      let timeLimit = activeLesson.quizTimeLimit||null;
      if (timeLimit) {
        timerUI = `<div id='quiz-timer' class='text-gold text-sm mb-1 font-semibold'>Time left: <span id='quiz-timer-count'>${timeLimit*60}</span> sec</div>`;
      }
      html = `<form id='quiz-form'>${timerUI}
        <h3 class='font-bold text-gold mb-3'>Quiz</h3>
        ${(activeLesson.quizQuestions||[]).map((q,i)=>{
          let field='';
          if(q.type==='mcq'){
            field = q.options.map(opt=>`<label class='block'><input type='radio' name='q${i}' value='${opt}' ${userQuizAnswers[i]===opt?'checked':''}> ${opt}</label>`).join('');
          } else if(q.type==='tf'){
            field = ['True','False'].map(opt=>`<label class='inline-flex items-center gap-1'><input type='radio' name='q${i}' value='${opt}' ${userQuizAnswers[i]===opt?'checked':''}> ${opt}</label>`).join(' ');
          } else if(q.type==='text'){
            field = `<input type='text' class='w-full bg-charcoal/60 border border-gold/20 rounded px-2 py-1 text-offwhite' name='q${i}' value='${userQuizAnswers[i]||''}'>`;
          } else if(q.type==='file'){
            field = `<input type='file' name='q${i}' class='mb-2' /><div class='text-xs text-accentgray my-1'>${q.instructions||''}</div>`;
          } else if(q.type==='code'){
            field = `<textarea name='q${i}' rows='3' class='w-full bg-charcoal/60 border border-gold/20 rounded px-2 py-1 text-offwhite'>${userQuizAnswers[i]||''}</textarea>`;
          }
          return `<div class='mb-4'><div class='font-semibold mb-1'>${i+1}. ${q.question}</div>${field}<div id='quiz-feedback-${i}' class='text-xs text-gold font-bold mt-1'></div></div>`;
        }).join('')}
        <div class='flex justify-end mt-4'><button class='bg-gold text-charcoal font-bold px-8 py-2 rounded-full hover:scale-105' type='submit'>Submit Quiz</button></div>
      </form>`;
    } else if (activeLesson.doType==='upload') {
      html = `<div>
        <h3 class='font-bold text-gold mb-2'>Upload Task</h3>
        <p class='mb-3 text-offwhite'>${activeLesson.uploadInstruction||'Upload your file as required.'}</p>
        <input type='file' id='modal-file-input' class='mb-2' />
        <div class='flex justify-end mt-4'><button id='modal-upload-next' class='bg-gold text-charcoal font-bold px-8 py-2 rounded-full hover:scale-105' disabled>Next</button></div>
      </div>`;
    } else {
      // instructions do
      html = `<div>
        <h3 class='font-bold text-gold mb-2'>Task</h3>
        <p class='mb-5 text-offwhite'>${activeLesson.doInstructions||'Complete the required task to continue.'}</p>
        <label class='flex items-center gap-2'><input type='checkbox' id='modal-completed-checkbox'> I finished this task.</label>
        <div class='flex justify-end mt-4'><button id='modal-instruction-next' class='bg-gold text-charcoal font-bold px-8 py-2 rounded-full hover:scale-105' disabled>Next</button></div>
      </div>`;
    }
  } else {
    // Step 3 Earn
    let earnHTML = '';
    if (activeLesson.earnType==='xp') {
      earnHTML = `<div class='text-center p-5'><div class='text-5xl mb-2 text-gold'>🎉</div><div class='text-lg mb-2 text-gold'>You earned ${activeLesson.xpAmount||0} XP!</div><div class='text-offwhite mb-2'>${activeLesson.earnMessage||''}</div></div>`;
    } else if (activeLesson.earnType==='badge') {
      earnHTML = `<div class='text-center p-5'>`;
      if (activeLesson.badgeImage) {
        earnHTML += `<div class='flex items-center justify-center mb-2'><img src='${activeLesson.badgeImage}' style='max-width:100px;max-height:80px;' class='rounded shadow inline-block' /></div>`;
      }
      earnHTML += `<div class='text-5xl text-gold mb-2'>🏅</div><div class='text-lg mb-2 text-gold'>Badge earned: ${activeLesson.badgeLabel||'Badge'}!</div><div class='text-offwhite mb-2'>${activeLesson.earnMessage||''}</div></div>`;
    } else if (activeLesson.earnType==='contact' && activeLesson.contactFields?.length) {
      earnHTML = `<form id='contact-claim-form'><div class='mb-2 text-offwhite'>${activeLesson.earnMessage||'Submit the info below to claim your reward.'}</div>
        ${activeLesson.contactFields.map((f,i)=>`<div class='mb-3'><label class='block text-gold mb-1'>${f.label}${f.required ? ' *' : ''}</label><input type='text' class='w-full bg-charcoal/60 border border-gold/20 rounded px-2 py-2 text-offwhite' name='cf${i}' ${f.required?'required':''} /></div>`).join('')}
        <div class='flex justify-end mt-4'><button class='bg-gold text-charcoal font-bold px-8 py-2 rounded-full hover:scale-105' type='submit'>Submit & Claim</button></div></form>`;
    }
    if (activeLesson.certificateEnabled) {
      earnHTML += `<div class='flex flex-col items-center mt-3'><button id='download-certificate-btn' class='bg-gold text-charcoal font-bold px-6 py-2 rounded shadow-lg mt-3'>Download Certificate</button></div><div id='certificate-canvas' style='display:none;background:white;'></div>`;
    }
    html = `<div>${earnHTML}<div class='flex justify-end mt-4'><button id='modal-finish-btn' class='bg-gold text-charcoal font-bold px-8 py-2 rounded-full hover:scale-105'>Finish</button></div></div>`;
  }
  content.innerHTML = progressBar+html;

  // NAVIGATION / LOGIC per step
  if (lessonModalStep===0) {
    document.getElementById('modal-next-btn').onclick = ()=>{ lessonModalStep=1; renderLessonModalStep(); };
  } else if(lessonModalStep===1) {
    if (activeLesson.doType==='quiz') {
      if (activeLesson.quizTimeLimit) {
        let timeLeft = activeLesson.quizTimeLimit*60;
        const timerInt = setInterval(()=>{
          document.getElementById('quiz-timer-count').innerText = timeLeft;
          timeLeft--; if (timeLeft<0) {
            clearInterval(timerInt);
            document.getElementById('quiz-form').dispatchEvent(new Event('submit'));
          }
        }, 1000);
      }
      const quizForm = document.getElementById('quiz-form');
      quizForm.onsubmit = function(ev){
        ev.preventDefault();
        // collect answers
        const form = new FormData(quizForm);
        let feedbacks = [];
        let correctTotal=0;
        userQuizAnswers = activeLesson.quizQuestions.map((q, i) => {
          let ans = form.get('q'+i);
          let correct = false;
          if (q.type==='mcq'||q.type==='tf') {
            correct = (ans===q.answer);
          } else if (q.type==='text'||q.type==='code') {
            correct = ans && (ans.trim().toLowerCase() === (q.answer||'').trim().toLowerCase());
          } else if (q.type==='file') {
            correct = true; // always accept for file upload, admin reviews outside
          }
          if (correct) correctTotal++;
          feedbacks[i] = correct ? 'Correct' : 'Incorrect';
          return ans||'';
        });
        // display feedbacks:
        (activeLesson.quizQuestions||[]).forEach((q,i)=>{ let el=document.getElementById('quiz-feedback-'+i); if(el) el.textContent=feedbacks[i]; el.className+=' '+(feedbacks[i]==='Correct' ? 'text-green-400' : 'text-red-400'); });
        // analytics (score %)
        let quizPct = Math.round(correctTotal/(activeLesson.quizQuestions.length||1)*100);
        incrementAnalytics(activeLesson.id, 'quizAttempt', quizPct);
        setTimeout(()=>{ lessonModalStep=2; renderLessonModalStep(); }, 900);
      }
    } else if (activeLesson.doType==='upload') {
      document.getElementById('modal-file-input').addEventListener('change', function(e){
        userFileUpload = e.target.files && e.target.files[0];
        document.getElementById('modal-upload-next').disabled = !userFileUpload;
      });
      document.getElementById('modal-upload-next').onclick = function(){
        if (userFileUpload) {
          const reader = new FileReader();
          reader.onload = function(evt){
            saveSubmission({
              id:'sub-'+Date.now(),type:'upload',lessonId:activeLesson.id,user:{name:localStorage.getItem('userName'),pod:localStorage.getItem('userPod')},data:{fileName:userFileUpload.name,fileUrl:evt.target.result},status:'pending',date:new Date().toLocaleString()});
            incrementAnalytics(activeLesson.id,'upload');
            lessonModalStep=2;renderLessonModalStep();
          };
          reader.readAsDataURL(userFileUpload);
          return;
        }
        lessonModalStep=2; renderLessonModalStep();
      }
    } else {
      const checkbox = document.getElementById('modal-completed-checkbox');
      const nextBtn = document.getElementById('modal-instruction-next');
      checkbox.onchange = ()=>{ nextBtn.disabled = !checkbox.checked; }
      nextBtn.onclick = ()=>{
        incrementAnalytics(activeLesson.id,'completed');
        lessonModalStep=2; renderLessonModalStep();
      };
    }
  } else if (lessonModalStep===2) {
    if (activeLesson.earnType==='contact' && activeLesson.contactFields?.length) {
      document.getElementById('contact-claim-form').onsubmit = function(ev){
        ev.preventDefault();
        const form = new FormData(this);
        let claim = {};
        activeLesson.contactFields.forEach((f,i)=>{
          claim[f.label]=form.get('cf'+i)||'';
        });
        saveSubmission({id:'sub-'+Date.now(),type:'contact',lessonId:activeLesson.id,user:{name:localStorage.getItem('userName'),pod:localStorage.getItem('userPod')},data:claim,status:'pending',date:new Date().toLocaleString()});
        completeLesson();
        showToast('Submitted! Reward will be processed.');
        modal.classList.add('hidden');
      }
    }
    if (activeLesson.certificateEnabled) {
      document.getElementById('download-certificate-btn').onclick = function(){
        const cDiv = document.getElementById('certificate-canvas');
        const name = localStorage.getItem('userName')||'User';
        const pod = localStorage.getItem('userPod')||'';
        const today = new Date().toLocaleDateString();
        let certHTML = `<div style='width:480px;height:320px;border:4px solid #f6c960;background:#fffbe7;color:#1a1a1a;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:sans-serif;'><div style='font-size:1.5em;margin-bottom:10px;'>Certificate of Completion</div>`;
        if(activeLesson.badgeImage) certHTML += `<img src='${activeLesson.badgeImage}' style='max-width:80px;max-height:80px;margin-bottom:10px;' />`;
        certHTML += `<div style='font-size:1.2em;margin-bottom:8px;'><b>${name}</b></div>
          <div style='margin-bottom:8px;'>completed the lesson</div>
          <div style='font-size:1.1em;font-weight:bold;margin-bottom:10px;'>${activeLesson.title}</div>
          <div style='font-size:.95em;margin-bottom:4px;'>in Pod <b>${pod}</b></div>
          <div style='font-size:.84em;margin-bottom:8px;'>${activeLesson.desc||''}</div>
          <div style='margin-top:10px;font-size:.9em;'>Date: ${today}</div></div>`;
        cDiv.innerHTML = certHTML; cDiv.style.display='block';
        // dynamically load html2canvas from CDN if not present
        const doDownload = () => {
          window.html2canvas(cDiv,{backgroundColor:'#fff',scale:2}).then(canvas=>{
            const a = document.createElement('a');
            a.download = (activeLesson.title||'certificate')+'.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
            cDiv.style.display='none';
          });
        };
        if (!window.html2canvas) {
          const s=document.createElement('script');
          s.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
          s.onload=doDownload; document.body.appendChild(s);
        } else { doDownload(); }
      };
    }
    document.getElementById('modal-finish-btn').onclick = function(){
      incrementAnalytics(activeLesson.id,'completed');
      completeLesson(); modal.classList.add('hidden'); };
  }
}
function completeLesson(){
  lessonState[`${userPod}-${activeLesson.id}`]=true;
  saveLessonState(lessonState);
  // XP/Badges handling here, if earnType is XP or badge, could update localStorage accordingly
  renderLessons();
}

// Mark lesson as complete
function markLessonComplete(lesson) {
  lessonState[`${userPod}-${lesson.id}`]=true;
  saveLessonState(lessonState);
  // XP/Badges handling here, if earnType is XP or badge, could update localStorage accordingly
  renderLessons();
  // Referral reward logic
  const referredBy = localStorage.getItem('referredBy');
  const referralRewarded = localStorage.getItem('referralRewarded');
  if(referredBy && !referralRewarded) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')||'[]');
    const currentUser = localStorage.getItem('userName');
    const refUserIdx = leaderboard.findIndex(u=>u && u.referralCode===referredBy);
    const curUserIdx = leaderboard.findIndex(u=>u && u.name===currentUser);
    // Reward both: +25XP (demo)
    if(curUserIdx>-1) leaderboard[curUserIdx].xp = (leaderboard[curUserIdx].xp||0)+25;
    if(refUserIdx>-1) leaderboard[refUserIdx].xp = (leaderboard[refUserIdx].xp||0)+25;
    localStorage.setItem('leaderboard',JSON.stringify(leaderboard));
    localStorage.setItem('referralRewarded','yes');
    showToast('Referral! Both you and your inviter got +25 XP!');
  }
  (function(){
    const user = localStorage.getItem('userName')||'User';
    const pod = localStorage.getItem('userPod')||'';
    const now = new Date();
    const weekStart = new Date(now);weekStart.setDate(now.getDate() - now.getDay() + 1);const weekStr = weekStart.toISOString().slice(0,10);
    const monthStr = now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
    let pool = JSON.parse(localStorage.getItem('drawPool')||'[]');
    pool.push({user,pod,date:now.toLocaleString(),lessonId:lesson.id,week:weekStr,month:monthStr});
    localStorage.setItem('drawPool',JSON.stringify(pool));
  })();
  if (typeof window.streakCheck === 'function') window.streakCheck();
}

// Close modal
function closeModal() {
  document.getElementById('lesson-modal').classList.add('hidden');
}

// Toast notification with slide-in effect
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-gold text-charcoal font-bold px-6 py-3 rounded-full shadow-lg cursor-pointer whitespace-nowrap hover:shadow-gold/60 transition transform animate-slideIn';
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
  
  toast.addEventListener('click', () => toast.remove());
}

// Event listeners
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('lesson-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initial render
renderLessons();

function saveSubmission(sub) {
  let subs = JSON.parse(localStorage.getItem('submissions')||'[]');
  subs.push(sub); localStorage.setItem('submissions',JSON.stringify(subs));
}

