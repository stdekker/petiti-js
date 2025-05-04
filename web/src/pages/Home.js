import { Component, html } from '../lib/vendor.js';
import { Counter } from '../components/Counter.js';
import { ContactForm } from '../components/ContactForm.js';

export class HomePage extends Component {
  static path = "/";

  constructor(props) {
    super(props);
    this.state = {
      shareId: props.shareId || null
    };
  }

  render() {
    return html`
      <div class="page home-page">
        <h1>Petitie</h1>
        <p>Teken onze petitie en help ons om deze <a href="/about" data-navigo>belangrijke zaken</a> te regelen.</p>      
        <${Counter} />
        <${ContactForm} enableSharing=${true} sourceShareId=${this.state.shareId} />
      </div>
    `;
  }
} 