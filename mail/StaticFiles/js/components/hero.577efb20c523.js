export function renderHero() {
  const hero = document.createElement('section');
  hero.className = [
    'relative flex flex-col justify-center items-center min-h-[95vh] w-full',
    'bg-charcoal text-offwhite overflow-hidden px-4'
  ].join(' ');
  hero.id = 'hero';
  hero.innerHTML = `
    <!-- GRID + ANIMATED GRADIENT BG -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-charcoal"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-gold/10 via-[#2d2d2d] to-gold/5 animate-gradientMove"></div>
      <div class="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent animate-gradientPulse"></div>
      <!-- Ambient Orbs -->
      <div class="absolute top-1/3 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl animate-orbFloat1"></div>
      <div class="absolute bottom-16 right-40 w-36 h-36 bg-gold/30 rounded-full blur-2xl animate-orbFloat2"></div>
      <div class="absolute top-20 right-1/3 w-40 h-40 bg-offwhite/10 rounded-full blur-2xl animate-orbFloat3"></div>
      <!-- Subtle Grid Overlay -->
      <svg class="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay" xmlns="http://www.w3.org/2000/svg" fill="none"><defs><pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" stroke-width="1" opacity=".11"/></pattern></defs><rect width="100%" height="100%" fill="url(#smallGrid)"/></svg>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-3xl pt-40 pb-20 flex flex-col items-center text-center">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-poppins font-bold leading-tight mb-4 
        bg-gradient-to-r from-gold via-offwhite to-offwhite bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(246,201,96,0.04)]">
        Learn. Do. Earn. <span class="block mt-2">— The <span class="text-gold">Future of Work</span> Starts Here.</span>
      </h1>
      <div class="w-24 h-1 rounded bg-gradient-to-r from-gold/80 via-gold to-transparent mx-auto mb-7"></div>
      <p class="text-lg md:text-xl text-accentgray mb-8 font-inter max-w-2xl mx-auto">
        A digital skill-building community helping young Africans learn in-demand skills, apply them through real projects, and earn from opportunities.
      </p>
      <div class="flex gap-4 flex-col sm:flex-row justify-center">
        <a href="#plans" class="relative font-poppins font-bold px-7 py-3 rounded-full shadow-lg bg-gold text-charcoal transition hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(246,201,96,0.22)] hover:ring-2 hover:ring-gold/40 focus:outline-none focus:ring-2 ring-gold/60">
          Join the Movement
        </a>
        <button id="watch-overview" class="relative border-2 border-gold text-gold font-bold px-7 py-3 rounded-full bg-transparent hover:bg-gold/10 hover:text-offwhite transition hover:scale-105 focus:outline-none focus:ring-2 ring-gold">
          Watch Overview
        </button>
      </div>
    </div>
    <style>
      @keyframes orbFloat1 { 0%{transform:translateY(0);} 50%{transform:translateY(-30px);} 100%{transform:translateY(0);} }
      @keyframes orbFloat2 { 0%{transform:translateY(0);}50%{transform:translateY(20px);}100%{transform:translateY(0);} }
      @keyframes orbFloat3 { 0%{transform:translateY(0);}50%{transform:translateY(-18px);}100%{transform:translateY(0);} }
      .animate-orbFloat1 {animation: orbFloat1 8s ease-in-out infinite;}
      .animate-orbFloat2 {animation: orbFloat2 11s ease-in-out infinite;}
      .animate-orbFloat3 {animation: orbFloat3 9.5s ease-in-out infinite;}
      @keyframes gradientMove {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
      .animate-gradientMove {background-size:200% 200%;animation: gradientMove 15s ease-in-out infinite;}
      @keyframes gradientPulse {0%,100%{opacity:.5;}50%{opacity:1;}}
      .animate-gradientPulse {animation: gradientPulse 12s ease-in-out infinite;}
    </style>
  `;
  return hero;
}

