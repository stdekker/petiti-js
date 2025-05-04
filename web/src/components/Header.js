import { Component, html } from '../lib/vendor.js';
import { Navigation } from './Navigation.js';
import { config } from '../config.js';

export class Header extends Component {
  // No constructor or state needed for basePath here
  render() {
    return html`
      <header class="app-header">
        <div class="logo">
          <h1><a href="/" data-navigo>${config.appName}</a></h1>
        </div>
        <${Navigation} />
      </header>
    `;
  }
} 