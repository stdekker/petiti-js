import { Component, html } from '../lib/vendor.js';
import { config } from '../config.js';

export class Footer extends Component {
  render() {
    return html`
      <footer class="app-footer">
        <p>© ${new Date().getFullYear()} ${config.appName} v${config.version}</p>
        <p>Built with: <a href="https://preactjs.com" target="_blank" rel="noopener">Preact</a> • <a href="https://github.com/developit/htm" target="_blank" rel="noopener">htm</a> • <a href="https://github.com/krasimir/navigo" target="_blank" rel="noopener">Navigo</a> • <a href="https://github.com/pmndrs/zustand" target="_blank" rel="noopener">Zustand</a></p>
      </footer>
    `;
  }
} 