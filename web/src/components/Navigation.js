import { Component, html } from '../lib/vendor.js';

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Stores the full client-side path, e.g., /petitie/about or /about
      currentFullClientPath: window.location.pathname
    };
  }

  componentDidMount() {
    // Listen for navigation events dispatched by the router
    window.addEventListener('navigation', this.updateCurrentPath);
  }

  componentWillUnmount() {
    // Clean up event listener
    window.removeEventListener('navigation', this.updateCurrentPath);
  }

  updateCurrentPath = () => {
    this.setState({ currentFullClientPath: window.location.pathname });
  }

  render() {
    const { currentFullClientPath } = this.state;
    const routerInstance = window.router; // Access the global router instance

    // Define navigation links with paths relative to Navigo's root
    const navLinks = [
      { path: "/", text: "Home" },
      { path: "/about", text: "About" },
      { path: "/privacy", text: "Privacy" }
    ];

    return html`
      <nav class="main-navigation">
        ${navLinks.map(link => {
          // routerInstance.link(path) generates the full, base-path-aware URL
          const isActive = routerInstance && currentFullClientPath === routerInstance.link(link.path);
          return html`
            <a href="${link.path}" data-navigo class=${isActive ? 'active' : ''}>${link.text}</a>
          `;
        })}
      </nav>
    `;
  }
} 