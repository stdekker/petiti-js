# Project Architecture

## Directory Structure

```
petiti-js/
├── data/                  # Data storage (outside web root for security)
│   └── submissions.json   # Form submission data
├── web/                   # Web application root
│   ├── api/              # API endpoints
│   │   ├── submit.php    # Form submission endpoint
│   │   ├── count.php     # Submission count endpoint
│   ├── src/              # Source code
│   │   ├── components/   # React/Preact components
│   │   │   ├── ContactForm.js
│   │   │   └── Counter.js
│   │   ├── pages/       # Page components
│   │   │   ├── Home.js
│   │   │   └── About.js
│   │   └── lib/         # Utility libraries
│   │       ├── vendor.js
│   │       ├── form-validation.js
│   │       ├── form-elements.js
│   │       └── utils.js
│   └── css/             # Stylesheets
        └── main.css     # First load, included by index.php
│       └── main.css     # Main stylesheet
├── LICENSE              # GPL-3.0 License
├── architecture.md      # This file
└── config.php    # API configuration
```

## Dependencies

The project uses several modern JavaScript libraries loaded via ESM (ECMAScript Modules):

- **Preact (v10.26.5)**: A fast 3kB alternative to React with the same modern API
  - Used for component-based UI development
  - Provides virtual DOM rendering and state management
  - Imported via ESM.sh CDN for optimal performance

- **HTM (v3.1.1)**: A JSX-like syntax in plain JavaScript
  - Enables writing JSX-like code without build tools
  - Used with Preact for component templating
  - Provides a lightweight alternative to JSX

- **Navigo (v8.11.1)**: A simple and powerful client-side router
  - Handles client-side routing and navigation
  - Supports hash-based and HTML5 history routing
  - Provides middleware and hooks for route handling

- **Zustand (v5.0.3)**: A small, fast and scalable state management solution
  - Provides global state management
  - Supports middleware and devtools
  - Enables efficient state updates and subscriptions

All dependencies are loaded via ESM.sh, which:
- Provides optimized ES modules for browsers
- Handles dependency resolution and versioning
- Ensures compatibility across different browsers
- Automatically handles tree-shaking and code splitting

## Components

### Frontend
- **ContactForm.js**: A Preact component that handles:
  - Form input and validation
  - Local storage for form data persistence
  - API communication
  - Success/error state management
  - Responsive design with dark mode support
- **Counter.js**: A Preact component that:
  - Displays the total number of form submissions
  - Shows the timestamp of the last submission
  - Auto-refreshes every 5 minutes
  - Handles loading and error states
  - Supports dark mode
- **form-elements.js**: A library of reusable form components:
  - FormInput: Text, email, and tel inputs with validation states
  - FormCheckbox: Checkbox with validation states
  - FormSubmitButton: Submit button with loading state
  - FormError: Error message display
  - FormSuccess: Success message display

### Backend
- **submit.php**: API endpoint that:
  - Accepts POST requests with form data
  - Validates required fields
  - Records submission timestamp and hashed IP address
  - Implements configurable rate limiting
  - Stores submissions in JSON format
  - Returns appropriate success/error responses
- **count.php**: API endpoint that:
  - Accepts GET requests
  - Returns the total number of submissions
  - Includes the timestamp of the last submission
- **config.php**: Configuration file that controls:
  - IP hashing salt
  - Rate limiting settings (enabled/disabled, window size, max submissions)

### Data Storage
- **submissions.json**: Stores form submissions with:
  - Timestamp
  - Hashed IP address (SHA-256 with salt)
  - Form data (email, name, phone number)
  - Share ID (6-character alphanumeric identifier)
  - Source Share ID (optional, tracks referral chain)
  - Fingerprint (browser fingerprint for duplicate detection)

The share ID system:
- Generates unique 6-character alphanumeric identifiers
- Enables tracking of submission chains through referrals
- Supports sharing functionality across the application
- Validates share IDs on both client and server side
- Uses a combination of letters and numbers for uniqueness
- Provides approximately 2.17 billion possible combinations

Data persistence:
- Form data is cached in localStorage for user convenience
- Thank you messages persist for 5 minutes across page changes
- Counter data is cached for 5 minutes to reduce server load
- All caches are automatically cleared when expired

## Security Considerations
- Data directory is outside web root
- API endpoints validate input
- CORS headers are properly configured
- Form data is sanitized before storage
- IP addresses are hashed with a salt to prevent reverse engineering
- Rate limiting is configurable and can be enabled/disabled as needed
- Salt for IP hashing should be stored securely in production

## Future Extensions
- Additional API endpoints can be added to `/web/api/`
- New components can be added to `/web/src/components/`
- Additional data storage can be added to `/data/`
- Additional security measures could be added (e.g., CAPTCHA)
- Rate limiting could be enhanced with more sophisticated algorithms
- Configuration could be moved to environment variables
- Counter could be enhanced with more statistics (e.g., submissions per day)
- Form components could be extended with additional input types (e.g., select, radio)
- Form validation could be enhanced with more complex rules 