// main.js
import { renderHero } from './components/hero.js';
import { renderVision } from './components/vision.js';
import { renderGrowthLoop } from './components/growth-loop.js';
import { renderPods } from './components/pods.js';
import { renderPlans } from './components/plans.js';
import { renderCommunity } from './components/community.js';
import { renderTestimonials } from './components/testimonials.js';
import { renderCTAFooter } from './components/cta-footer.js';

const app = document.getElementById('app');

app.append(
  renderHero(),
  renderVision(),
  renderGrowthLoop(),
  renderPods(),
  renderPlans(),
  renderCommunity(),
  renderTestimonials(),
  renderCTAFooter()
);
