export function renderVision() {
  const section = document.createElement('section');
  section.className = [
    'relative bg-accentgray py-20 px-4 overflow-hidden',
    'before:content-[""] before:block before:absolute before:left-0 before:top-0 before:w-full before:h-2 before:bg-gradient-to-r before:from-gold/30 before:via-gold/70 before:to-transparent before:rounded-b-lg before:opacity-80 before:z-[1]'
  ].join(' ');
  section.id = 'vision';
  section.innerHTML = `
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center fade-in-section">
      <div class="relative z-10 animate-fadeUp">
        <div class="h-1 w-16 bg-gradient-to-r from-gold via-gold/50 to-transparent rounded-full mb-5"></div>
        <h2 class="text-3xl md:text-4xl font-poppins font-bold text-gold mb-4 tracking-tight">Our Vision</h2>
        <p class="text-offwhite text-lg mb-6 font-inter max-w-lg">To bridge the gap between education and opportunity by helping learners grow through practical skill application, collaboration, and digital inclusion.</p>
        <div class="grid grid-cols-3 gap-4 mt-8">
          <div class="bg-charcoal/60 backdrop-blur-md rounded-xl flex flex-col items-center p-5 shadow-card border border-gold/10">
            <span class="text-2xl mb-2">📈</span>
            <span class="text-gold font-bold text-xs uppercase tracking-wide">Upskill</span>
          </div>
          <div class="bg-charcoal/60 backdrop-blur-md rounded-xl flex flex-col items-center p-5 shadow-card border border-gold/10">
            <span class="text-2xl mb-2">🤝</span>
            <span class="text-gold font-bold text-xs uppercase tracking-wide">Collaborate</span>
          </div>
          <div class="bg-charcoal/60 backdrop-blur-md rounded-xl flex flex-col items-center p-5 shadow-card border border-gold/10">
            <span class="text-2xl mb-2">🔗</span>
            <span class="text-gold font-bold text-xs uppercase tracking-wide">Connect</span>
          </div>
        </div>
      </div>
      <div class="relative flex items-center justify-center md:justify-end min-h-[18rem] animate-fadeUp delay-300">
        <!-- Glass/gradient animated abstract visual -->
        <div class="glassy-gradient-box w-72 h-72 rounded-3xl shadow-xl flex items-center justify-center animate-floatGold">
          <span class="text-7xl text-gold opacity-80">🌍</span>
          <div class="absolute left-1/3 top-10 w-24 h-24 bg-gold/20 blur-2xl rounded-full animate-orbFloat1"></div>
        </div>
      </div>
    </div>
    <style>
      .fade-in-section { opacity: 0; transform: translateY(36px); animation: fadeUp 1s .2s cubic-bezier(.4,.6,.2,1) forwards; }
      @keyframes fadeUp { to { opacity: 1; transform: none; } }
      .animate-fadeUp { animation: fadeUp 1s cubic-bezier(.6,.2,.2,1) forwards; opacity:0; }
      .delay-300 { animation-delay: .3s; }
      .glassy-gradient-box {
        background: linear-gradient(135deg, rgba(246, 201, 96, 0.14) 10%, rgba(40, 40, 40, 0.46) 60%, rgba(246,201,96,0.08) 100%);
        backdrop-filter: blur(14px) saturate(130%);
        border: 1.6px solid rgba(248, 248, 248, 0.16);
        box-shadow: 0 6px 48px 0 rgba(246, 201, 96, 0.165);
        position: relative;
      }
      @keyframes orbFloat1 { 0%{transform:translateY(0);} 50%{transform:translateY(-22px);} 100%{transform:translateY(0);} }
      .animate-orbFloat1 {animation: orbFloat1 7.7s ease-in-out infinite;}
      .animate-floatGold {animation: floatGold 11s ease-in-out infinite alternate;}
      @keyframes floatGold { 0%{transform: translateY(0);} 100%{transform:translateY(-22px);} }
    </style>
  `;
  return section;
}
