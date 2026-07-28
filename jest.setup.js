import '@testing-library/jest-dom';
import i18n from './src/i18n';

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock import.meta for Vite
global.importMeta = { env: {} };

// Components render real translations, so tests assert on English copy.
i18n.changeLanguage('en');

// jsdom implements neither matchMedia nor IntersectionObserver. Components that
// adapt to viewport or scroll position (and gsap's ScrollTrigger) expect both.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
  global.IntersectionObserver = window.IntersectionObserver;
}

// jsdom does not implement the <dialog> API. Minimal stand-in so components
// that call showModal()/close() can render and be driven in tests.
if (typeof window.HTMLDialogElement !== 'undefined') {
  const proto = window.HTMLDialogElement.prototype;

  if (!proto.showModal) {
    proto.showModal = function showModal() {
      this.open = true;
      this.setAttribute('open', '');
    };
  }

  if (!proto.show) {
    proto.show = function show() {
      this.open = true;
      this.setAttribute('open', '');
    };
  }

  if (!proto.close) {
    proto.close = function close(returnValue) {
      this.open = false;
      this.removeAttribute('open');
      if (returnValue !== undefined) this.returnValue = returnValue;
      this.dispatchEvent(new window.Event('close'));
    };
  }
}
