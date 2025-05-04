import { h, render, html, Navigo } from './vendor.js';
import { App } from '../components/App.js';
import { validateShareId } from './utils.js';

// Get base path from meta tag
const basePath = document.querySelector('base')?.getAttribute('href') || '/';

// Create router with dynamic base path
const router = new Navigo(basePath);

// Make router globally available
window.router = router;

// Create a custom event for navigation
const navigationEvent = new CustomEvent('navigation', {
  detail: { path: window.location.pathname }
});

// Define page components
const pageComponentMap = {};

// Function to validate path segments
function isValidPathSegment(segment) {
  // Only allow alphanumeric characters, dashes, underscores, and periods
  // Reject anything that could be interpreted as a URL protocol or script
  if (!segment) return true; // Empty segment is OK (home page)
  return /^[a-zA-Z0-9_\-\.\/]*$/.test(segment) && 
         !segment.includes('javascript:') && 
         !segment.startsWith('http') &&
         !segment.startsWith('//');
}

// Lazy load page component
async function loadPageComponent(pageName) {
  try {
    const pagePath = `../pages/${pageName}.js`;
    const pageComponentName = `${pageName}Page`;
    
    const module = await import(pagePath);
    if (!module[pageComponentName]) {
      throw new Error(`Page component ${pageComponentName} not found in ${pagePath}`);
    }
    pageComponentMap[pageComponentName] = module[pageComponentName];
    return module[pageComponentName];
  } catch (error) {
    console.error(`Failed to load page ${pageName}:`, error);
    return null;
  }
}

// Setup routes
export function initRouter() {
  const appElement = document.getElementById("app");

  // Register routes
  router.on({
    '/': async () => {
      const HomePage = await loadPageComponent('Home');
      render(
        html`<${App}><${HomePage} /><//>`,
        appElement
      );
      window.dispatchEvent(navigationEvent);
    },
    '/about': async () => {
      const AboutPage = await loadPageComponent('About');
      render(
        html`<${App}><${AboutPage} /><//>`,
        appElement
      );
      window.dispatchEvent(navigationEvent);
    },
    '/privacy': async () => {
      const PrivacyPage = await loadPageComponent('Privacy');
      render(
        html`<${App}><${PrivacyPage} /><//>`,
        appElement
      );
      window.dispatchEvent(navigationEvent);
    },
    '/share/:id': async ({ data }) => {
      const shareId = validateShareId(data.id);
      if (!shareId) {
        // If share ID is invalid, redirect to home
        router.navigate('/');
        return;
      }
      
      const HomePage = await loadPageComponent('Home');
      render(
        html`<${App}><${HomePage} shareId=${shareId} /><//>`,
        appElement
      );
      window.dispatchEvent(navigationEvent);
    }
  });

  router.notFound(async () => {
    const NotFoundPage = await loadPageComponent('NotFound');
    render(
      html`<${App}><${NotFoundPage} /><//>`,
      appElement
    );
    window.dispatchEvent(navigationEvent);
  });

  // Initialize router
  router.resolve();

  // Handle link clicks for SPA navigation
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-navigo]")) {
      e.preventDefault();
      router.navigate(e.target.getAttribute("href"));
    }
  });

  return router;
} 