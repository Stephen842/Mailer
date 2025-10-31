export function renderCommunity() {
  const section = document.createElement('section');
  section.className = 'bg-accentgray py-20 px-4 relative overflow-hidden community-enhanced';
  section.id = 'community';
  section.innerHTML = `
    <!-- Animated shimmer background overlay -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="w-full h-full bg-gradient-to-tr from-gold/10 via-accentgray via-60% to-gold/20 animate-gradientShimmer"></div>
    </div>
    <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center community-fadein">
      <h3 class="text-2xl md:text-3xl font-poppins font-bold text-gold text-center mb-6">Powered by OwlphaDAO</h3>
      <div class="text-offwhite text-center font-inter mb-7">
        Our community is based on collaboration, ownership, and new opportunity.<br>
        Connect with us — join our mission.
      </div>
      <div class="flex flex-col sm:flex-row gap-6 items-center justify-center mb-7">
        <a href="#" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-charcoal font-bold shadow hover:shadow-gold/40 hover:scale-105 transition">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M16.81 19.37S16.26 18.69 15.79 18.07C17.2398 17.62 18.5 16.69 18.5 16.69C18.5 9.69 15.27 5.87 15.27 5.87C13.82 5.04 12.53 4.5 12.53 4.5C12.51 4.58 12.5 4.65 12.5 4.65L12 4.48L11.48 4.65C11.48 4.65 11.47 4.58 11.45 4.5C11.45 4.5 10.16 5.04 8.70999 5.87C8.70999 5.87 5.47999 9.69 5.47999 16.69C5.47999 16.69 6.73999 17.62 8.18999 18.07C7.73999 18.69 7.18999 19.37 7.18999 19.37C5.61999 18.69 4.48999 17.36 4.09999 17.03C3.52999 18.17 3.20999 19.45 3.20999 19.45C5.61999 21.2 8.68999 21.33 11.93 21.33C15.17 21.33 18.24 21.2 20.65 19.45C20.65 19.45 20.33 18.17 19.76 17.03C19.37 17.36 18.24 18.69 16.81 19.37Z" fill="#282828"/></svg>Discord
        </a>
        <a href="#" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border-2 border-gold text-gold font-bold hover:bg-gold/10 hover:text-offwhite transition">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 3L3 10.53L8.23 12.16L17.64 7.14L10.11 13.04L10.11 13.04L10.11 13.04L10.11 13.04L10 20L13.29 15.54C13.56 15.8177 13.9056 15.9728 14.27 15.98C14.56 15.98 14.82 15.92 14.99 15.85C15.26 15.75 19.05 13.62 19.05 13.62C19.5292 13.2769 19.9243 12.8777 20.19 12.45C20.86 11.33 21 3 21 3Z" fill="#f6c960"/></svg>Telegram
        </a>
      </div>
      <div class="flex gap-3 mb-4 items-center justify-center community-avatars">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" class="w-12 h-12 rounded-full border-gold border-2 shadow-md hover:shadow-gold/40 hover:scale-105 transition"/>
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" class="w-12 h-12 rounded-full border-gold border-2 shadow-md hover:shadow-gold/40 hover:scale-105 transition"/>
        <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="avatar" class="w-12 h-12 rounded-full border-gold border-2 shadow-md hover:shadow-gold/40 hover:scale-105 transition"/>
      </div>
    </div>
    <style>
      @keyframes gradientShimmer {0%{background-position:0% 50%;}100%{background-position:100% 50%;}}
      .animate-gradientShimmer {background-size:200% 200%;animation:gradientShimmer 16s linear infinite;}
      .community-fadein {opacity:0;transform:translateY(36px);animation:fadeUp 1.1s .18s cubic-bezier(.6,.2,.2,1) forwards;}
      @keyframes fadeUp {to{opacity:1;transform:none;}}
    </style>
  `;
  return section;
}
