// Centralized imports from CDN
import { h, render, Component } from 'https://esm.sh/preact@10.26.5';
import htm from 'https://esm.sh/htm@3.1.1';
import Navigo from 'https://esm.sh/navigo@8.11.1';
import { create } from 'https://esm.sh/zustand@5.0.3';

// Initialize htm with h once
const html = htm.bind(h);

// Export everything needed by components
export {
  h,
  render,
  Component,
  html,
  Navigo,
  create
}; 