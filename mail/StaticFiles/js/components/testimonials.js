export function renderTestimonials() {
  const section = document.createElement('section');
  section.className = 'bg-charcoal py-20 px-4';
  section.id = 'testimonials';
  section.innerHTML = `
    <h3 class="text-2xl md:text-3xl font-poppins font-bold text-gold mb-10 text-center">Learner Stories</h3>
    <div class="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto justify-center items-stretch">
      <div class="bg-accentgray/70 backdrop-blur-lg rounded-2xl p-7 shadow-card border border-gold/10 flex-1 flex flex-col items-center text-center testimonial-card animate-fadeInUp hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200">
        <img src='https://randomuser.me/api/portraits/women/32.jpg' alt='user' class='w-16 h-16 rounded-full mb-2 border-gold border-2 shadow-gold/20' />
        <div class="font-bold mb-1 text-offwhite">Jane D.</div>
        <div class="text-accentgray text-sm mb-2">Future of Work Learner</div>
        <blockquote class="italic text-offwhite">“I joined to learn storytelling — now I earn from it.”</blockquote>
      </div>
      <div class="bg-accentgray/70 backdrop-blur-lg rounded-2xl p-7 shadow-card border border-gold/10 flex-1 flex flex-col items-center text-center testimonial-card animate-fadeInUp delay-150 hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200">
        <img src='https://randomuser.me/api/portraits/men/34.jpg' alt='user' class='w-16 h-16 rounded-full mb-2 border-gold border-2 shadow-gold/20' />
        <div class="font-bold mb-1 text-offwhite">Amit S.</div>
        <div class="text-accentgray text-sm mb-2">Future of Work Learner</div>
        <blockquote class="italic text-offwhite">“The pods helped me connect with people who think like me.”</blockquote>
      </div>
      <div class="bg-accentgray/70 backdrop-blur-lg rounded-2xl p-7 shadow-card border border-gold/10 flex-1 flex flex-col items-center text-center testimonial-card animate-fadeInUp delay-300 hover:shadow-gold/40 hover:-translate-y-2 transition-all duration-200">
        <img src='https://randomuser.me/api/portraits/men/22.jpg' alt='user' class='w-16 h-16 rounded-full mb-2 border-gold border-2 shadow-gold/20' />
        <div class="font-bold mb-1 text-offwhite">Leo M.</div>
        <div class="text-accentgray text-sm mb-2">Future of Work Learner</div>
        <blockquote class="italic text-offwhite">“Here I found mentors, friends, and real career opportunities.”</blockquote>
      </div>
    </div>
    <style>
      .testimonial-card { transition-property: box-shadow, transform; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none;} }
      .animate-fadeInUp { animation: fadeInUp 0.9s cubic-bezier(.6,.2,.1,1) both; }
      .delay-150 { animation-delay: .15s; }
      .delay-300 { animation-delay: .3s; }
    </style>
  `;
  return section;
}
