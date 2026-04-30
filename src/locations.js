import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import createGlobe from 'cobe';

gsap.registerPlugin(ScrollTrigger);

const LOCATIONS = [
  { id: 'austin', name: 'Austin', region: 'Texas', address: '2611 Howard Lane', city: 'Austin', state: 'TX', zip: '', lat: 30.2672, lng: -97.7431 },
  { id: 'san-antonio', name: 'San Antonio', region: 'Texas', address: '11625 Rainbow Ridge', city: 'Helotes', state: 'TX', zip: '78023', lat: 29.578, lng: -98.6898 },
  { id: 'houston', name: 'Houston', region: 'Texas', address: '2033 Bingle Road', city: 'Houston', state: 'TX', zip: '77055', lat: 29.7604, lng: -95.3698 },
  { id: 'dfw', name: 'Dallas/Fort Worth', region: 'Texas', address: '2411 River Hill Road', city: 'Irving', state: 'TX', zip: '75061', lat: 32.814, lng: -96.9489 },
  { id: 'hq', name: 'Corporate Headquarters', region: 'Headquarters', address: '8001 Jetstar Dr', city: 'Irving', state: 'TX', zip: '75063', lat: 32.92, lng: -96.95, pinOffsetX: 12, pinOffsetY: -12 },
  { id: 'nashville', name: 'Nashville', region: 'Southeast', address: '207 Riverhills Dr., Suite 104', city: 'Nashville', state: 'TN', zip: '37210', lat: 36.1627, lng: -86.7816 },
  { id: 'atlanta', name: 'Atlanta', region: 'Southeast', address: '1030 Union Center', city: 'Alpharetta', state: 'GA', zip: '30004', lat: 34.0754, lng: -84.2941 },
  { id: 'tampa', name: 'Tampa', region: 'Southeast', address: '11851 North US Hwy 301', city: 'Thonotosassa', state: 'FL', zip: '33592', lat: 28.0614, lng: -82.3023 },
  { id: 'greenville', name: 'Greenville', region: 'Carolinas', address: '109 Fortis Dr', city: 'Duncan', state: 'SC', zip: '29334', lat: 34.9379, lng: -82.1457 },
  { id: 'charlotte', name: 'Charlotte', region: 'Carolinas', address: '3716 Centre Circle Drive', city: 'Fort Mill', state: 'SC', zip: '29715', lat: 35.0074, lng: -80.9451 },
  { id: 'charleston', name: 'Charleston', region: 'Carolinas', address: '5471 Woodbine Ave', city: 'North Charleston', state: 'SC', zip: '29406', lat: 32.8546, lng: -79.9748 },
  { id: 'myrtle-beach', name: 'Myrtle Beach', region: 'Carolinas', address: '2891 Mercedes Dr', city: 'Conway', state: 'SC', zip: '29526', lat: 33.836, lng: -79.0478 },
  { id: 'raleigh', name: 'Raleigh', region: 'Carolinas', address: '1120 Burma Drive', city: 'Apex', state: 'NC', zip: '27539', lat: 35.7327, lng: -78.8503 },
  { id: 'washington-dc', name: 'Washington, D.C.', region: 'Mid-Atlantic', address: '11011 Nokesville Road', city: 'Manassas', state: 'VA', zip: '20110', lat: 38.7509, lng: -77.4753 },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Texas', label: 'Texas' },
  { key: 'Southeast', label: 'Southeast' },
  { key: 'Carolinas', label: 'Carolinas' },
  { key: 'Mid-Atlantic', label: 'Mid-Atlantic' },
  { key: 'Headquarters', label: 'HQ' },
];

const locationById = new Map(LOCATIONS.map((location) => [location.id, location]));

function directionsUrl(location) {
  const query = `${location.address} ${location.city} ${location.state} ${location.zip}`.replace(/\s+/g, ' ').trim();
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

function cityLine(location) {
  return [location.city, location.state, location.zip].filter(Boolean).join(' ');
}

function buildLocationFilters() {
  const filterRoot = document.getElementById('locationFilters');
  if (!filterRoot) return;

  filterRoot.innerHTML = FILTERS.map((filter, index) => `
    <button
      class="locations-filter${index === 0 ? ' is-active' : ''}"
      type="button"
      data-location-filter="${filter.key}"
    >
      ${filter.label}
    </button>
  `).join('');
}

function buildLocationPins() {
  const pinRoot = document.getElementById('locationPins');
  if (!pinRoot) return;

  pinRoot.innerHTML = LOCATIONS.map((location) => {
    return `
    <button
      class="locations-pin${location.region === 'Headquarters' ? ' locations-pin--hq' : ''}"
      type="button"
      style="--pin-x: 50%; --pin-y: 50%; --pin-opacity: 0; --pin-offset-x: ${location.pinOffsetX || 0}px; --pin-offset-y: ${location.pinOffsetY || 0}px;"
      data-location-id="${location.id}"
      data-region="${location.region}"
      aria-label="${location.name}"
    >
      <span>${location.name}</span>
    </button>
  `;
  }).join('');
}

function buildLocationCards() {
  const listRoot = document.getElementById('locationsList');
  if (!listRoot) return;

  listRoot.innerHTML = LOCATIONS.map((location) => `
    <article class="location-card" data-location-id="${location.id}" data-region="${location.region}">
      <div class="location-card__top">
        <span class="location-card__region">${location.region}</span>
      </div>
      <h3>${location.name}</h3>
      <p>${location.address}<br>${cityLine(location)}</p>
      <div class="location-card__meta">
        <span>Mon-Fri</span>
        <strong>9:00 AM - 5:00 PM</strong>
      </div>
      <a href="${directionsUrl(location)}" target="_blank" rel="noopener">
        Directions
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 12h13l-5-5 1.4-1.4L21 12l-6.6 6.4L13 17l5-5H5z"/></svg>
      </a>
    </article>
  `).join('');
}

function setActiveLocation(id) {
  document.querySelectorAll('[data-location-id]').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.locationId === id);
  });
}

let setGlobeFilter = () => {};

function locationPoint(location) {
  return [location.lat, location.lng];
}

function visibleLocations(filter) {
  if (filter === 'all') return LOCATIONS;
  return LOCATIONS.filter((location) => location.region === filter);
}

function createLocationGlobe() {
  const canvas = document.getElementById('locationsGlobe');
  if (!canvas) return;

  const pinRoot = document.getElementById('locationPins');
  const pins = () => [...document.querySelectorAll('.locations-pin')];
  let activeFilter = 'all';
  let globe = null;
  let animationFrame = 0;
  let phi = -1.05;
  let phiOffset = 0;
  let thetaOffset = 0;
  let dragOffset = { phi: 0, theta: 0 };
  let pointerStart = null;
  let paused = false;
  let globeReady = false;

  function globeVector(location) {
    const lat = location.lat * Math.PI / 180;
    const lng = location.lng * Math.PI / 180 - Math.PI;
    const cosLat = Math.cos(lat);

    return [
      -cosLat * Math.cos(lng),
      Math.sin(lat),
      cosLat * Math.sin(lng),
    ];
  }

  function projectPin(location, rotationPhi, rotationTheta) {
    const radius = 0.822;
    const scale = 1.04;
    const aspect = pinRoot ? pinRoot.offsetWidth / Math.max(1, pinRoot.offsetHeight) : 1;
    const [baseX, baseY, baseZ] = globeVector(location);
    const x = baseX * radius;
    const y = baseY * radius;
    const z = baseZ * radius;

    const cosTheta = Math.cos(rotationTheta);
    const sinTheta = Math.sin(rotationTheta);
    const cosPhi = Math.cos(rotationPhi);
    const sinPhi = Math.sin(rotationPhi);

    const projectedX = cosPhi * x + sinPhi * z;
    const projectedY = sinPhi * sinTheta * x + cosTheta * y - cosPhi * sinTheta * z;
    const depth = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z;
    const screenX = ((projectedX / aspect) * scale + 1) / 2;
    const screenY = (-projectedY * scale + 1) / 2;
    const visible = depth >= -0.02 && screenX > 0.04 && screenX < 0.96 && screenY > 0.04 && screenY < 0.96;

    return { x: screenX, y: screenY, visible };
  }

  function updatePinPositions(rotationPhi, rotationTheta) {
    pins().forEach((pin) => {
      const location = locationById.get(pin.dataset.locationId);
      if (!location) return;

      const projected = projectPin(location, rotationPhi, rotationTheta);
      pin.style.setProperty('--pin-x', `${(projected.x * 100).toFixed(3)}%`);
      pin.style.setProperty('--pin-y', `${(projected.y * 100).toFixed(3)}%`);
      pin.style.setProperty('--pin-opacity', projected.visible && !pin.classList.contains('is-filtered-out') ? '1' : '0');
      pin.style.pointerEvents = projected.visible && !pin.classList.contains('is-filtered-out') ? 'auto' : 'none';
    });
  }

  function markerLocations() {
    return visibleLocations(activeFilter).map((location) => ({
      location: locationPoint(location),
      size: location.region === 'Headquarters' ? 0.026 : 0.018,
      color: location.region === 'Headquarters' ? [0.96, 0.74, 0.09] : [0.53, 0.77, 0.64],
    }));
  }

  function destroyGlobe() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    if (globe) globe.destroy();
    globe = null;
    animationFrame = 0;
  }

  function animateGlobe() {
    if (!globe) return;
    if (!paused) phi += 0.00135;
    const rotationPhi = phi + phiOffset + dragOffset.phi;
    const rotationTheta = 0.35 + thetaOffset + dragOffset.theta;

    globe.update({
      phi: rotationPhi,
      theta: rotationTheta,
    });
    updatePinPositions(rotationPhi, rotationTheta);

    animationFrame = requestAnimationFrame(animateGlobe);
  }

  function buildGlobe() {
    const width = canvas.offsetWidth;
    if (!width) return;

    if (globe) {
      globe.update({
        width,
        height: width,
        markers: markerLocations(),
        arcs: [],
      });
      updatePinPositions(phi + phiOffset + dragOffset.phi, 0.35 + thetaOffset + dragOffset.theta);
      return;
    }

    canvas.classList.remove('is-ready');

    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: phi + phiOffset,
      theta: 0.35 + thetaOffset,
      dark: 1,
      diffuse: 1.35,
      mapSamples: 22000,
      mapBrightness: 5.8,
      mapBaseBrightness: 0.1,
      baseColor: [0.34, 0.58, 0.44],
      markerColor: [0.53, 0.77, 0.64],
      glowColor: [0.02, 0.09, 0.06],
      markers: markerLocations(),
      arcs: [],
      arcColor: [0.53, 0.77, 0.64],
      arcWidth: 0.3,
      arcHeight: 0.12,
      markerElevation: 0.02,
      opacity: 0.9,
      scale: 1.04,
    });

    updatePinPositions(phi + phiOffset, 0.35 + thetaOffset);
    animationFrame = requestAnimationFrame(animateGlobe);
    if (!globeReady) {
      globeReady = true;
      requestAnimationFrame(() => canvas.classList.add('is-ready'));
    }
  }

  function handlePointerDown(event) {
    pointerStart = { x: event.clientX, y: event.clientY };
    paused = true;
    canvas.style.cursor = 'grabbing';
  }

  function handlePointerMove(event) {
    if (!pointerStart) return;
    dragOffset = {
      phi: (event.clientX - pointerStart.x) / 260,
      theta: (event.clientY - pointerStart.y) / 900,
    };
  }

  function handlePointerUp() {
    if (pointerStart) {
      phiOffset += dragOffset.phi;
      thetaOffset += dragOffset.theta;
      dragOffset = { phi: 0, theta: 0 };
    }

    pointerStart = null;
    paused = false;
    canvas.style.cursor = 'grab';
  }

  const observer = new ResizeObserver(() => buildGlobe());
  observer.observe(canvas);

  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });

  setGlobeFilter = (filter) => {
    activeFilter = filter;
    buildGlobe();
  };

  buildGlobe();
}

function filterLocations(filter) {
  const showAll = filter === 'all';
  document.querySelectorAll('.location-card, .locations-pin').forEach((el) => {
    const visible = showAll || el.dataset.region === filter;
    el.classList.toggle('is-filtered-out', !visible);
  });
  setGlobeFilter(filter);

  gsap.fromTo(
    '.location-card:not(.is-filtered-out)',
    { y: 16, opacity: 0.35 },
    { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.035 }
  );
}

function bindLocations() {
  const filters = document.querySelectorAll('[data-location-filter]');
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filters.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      filterLocations(button.dataset.locationFilter);
    });
  });

  document.querySelectorAll('.location-card').forEach((card) => {
    card.addEventListener('mouseenter', () => setActiveLocation(card.dataset.locationId));
    card.addEventListener('focusin', () => setActiveLocation(card.dataset.locationId));
    card.addEventListener('mouseleave', () => setActiveLocation(''));
  });

  document.querySelectorAll('.locations-pin').forEach((pin) => {
    pin.addEventListener('click', () => {
      const card = document.querySelector(`.location-card[data-location-id="${pin.dataset.locationId}"]`);
      setActiveLocation(pin.dataset.locationId);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function animateLocations() {
  gsap.from('.locations-map', {
    y: 28,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.locations-map',
      start: 'top 78%',
      once: true,
    },
  });

  gsap.from('.location-card', {
    y: 38,
    opacity: 0,
    scale: 0.98,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.055,
    scrollTrigger: {
      trigger: '.locations-list',
      start: 'top 82%',
      once: true,
    },
  });
}

function bootLocations() {
  if (!document.body.classList.contains('locations-page')) return;
  buildLocationFilters();
  buildLocationPins();
  buildLocationCards();
  createLocationGlobe();
  bindLocations();
  animateLocations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootLocations);
} else {
  bootLocations();
}
