import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __motionReady?: boolean;
    __lenis?: Lenis;
  }
}

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header gains a rule once the page has scrolled.
const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (reduce) {
  root.classList.remove('motion');
} else {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: Number(el.dataset.reveal || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Count numbers up from zero, keeping their prefix, suffix and separators.
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const text = el.textContent ?? '';
    const m = text.match(/\d[\d,]*(\.\d+)?/);
    if (!m) return;
    const target = parseFloat(m[0].replace(/,/g, ''));
    if (!target) return;
    const decimals = m[1] ? m[1].length - 1 : 0;
    const commas = m[0].includes(',');
    const fmt = (v: number) => {
      const s = v.toFixed(decimals);
      return commas ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals }) : s;
    };
    const state = { v: 0 };
    el.textContent = text.replace(m[0], fmt(0));
    gsap.to(state, {
      v: target,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => (el.textContent = text.replace(m[0], fmt(state.v))),
      onComplete: () => (el.textContent = text),
    });
  });
}

window.__motionReady = true;
