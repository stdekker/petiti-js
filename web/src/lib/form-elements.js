import { html, Component } from './vendor.js';

export const FormInput = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  error, 
  success, 
  touched, 
  onInput, 
  onBlur, 
  required = false,
  placeholder = '',
  autocomplete = 'off'
}) => html`
  <div class="form-group">
    <label for=${name}>${label}${required ? ' *' : ''}</label>
    <input
      type=${type}
      id=${name}
      name=${name}
      value=${value}
      onInput=${onInput}
      onBlur=${onBlur}
      required=${required}
      placeholder=${placeholder}
      autocomplete=${autocomplete}
      class=${touched ? (error ? 'error' : '') : ''}
    />
    ${touched && error ? html`<div class="error-message">${error}</div>` : ''}
  </div>
`;

export const FormCheckbox = ({
  label,
  name,
  checked,
  error,
  success,
  touched,
  onChange,
  onBlur,
  required = false
}) => html`
  <div class="form-group checkbox-group">
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        id=${name}
        name=${name}
        checked=${checked}
        onChange=${onChange}
        onBlur=${onBlur}
        required=${required}
        class=${touched ? (error ? 'error' : '') : ''}
      />
      <label for=${name}>
        ${label}${required ? ' *' : ''}
      </label>
    </div>
    ${touched && error ? html`<div class="error-message">${error}</div>` : ''}
  </div>
`;

export const FormSubmitButton = ({ 
  text, 
  disabled = false,
  loading = false
}) => html`
  <button 
    type="submit" 
    class="submit-button" 
    disabled=${disabled || loading}
  >
    ${loading ? 'Versturen...' : text}
  </button>
`;

export const FormError = ({ message }) => html`
  <div class="error-message submit-error">
    ${message}
  </div>
`;

export const FormSuccess = ({ message }) => html`
  <div class="form-success">
    <p>${message}</p>
  </div>
`;

export class ShareSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareId: props.shareId || null,
      showCopyMessage: false
    };
  }

  render() {
    const { shareId, showCopyMessage } = this.state;
    if (!shareId) return null;

    const basePath = document.querySelector('base')?.getAttribute('href') || '/';
    const shareUrl = `${window.location.origin}${basePath}share/${shareId}`;
    return html`
      <div class="share-section">
        <h3>Deel deze petitie</h3>
        <p>Help ons door deze petitie te delen met anderen:</p>
        <div class="share-url">
          <input 
            type="text" 
            value=${shareUrl} 
            readonly 
            onClick=${e => e.target.select()}
          />
          <button 
            onClick=${() => {
              navigator.clipboard.writeText(shareUrl);
              this.setState({ showCopyMessage: true });
              setTimeout(() => this.setState({ showCopyMessage: false }), 2000);
            }}
          >
            Kopieer
          </button>
        </div>
        ${showCopyMessage ? html`<div class="success-message">✓ Link gekopieerd!</div>` : ''}
      </div>
    `;
  }
} 