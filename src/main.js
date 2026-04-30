import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------
   Partner roster (mirrors Lanehart's "We work with")
   ------------------------------------------------- */
const PARTNERS = [
  { name: 'Cleve Adamson Custom Homes', src: 'https://lanehart.com/wp-content/uploads/2017/12/logo-CleveAdamson-1.png' },
  { name: 'True Homes',                 src: 'https://lanehart.com/wp-content/uploads/2015/05/truehomes.png' },
  { name: 'Beazer Homes',               src: 'https://lanehart.com/wp-content/uploads/2015/05/beazer.png' },
  { name: 'Cardel Homes',               src: 'https://lanehart.com/wp-content/uploads/2015/05/cardel.png' },
  { name: 'Chesapeake Homes',           src: 'https://lanehart.com/wp-content/uploads/2015/05/chesapeake.png' },
  { name: 'Holiday Builders',           src: 'https://lanehart.com/wp-content/uploads/2015/05/holiday.png' },
  { name: 'John Wieland',               src: 'https://lanehart.com/wp-content/uploads/2015/05/johnwieland.png' },
  { name: 'K. Hovnanian Homes',         src: 'https://lanehart.com/wp-content/uploads/2015/05/khov.png' },
  { name: 'Lennar',                     src: 'https://lanehart.com/wp-content/uploads/2015/05/lennar.png' },
  { name: 'LGI Homes',                  src: 'https://lanehart.com/wp-content/uploads/2015/05/lgi.png' },
  { name: 'MHI',                        src: 'https://lanehart.com/wp-content/uploads/2015/05/mhi.png' },
  { name: 'Orleans Homes',              src: 'https://lanehart.com/wp-content/uploads/2015/05/orleans.png' },
  { name: 'Parkview Homes',             src: 'https://lanehart.com/wp-content/uploads/2015/05/parkview.png' },
  { name: 'Pulte Homes',                src: 'https://lanehart.com/wp-content/uploads/2015/05/pulte.png' },
  { name: 'Shea Homes',                 src: 'https://lanehart.com/wp-content/uploads/2015/05/shea.png' },
  { name: 'Stanley Martin',             src: 'https://lanehart.com/wp-content/uploads/2015/05/stanleymartin.png' },
  { name: 'Taylor Morrison',            src: 'https://lanehart.com/wp-content/uploads/2015/05/taylormorrison.png' },
  { name: 'D.R. Horton',                src: 'https://lanehart.com/wp-content/uploads/2015/05/DRHorton.png' },
  { name: 'David Weekley Homes',        src: 'https://lanehart.com/wp-content/uploads/2015/05/DavidWeekleyHomes.png' },
  { name: 'CalAtlantic Homes',          src: 'https://lanehart.com/wp-content/uploads/2015/05/CalAtlantic.png' },
  { name: 'M/I Homes',                  src: 'https://lanehart.com/wp-content/uploads/2015/05/MIHomes.png' },
  { name: 'KB Home',                    src: 'https://lanehart.com/wp-content/uploads/2019/11/KBHome-2019-1.png' },
];

/* -------------------------------------------------
   Build partner DOM
   ------------------------------------------------- */
function buildPartners() {
  const grid = document.getElementById('partnersGrid');
  if (!grid) return;

  PARTNERS.forEach((p, i) => {
    const cell = document.createElement('div');
    cell.className = 'partner-cell';
    const num = String(i + 1).padStart(2, '0');
    cell.innerHTML = `
      <img src="${p.src}" alt="${p.name}" loading="lazy" decoding="async" />
      <img class="partner-cell__hover-img" src="${p.src}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <span class="partner-cell__num">${num}</span>
      <span class="partner-cell__name">${p.name}</span>
    `;
    grid.appendChild(cell);
  });

  // Filler cells — 22 logos don't divide evenly into a 4/6 column grid.
  // Two editorial filler cells round it to 24, keeping every breakpoint clean.
  const fillers = [
    {
      classes: 'partner-cell partner-cell--filler partner-cell--filler-stat',
      html: `
        <span class="partner-cell__filler-num">22+</span>
        <span class="partner-cell__filler-text">National builder partners</span>
      `,
    },
    {
      classes: 'partner-cell partner-cell--filler partner-cell--filler-cta',
      html: `
        <span class="partner-cell__filler-eyebrow">Become #23</span>
        <span class="partner-cell__filler-text">Build with Lanehart</span>
        <svg class="partner-cell__filler-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M5 12h13l-5-5 1.4-1.4L21 12l-6.6 6.4L13 17l5-5H5z"/>
        </svg>
      `,
    },
  ];
  fillers.forEach((f) => {
    const cell = document.createElement('div');
    cell.className = f.classes;
    cell.innerHTML = f.html;
    grid.appendChild(cell);
  });
}


/* -------------------------------------------------
   Lenis smooth scroll wired to GSAP/ScrollTrigger
   ------------------------------------------------- */
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.4,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navEl = document.getElementById('nav');
      const navOffset = navEl ? navEl.getBoundingClientRect().height : 96;
      lenis.scrollTo(target, { offset: -navOffset - 8, duration: 1.4 });
    });
  });

  return lenis;
}

/* -------------------------------------------------
   Hero entrance — logo + supporting copy
   ------------------------------------------------- */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.from('.hero__logo', { y: 30, opacity: 0, scale: 0.96, duration: 1.15 }, 0.2)
    .from('.hero__sub',  { y: 18, opacity: 0, duration: 0.85 }, 0.55)
    .from('.hero__phone',{ y: 16, opacity: 0, duration: 0.75 }, 0.75);

  // gentle slow zoom on the blurred video for a touch of motion
  gsap.to('.hero__video', {
    scale: 1.18,
    duration: 18,
    ease: 'none',
    yoyo: true,
    repeat: -1,
  });
}

/* -------------------------------------------------
   Generic scroll-reveals
   ------------------------------------------------- */
function animateReveals() {
  // Word/line splits for headlines
  document.querySelectorAll('[data-split="words"]').forEach((el) => {
    const split = new SplitType(el, { types: 'words', tagName: 'span' });
    split.words.forEach((w) => {
      const html = w.innerHTML;
      w.innerHTML = `<span class="word-inner" style="display:inline-block;will-change:transform">${html}</span>`;
      w.style.display = 'inline-block';
      w.style.overflow = 'hidden';
    });

    gsap.from(el.querySelectorAll('.word-inner'), {
      yPercent: 110,
      opacity: 0,
      duration: 0.95,
      ease: 'expo.out',
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });

  // Green highlight blocks — wipe the green pulled-quote in from the left
  // as the paragraph enters view, like a marker stroke across the column.
  document.querySelectorAll('[data-highlight]').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      }
    );
  });

  // About-body words keep the scroll opacity reveal, with a softer bounce into place.
  document.querySelectorAll('[data-fade-words]').forEach((el) => {
    const split = new SplitType(el, { types: 'words', tagName: 'span' });
    if (!split.words || !split.words.length) return;

    split.words.forEach((word) => {
      word.style.display = 'inline-block';
      word.style.transformOrigin = '50% 100%';
      word.style.willChange = 'transform, opacity';
    });

    gsap.fromTo(
      split.words,
      { opacity: 0.16, y: 24, scale: 0.93, rotateX: -16 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        ease: 'back.out(1.8)',
        stagger: 0.035,
        scrollTrigger: {
          trigger: el,
          start: 'top 84%',
          end: 'bottom 58%',
          scrub: 0.55,
        },
      }
    );
  });

  // Generic [data-reveal]
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Section heads
  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.from(el.children, {
      y: 16, opacity: 0, duration: 0.7, stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });
}

/* -------------------------------------------------
   Stat counters
   ------------------------------------------------- */
function animateStats() {
  document.querySelectorAll('[data-count-to]').forEach((el) => {
    const to = parseFloat(el.dataset.countTo || '0');
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate() {
        el.textContent = Math.round(obj.v).toString();
      },
    });
  });
}

/* -------------------------------------------------
   Services — Bento card reveal on enter
   ------------------------------------------------- */
function animateServices() {
  const cards = gsap.utils.toArray('[data-bento-card]');
  if (!cards.length) return;
  gsap.set(cards, { y: 40, opacity: 0, scale: 0.97 });
  ScrollTrigger.create({
    trigger: '[data-bento]',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cards, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
      });
    },
  });
}

/* -------------------------------------------------
   Partner reveal — staggered 3D-ish entrance
   ------------------------------------------------- */
function animatePartners() {
  const cells = gsap.utils.toArray('.partner-cell');
  if (!cells.length) return;

  // Initial state
  gsap.set(cells, { opacity: 0, y: 60, scale: 0.92, rotateX: 12, transformOrigin: '50% 50%' });

  ScrollTrigger.create({
    trigger: '#partnersGrid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cells, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: { each: 0.05, from: 'random' },
      });
    },
  });

  // Subtle scrub: pull the grid up slightly as the section scrolls
  gsap.to('#partnersGrid', {
    yPercent: -3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.partners',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* -------------------------------------------------
   Nav: scroll-state + mobile drawer
   ------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 80) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!burger || !drawer) return;
  const close = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  };
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* -------------------------------------------------
   Footer dynamic year
   ------------------------------------------------- */
function setYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* -------------------------------------------------
   Boot
   ------------------------------------------------- */
function boot() {
  document.documentElement.classList.add('lenis');
  setYear();
  buildPartners();

  initSmoothScroll();
  initNav();
  animateHero();
  animateReveals();
  animateStats();
  animateServices();
  animatePartners();

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
