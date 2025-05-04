import { Component, html } from '../lib/vendor.js';

// Cache configuration
const CACHE_KEY = 'submission_count_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export class Counter extends Component {
  constructor() {
    super();
    
    // Try to load from cache first
    const cached = this.loadFromCache();
    
    this.state = {
      count: cached?.count ?? 0,
      loading: !cached, // Only show loading if we don't have cache
      error: null
    };
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { count, timestamp } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp < CACHE_DURATION) {
        return { count };
      }
      
      // Clear expired cache
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error loading from cache:', error);
      return null;
    }
  }

  saveToCache(count) {
    try {
      const cacheData = {
        count,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  componentDidMount() {
    // Only fetch if we don't have valid cache
    if (!this.loadFromCache()) {
      this.fetchCount();
    }
    
    // Set up interval for periodic refresh
    this.interval = setInterval(() => this.fetchCount(), CACHE_DURATION);
    
    // Listen for refresh events
    window.addEventListener('counter-refresh', this.fetchCount);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener('counter-refresh', this.fetchCount);
  }

  fetchCount = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await fetch('api/count.php');
      if (!response.ok) {
        throw new Error('Failed to fetch submission count');
      }
      const data = await response.json();
      
      // Save to cache
      this.saveToCache(data.count);
      
      this.setState({
        count: data.count,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      });
    }
  };

  calculateTarget(count) {
    if (count < 10) return null;
    if (count < 100) return Math.floor(count / 10) * 10 + 10;
    return Math.floor(count / 100) * 100 + 100;
  }

  calculateProgress(count) {
    const target = this.calculateTarget(count);
    if (!target) return 0;
    
    if (count < 100) {
      const currentRange = Math.floor(count / 10) * 10;
      return ((count - currentRange) / 10) * 100;
    } else {
      const currentRange = Math.floor(count / 100) * 100;
      return ((count - currentRange) / 100) * 100;
    }
  }

  render() {
    const { count, loading, error } = this.state;
    const target = this.calculateTarget(count);
    const progress = this.calculateProgress(count);

    if (loading) {
      return html`
        <div class="counter">
          <h2>Aantal inzendingen</h2>
          <div class="loading">Laden...</div>
        </div>
      `;
    }

    if (error) {
      return html`
        <div class="counter">
          <h2>Aantal inzendingen</h2>
          <div class="error">${error}</div>
        </div>
      `;
    }

    if (count < 10) {
      return html``;
    }

    return html`
      <div class="counter">
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progress}%"></div>
          <div class="progress-text">${count} inzendingen, op naar de ${target}!</div>
        </div>
      </div>
    `;
  }
} 