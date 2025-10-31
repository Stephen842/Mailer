export function renderCTAFooter() {
  const footer = document.createElement('footer');
  footer.className = 'relative w-full bg-charcoal py-14 px-4 flex flex-col items-center mt-10 overflow-hidden';
  footer.innerHTML = `
    <!-- Gold top glow line -->
    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold/40 via-gold to-transparent blur-sm opacity-90"></div>
    <h2 class="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gold text-center">Ready to Start Your Future of Work Journey?</h2>
    <a href="#join" class="relative font-poppins font-bold px-9 py-4 rounded-full shadow-lg bg-gradient-to-br from-gold via-yellow-200 to-gold text-charcoal text-lg hover:scale-105 hover:shadow-[0_0_32px_6px_rgba(246,201,96,0.21)] focus:outline-none focus:ring-2 ring-gold/60 transition mb-6 mt-3">Join the Waitlist</a>
    <div class="flex gap-7 items-center mb-6 mt-2">
      <a href="#" aria-label="Discord" class="hover:scale-110 transition"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><circle cx="12" cy="12" r="10" stroke="#f6c960"/><path d="M8.5 10.7a1 1 0 012 0m3 0a1 1 0 012 0" stroke="#1a1a1a"/><path d="M8 15s1.5 2 4 2 4-2 4-2" stroke="#1a1a1a" stroke-linecap="round"/></svg></a>
      <a href="#" aria-label="Telegram" class="hover:scale-110 transition"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><circle cx="12" cy="12" r="10" stroke="#f6c960"/><path d="M8 14l8-3-7 6v-4l7-6-8 3" stroke="#1a1a1a"/></svg></a>
      <a href="#" aria-label="Twitter" class="hover:scale-110 transition"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.7"><circle cx="12" cy="12" r="10" stroke="#f6c960"/><path d="M8 14c2-1 4-4 6-1.5S18 8 18 8s-2 3-5 2-5-3.5-5-3.5" stroke="#1a1a1a"/></svg></a>
    </div>
    <img src="https://svgshare.com/i/12nm.svg" alt="OwlphaDAO Logo" class="h-10 w-auto mb-2" />
    <div class="text-xs text-offwhite text-center opacity-70">© 2025 OwlphaDAO — Building the Future of Work, together.</div>
  `;
  return footer;
}
