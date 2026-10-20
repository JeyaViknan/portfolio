import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Smoothed wheel scrolling, tuned to feel weighted without lagging behind the hand:
// each notch travels a little less than native, and the page settles quickly.
// Touch keeps the device's own scrolling, and reduced motion keeps native scrolling.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    lerp: 0.11,
    wheelMultiplier: 0.85,
    smoothWheel: true,
    syncTouch: false,
    anchors: { offset: -72 },
    autoRaf: true,
  });
  window.__lenis = lenis;

  // Arriving with a hash (e.g. /#work from a case study): Lenis takes over scrolling
  // during load and the browser's own jump gets lost, so make the jump explicitly.
  // Once now, and again after images and fonts have settled the layout.
  const target = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  if (target) {
    const jump = () => lenis.scrollTo(target, { offset: -72, immediate: true, force: true });
    jump();
    if (document.readyState !== 'complete') addEventListener('load', jump, { once: true });
  }

  // Back and forward between sections change only the hash; glide to it.
  addEventListener('hashchange', () => {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) lenis.scrollTo(el, { offset: -72 });
  });
}
