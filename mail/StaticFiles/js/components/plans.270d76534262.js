export function renderPlans() {
  const section = document.createElement('section');
  section.className = 'bg-gradient-to-b from-accentgray via-charcoal to-gold/10 py-20 px-4';
  section.id = 'plans';
  section.innerHTML = `
    <h3 class="text-2xl md:text-3xl font-poppins font-bold text-gold mb-5 text-center">Choose Your Path</h3>
    <div class="text-offwhite text-center mb-12 font-inter">Access our community, tasks, and mentoring—move at your own speed, upgrade at any time.</div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
      <div class="bg-charcoal/60 backdrop-blur-lg rounded-2xl p-9 shadow-card flex flex-col items-center text-center border-2 border-gold/0 pricing-glass-card hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200">
        <div class="text-3xl mb-2">🟢</div>
        <div class="text-lg mb-1 text-gold font-bold">Free Access</div>
        <div class="text-3xl font-bold mb-3">Free</div>
        <ul class="mb-5 text-offwhite text-sm font-inter list-disc list-inside text-left mx-auto space-y-1 max-w-xs">
          <li>Join events & discussions</li>
          <li>Explore project pods</li>
          <li>Network with creators & mentors</li>
        </ul>
        <a href="#join" class="px-5 py-3 rounded-full bg-gold text-charcoal font-semibold shadow hover:bg-gradient-to-br hover:from-gold hover:via-yellow-300 hover:to-gold transition">Join Now</a>
      </div>
      <div class="relative bg-charcoal/60 backdrop-blur-xl rounded-2xl p-9 shadow-card flex flex-col items-center text-center border-4 border-gold ring-2 ring-gold/50 shadow-gold/60 pricing-glass-card hover:shadow-gold/50 hover:-translate-y-2 transition-all duration-200">
        <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold/90 text-charcoal font-bold text-xs rounded-full px-4 py-1 shadow-lg uppercase tracking-wide z-10">Pro</div>
        <div class="text-3xl mb-2">💼</div>
        <div class="text-lg mb-1 text-gold font-bold">Premium Pod Access</div>
        <div class="text-3xl font-bold mb-3">Coming Soon</div>
        <ul class="mb-5 text-offwhite text-sm font-inter list-disc list-inside text-left mx-auto space-y-1 max-w-xs">
          <li>Mentorship & review sessions</li>
          <li>Access to premium tasks & rewards</li>
          <li>Pod alum badge & profile boost</li>
        </ul>
        <button class="px-5 py-3 rounded-full border-2 border-gold text-gold font-semibold bg-transparent cursor-not-allowed">Upgrade (Future)</button>
      </div>
      <div class="bg-charcoal/60 backdrop-blur-lg rounded-2xl p-9 shadow-card flex flex-col items-center text-center border-2 border-gold/0 pricing-glass-card hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200">
        <div class="text-3xl mb-2">🤝</div>
        <div class="text-lg mb-1 text-gold font-bold">Partner / Contributor</div>
        <div class="text-3xl font-bold mb-3">Sponsor</div>
        <ul class="mb-5 text-offwhite text-sm font-inter list-disc list-inside text-left mx-auto space-y-1 max-w-xs">
          <li>Collaborate or sponsor a pod</li>
          <li>Custom talent solutions</li>
          <li>DAO voting & recognition</li>
        </ul>
        <a href="mailto:hello@owlphadao.xyz" class="px-5 py-3 rounded-full border-2 border-gold text-gold font-semibold bg-transparent hover:bg-gold hover:text-charcoal transition">Contact Team</a>
      </div>
    </div>
    <style>
      .pricing-glass-card { transition-property: box-shadow, transform, border-color; }
    </style>
  `;
  return section;
}
