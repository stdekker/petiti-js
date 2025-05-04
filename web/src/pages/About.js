import { Component, html } from '../lib/vendor.js';
import { Counter } from '../components/Counter.js';
import { ContactForm } from '../components/ContactForm.js';

export class AboutPage extends Component {
  static path = "about";
  static aliases = ["info","henk"];

  render() {
    return html`
      <div class="page about-page">
        <h1>More about this petition</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <${Counter} />

        <h2>Our goals</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

        <div class="goals">
          <div class="goal">
            <h4>Goal 1</h4>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
          </div>
          <div class="goal">
            <h4>Goal 2</h4>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
          </div>
          <div class="goal">
            <h4>Goal 3</h4>
            <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
          </div>
        </div>
        <${ContactForm} sourceShareId=${this.state.shareId} />
      </div>
    `;
  }
} 