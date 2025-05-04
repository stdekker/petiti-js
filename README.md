# PetitJS

A modern, buildless web application for managing petition submissions, built with [Preact](https://preactjs.com/) and [PHP](https://www.php.net/). The application features a contact form with real-time validation, submission tracking, and a live counter showing the total number of submissions. 

The application leverages ES modules (import/export syntax) to load dependencies directly in the browser through [esm.sh](https://esm.sh/).

## Features

- 📝 Petition form with real-time validation
- 🔒 Secure form submission handling
- 📊 Live submission counter with progress tracking
- 🌓 Dark mode support
- 📱 Responsive design
- 🔄 Real-time updates
- 🛡️ Rate limiting and IP protection
- 🔗 Share ID system for tracking referrals

## Tech Stack

- **Frontend**: Preact, HTM, Zustand, Navigo
- **Backend**: PHP
- **Storage**: JSON files
- **Styling**: CSS with dark mode support

## Project Structure

```
petiti-js/
├── data/                  # Data storage (outside web root)
├── web/                   # Web application root
│   ├── api/              # API endpoints
│   ├── src/              # Source code
│   │   ├── components/   # Preact components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utility libraries
│   └── css/             # Stylesheets
├── LICENSE              # GPL-3.0 License
├── architecture.md      # Detailed architecture documentation
└── config.php          # API configuration
```

For a detailed explanation of the project's architecture, components, and data flow, please refer to [architecture.md](architecture.md).

## Getting Started

### Using DDEV for further development (Recommended)

1. Install [DDEV](https://ddev.readthedocs.io/en/stable/)
2. Clone the repository
3. Copy `config.default.php` to `config.php` and adjust settings
4. Start DDEV:
   ```bash
   ddev start
   ```
5. Access the application at https://petiti-js.ddev.site

### Manual Setup

1. Clone the repository
2. Configure the API settings in `config.php`
3. Set up your web server to point to the `web` directory
4. Access the application through your web browser

## Security
- Form data is sanitized before storage
- Rate limiting is configurable
- CORS headers
- Browser fingerprinting for duplicate detection

## License

This project is licensed under the [GPL-3.0 License](LICENSE) - see the LICENSE file for details. 