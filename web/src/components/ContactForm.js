import { Component, html } from '../lib/vendor.js';
import { validateField, validateForm } from '../lib/form-validation.js';
import { generateShortId } from '../lib/utils.js';
import { 
  FormInput, 
  FormCheckbox, 
  FormSubmitButton, 
  FormError, 
  FormSuccess,
  ShareSection
} from '../lib/form-elements.js';

// Storage key for form data
const FORM_STORAGE_KEY = 'contact_form_data';
const THANK_YOU_STORAGE_KEY = 'contact_form_thank_you';
const THANK_YOU_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Custom event name for counter refresh
const COUNTER_REFRESH_EVENT = 'counter-refresh';

export class ContactForm extends Component {
  constructor(props) {
    super(props);
    // Load saved form data from localStorage
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    const initialData = savedData ? JSON.parse(savedData) : {
      email: '',
      naam: '',
      telefoonnummer: '',
      postcode: '',
      privacyAgreed: false
    };

    // Check for thank you message state
    const thankYouData = localStorage.getItem(THANK_YOU_STORAGE_KEY);
    const thankYouState = thankYouData ? JSON.parse(thankYouData) : null;
    const showThankYou = thankYouState && (Date.now() - thankYouState.timestamp < THANK_YOU_DURATION);

    this.state = {
      ...initialData,
      formSubmitted: showThankYou,
      errors: {},
      touched: {},
      success: {},
      hadError: {},
      loading: false,
      fingerprint: null,
      shareId: null,
      sourceShareId: props.sourceShareId || null,
      enableSharing: props?.enableSharing ?? false
    };

    // Clear expired thank you message
    if (thankYouState && Date.now() - thankYouState.timestamp >= THANK_YOU_DURATION) {
      localStorage.removeItem(THANK_YOU_STORAGE_KEY);
    }
  }

  componentDidMount() {
    // Generate fingerprint when component mounts
    this.generateFingerprint();
    
    // Set up interval to check thank you message expiration
    this.thankYouInterval = setInterval(() => {
      const thankYouData = localStorage.getItem(THANK_YOU_STORAGE_KEY);
      if (thankYouData) {
        const thankYouState = JSON.parse(thankYouData);
        if (Date.now() - thankYouState.timestamp >= THANK_YOU_DURATION) {
          localStorage.removeItem(THANK_YOU_STORAGE_KEY);
          this.setState({ formSubmitted: false });
        }
      }
    }, 1000); // Check every second
  }

  componentWillUnmount() {
    clearInterval(this.thankYouInterval);
  }
  
  // Function to generate fingerprint
  generateFingerprint = async () => {
    try {
      // Check if FingerprintJS is loaded
      if (typeof FingerprintJS === 'undefined') {
        console.error('FingerprintJS library not loaded.');
        return;
      }
      
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      this.setState({ fingerprint: result.visitorId });
    } catch (error) {
      console.error('Error generating fingerprint:', error);
      // Optionally handle the error, e.g., set a default value or show a message
      this.setState({ fingerprint: 'error_generating_fp' });
    }
  };

  // Save form data to localStorage whenever it changes
  saveFormData = () => {
    const { email, naam, telefoonnummer, postcode, privacyAgreed } = this.state;
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      email,
      naam,
      telefoonnummer,
      postcode,
      privacyAgreed
    }));
  };

  handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    this.setState({
      [name]: newValue
    }, () => {
      this.saveFormData();
      this.checkAndScrollToSubmit();
      
      // Validate checkbox immediately when changed
      if (type === 'checkbox') {
        const validation = validateField(name, newValue);
        this.setState(prevState => ({
          touched: { ...prevState.touched, [name]: true },
          errors: {
            ...prevState.errors,
            [name]: validation.isValid ? '' : validation.message
          },
          hadError: {
            ...prevState.hadError,
            [name]: !validation.isValid || prevState.hadError[name]
          }
        }));
      }
    });
  };

  checkAndScrollToSubmit = () => {
    const { email, naam, telefoonnummer } = this.state;
    const allTextFieldsFilled = email && naam && telefoonnummer;
    
    if (allTextFieldsFilled) {
      const submitButton = document.querySelector('.contact-form button[type="submit"]');
      if (submitButton) {
        submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Clean up spaces for specific fields
    let cleanedValue = fieldValue;
    if (name === 'telefoonnummer' || name === 'postcode') {
      cleanedValue = fieldValue.replace(/\s+/g, '');
    } else if (name === 'naam') {
      cleanedValue = fieldValue.replace(/\s+/g, ' ').trim();
    }
    
    // Update the input value with cleaned version
    if (cleanedValue !== fieldValue) {
      this.setState({ [name]: cleanedValue }, this.saveFormData);
    }
    
    // Validate field on blur
    const validation = validateField(name, cleanedValue);
    
    this.setState(prevState => ({
      touched: { ...prevState.touched, [name]: true },
      errors: {
        ...prevState.errors,
        [name]: validation.isValid ? '' : validation.message
      },
      hadError: {
        ...prevState.hadError,
        [name]: !validation.isValid || prevState.hadError[name]
      }
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    const touched = {
      email: true,
      naam: true,
      telefoonnummer: true,
      postcode: true,
      privacyAgreed: true
    };
    
    // Validate all fields
    const { isValid, errors } = validateForm({
      email: this.state.email,
      naam: this.state.naam,
      telefoonnummer: this.state.telefoonnummer,
      postcode: this.state.postcode,
      privacyAgreed: this.state.privacyAgreed
    });

    this.setState({ touched });

    if (isValid) {
      this.setState({ loading: true });
      try {
        // Generate a short ID for sharing if enabled
        const shareId = this.state.enableSharing ? generateShortId() : null;
        
        const response = await fetch('api/submit.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.state.email,
            naam: this.state.naam,
            telefoonnummer: this.state.telefoonnummer,
            postcode: this.state.postcode,
            fingerprint: this.state.fingerprint,
            shareId: shareId,
            sourceShareId: this.state.sourceShareId
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit form');
        }

        // Clear form data from storage on successful submission
        localStorage.removeItem(FORM_STORAGE_KEY);
        
        // Save thank you message state
        const thankYouState = {
          timestamp: Date.now()
        };
        localStorage.setItem(THANK_YOU_STORAGE_KEY, JSON.stringify(thankYouState));
        
        this.setState({ 
          formSubmitted: true,
          shareId: shareId
        });
        
        // Dispatch event to refresh counter
        window.dispatchEvent(new CustomEvent(COUNTER_REFRESH_EVENT));
      } catch (error) {
        this.setState({
          errors: {
            ...this.state.errors,
            submit: error.message
          },
          loading: false
        });
      }
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { 
      email, 
      naam, 
      telefoonnummer,
      postcode,
      privacyAgreed, 
      formSubmitted, 
      errors, 
      touched, 
      success,
      loading,
      shareId,
      enableSharing
    } = this.state;

    if (formSubmitted) {
      return html`
        <${FormSuccess} message="Bedankt voor uw steun! We laten snel meer weten over het vervolg van de petitie." />
        ${this.state.enableSharing && html`<${ShareSection} shareId=${shareId} />`}
      `;
    }

    return html`
      <form class="contact-form" onSubmit=${this.handleSubmit}>
        ${errors.submit && html`<${FormError} message=${errors.submit} />`}
        
        <${FormInput}
          label="E-mailadres"
          type="email"
          name="email"
          value=${email}
          error=${errors.email}
          success=${success.email}
          touched=${touched.email}
          onInput=${this.handleInput}
          onBlur=${this.handleBlur}
          required=${true}
          autocomplete="email"
        />
        
        <${FormInput}
          label="Naam"
          type="text"
          name="naam"
          value=${naam}
          error=${errors.naam}
          success=${success.naam}
          touched=${touched.naam}
          onInput=${this.handleInput}
          onBlur=${this.handleBlur}
          required=${true}
          autocomplete="name"
        />
        
        <${FormInput}
          label="Telefoonnummer"
          type="tel"
          name="telefoonnummer"
          value=${telefoonnummer}
          error=${errors.telefoonnummer}
          success=${success.telefoonnummer}
          touched=${touched.telefoonnummer}
          onInput=${this.handleInput}
          onBlur=${this.handleBlur}
          required=${true}
          placeholder="0612345678"
          autocomplete="tel"
        />

        <${FormInput}
          label="Postcode"
          type="text"
          name="postcode"
          value=${postcode}
          error=${errors.postcode}
          success=${success.postcode}
          touched=${touched.postcode}
          onInput=${this.handleInput}
          onBlur=${this.handleBlur}
          required=${false}
          placeholder="1234 AB"
          autocomplete="postal-code"
        />
        
        <${FormCheckbox}
          label=${html`Ik ga akkoord met de opslag van mijn gegevens volgens de <a href="privacy" data-navigo>privacy voorwaarden</a>`}
          name="privacyAgreed"
          checked=${privacyAgreed}
          error=${errors.privacyAgreed}
          success=${success.privacyAgreed}
          touched=${touched.privacyAgreed}
          onChange=${this.handleInput}
          onBlur=${this.handleBlur}
          required=${true}
        />
        
        <${FormSubmitButton}
          text="Versturen"
          disabled=${!privacyAgreed || Object.values(errors).some(error => error)}
          loading=${loading}
        />
      </form>
    `;
  }
}