export function renderGrowthLoop() {
  const section = document.createElement('section');
  section.className = [
    'py-20 px-4 bg-charcoal',
    'relative z-0'
  ].join(' ');
  section.id = 'growth-loop';
  section.innerHTML = `
    <div class="max-w-5xl mx-auto flex flex-col items-center gap-10">
      <h3 class="text-2xl md:text-3xl font-poppins font-bold text-gold text-center mb-7">Learn → Do → Earn</h3>
      <div class="relative flex flex-col md:flex-row items-center justify-between w-full gap-7 md:gap-0">
        <!-- Connector Line (desktop only) -->
        <div class="hidden md:block absolute left-0 top-1/2 w-full h-6 -z-10">
          <div class="w-full h-1 rounded-full bg-gradient-to-r from-gold/30 via-gold/60 to-gold/10 blur-[2.5px]" style="margin-top:11px;"></div>
        </div>
        <!-- Steps -->
        <div class="flex-1 flex flex-col items-center text-center md:translate-y-0 fade-in-step">
          <div class="bg-gold/10 border border-gold/10 rounded-full h-20 w-20 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md animate-glassStep1">
            <span class="text-3xl">🧠</span>
          </div>
          <div class="bg-charcoal/40 border border-gold/15 rounded-2xl p-7 shadow-lg mb-4 backdrop-blur-md glass-step-card animate-fadeUp-step">
            <h4 class="font-bold text-lg mb-2 font-poppins">Learn</h4>
            <p class="text-offwhite mb-2 font-inter">Attend workshops, join skill pods, and access mentorship.</p>
          </div>
        </div>
        <div class="md:mx-0 md:w-12 h-12 flex flex-row items-center justify-center">
          <span class="hidden md:inline-block text-3xl text-gold animate-arrowGlow">→</span>
        </div>
        <div class="flex-1 flex flex-col items-center text-center md:translate-y-0 fade-in-step delay-150">
          <div class="bg-gold/10 border border-gold/10 rounded-full h-20 w-20 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md animate-glassStep2">
            <span class="text-3xl">⚙️</span>
          </div>
          <div class="bg-charcoal/40 border border-gold/15 rounded-2xl p-7 shadow-lg mb-4 backdrop-blur-md glass-step-card animate-fadeUp-step delay-150">
            <h4 class="font-bold text-lg mb-2 font-poppins">Do</h4>
            <p class="text-offwhite mb-2 font-inter">Apply your skills through micro-projects and collaborations.</p>
          </div>
        </div>
        <div class="md:mx-0 md:w-12 h-12 flex flex-row items-center justify-center">
          <span class="hidden md:inline-block text-3xl text-gold animate-arrowGlow">→</span>
        </div>
        <div class="flex-1 flex flex-col items-center text-center md:translate-y-0 fade-in-step delay-300">
          <div class="bg-gold/10 border border-gold/10 rounded-full h-20 w-20 flex items-center justify-center mb-4 shadow-xl backdrop-blur-md animate-glassStep3">
            <span class="text-3xl">💰</span>
          </div>
          <div class="bg-charcoal/40 border border-gold/15 rounded-2xl p-7 shadow-lg mb-4 backdrop-blur-md glass-step-card animate-fadeUp-step delay-300">
            <h4 class="font-bold text-lg mb-2 font-poppins">Earn</h4>
            <p class="text-offwhite mb-2 font-inter">Get recognized, hired, or funded for your growth.</p>
          </div>
        </div>
      </div>
    </div>
    <style>
      .glass-step-card { box-shadow: 0 4px 32px 0 rgba(246,201,96,0.12); }
      @keyframes fadeUp-step { to { opacity: 1; transform: none; } }
      .animate-fadeUp-step { opacity: 0; transform: translateY(36px); animation: fadeUp-step 1s cubic-bezier(.6,.2,.2,1) forwards; }
      .fade-in-step { opacity:0; transform: translateY(24px); animation: fadeUp-step 1.1s cubic-bezier(.7,.22,.18,1) forwards; }
      .delay-150 { animation-delay: .17s; }
      .delay-300 { animation-delay: .3s; }
      @keyframes arrowGlow {0%,100%{text-shadow:0 0 4px #f6c96033;}50%{text-shadow:0 0 16px #f6c960; color:#f6c960;} }
      .animate-arrowGlow {animation: arrowGlow 2.4s infinite alternate cubic-bezier(.7,.2,.2,1);}
      .animate-glassStep1,.animate-glassStep2,.animate-glassStep3 {animation:floating 6s ease-in-out infinite;} 
      @keyframes floating {0%{transform: translateY(0);}50%{transform:translateY(-10px);}100%{transform:translateY(0);}}
      @media (max-width: 768px) {
        #growth-loop .flex-col.md\:flex-row { flex-direction: column !important; }
        #growth-loop .md\:block { display: none !important; }
        #growth-loop .md\:w-12 { width: 0 !important; }
      }
    </style>
  `;
  return section;
}
