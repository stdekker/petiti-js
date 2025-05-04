import { Component, html } from '../lib/vendor.js';

export class NotFoundPage extends Component {
  render() {
    return html`
      <div class="page not-found-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <img 
          src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" 
          alt="Confused Spongebob"
          style="max-width: 100%; margin: 2rem 0;"
        />
        <p>In the vast digital cosmos, pages come and go like fleeting thoughts. What does it mean for a page to exist? Is it the URL that defines its being, or the content that gives it meaning? Perhaps this missing page has transcended to a higher plane of digital existence...</p>
      </div>
    `;
  }
} 