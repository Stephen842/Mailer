export function renderPods() {
  const section = document.createElement('section');
  section.className = 'bg-accentgray py-20 px-4';
  section.id = 'pods';
  section.innerHTML = `
    <h3 class="text-2xl md:text-3xl font-poppins font-bold text-gold mb-10 text-center">Explore Skill Pods</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 max-w-6xl mx-auto">
      <div class="relative bg-charcoal/60 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-gold/15 flex flex-col items-center text-center card-glass hover:shadow-gold/50 hover:-translate-y-2 hover:border-gold transition-all duration-200 group">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold/90 text-charcoal font-bold text-xs rounded-full px-3 py-1 shadow-md uppercase tracking-wide">Creator</div>
        <span class="text-3xl mb-3">🎥</span>
        <h4 class="font-semibold mb-1 font-poppins text-lg">Creator Pod</h4>
        <p class="text-offwhite text-sm">For storytellers and creators building a personal brand and growing on social.</p>
      </div>
      <div class="relative bg-charcoal/60 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-gold/15 flex flex-col items-center text-center card-glass hover:shadow-gold/50 hover:-translate-y-2 hover:border-gold transition-all duration-200 group">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold/90 text-charcoal font-bold text-xs rounded-full px-3 py-1 shadow-md uppercase tracking-wide">Educator</div>
        <span class="text-3xl mb-3">📚</span>
        <h4 class="font-semibold mb-1 font-poppins text-lg">Educator Pod</h4>
        <p class="text-offwhite text-sm">For trainers and explainers who inspire action through teaching and content.</p>
      </div>
      <div class="relative bg-charcoal/60 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-gold/15 flex flex-col items-center text-center card-glass hover:shadow-gold/50 hover:-translate-y-2 hover:border-gold transition-all duration-200 group">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold/90 text-charcoal font-bold text-xs rounded-full px-3 py-1 shadow-md uppercase tracking-wide">Community</div>
        <span class="text-3xl mb-3">🤝</span>
        <h4 class="font-semibold mb-1 font-poppins text-lg">Community Pod</h4>
        <p class="text-offwhite text-sm">For connectors and hosts who build, manage, and grow online communities.</p>
      </div>
      <div class="relative bg-charcoal/60 backdrop-blur-xl rounded-2xl p-8 shadow-card border border-gold/15 flex flex-col items-center text-center card-glass hover:shadow-gold/50 hover:-translate-y-2 hover:border-gold transition-all duration-200 group">
        <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold/90 text-charcoal font-bold text-xs rounded-full px-3 py-1 shadow-md uppercase tracking-wide">Builder</div>
        <span class="text-3xl mb-3">🧠</span>
        <h4 class="font-semibold mb-1 font-poppins text-lg">Builder Pod</h4>
        <p class="text-offwhite text-sm">For digital problem-solvers creating and shipping tools, apps, and automations.</p>
      </div>
    </div>
    <style>
      .card-glass { transition-property: box-shadow, transform, border-color; }
    </style>
  `;
  return section;
}
