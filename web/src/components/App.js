import { Component, html } from '../lib/vendor.js';
import { Header } from './Header.js';
import { Footer } from './Footer.js';

export class App extends Component {
  render() {
    return html`
      <div class="app-container">
        <${Header} />
        <main class="app-content">
          ${this.props.children}
        </main>
        <${Footer} />
      </div>
    `;
  }
} 