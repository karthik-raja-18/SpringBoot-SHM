import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor: Always attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[API REQUEST]', config.method?.toUpperCase(), config.url, config);
    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Log all responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('[API RESPONSE]', response.config?.url, response);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('[API RESPONSE ERROR]', error.response.config?.url, error.response);
    } else {
      console.error('[API RESPONSE ERROR]', error);
    }
    return Promise.reject(error);
  }
);


// Apply axios-cache-interceptor
const cachedApi = setupCache(api, {
  ttl: 5 * 60 * 1000, // Cache time: 5 minutes
  methods: ['get'],
  etag: true,
  modifiedSince: true,
  cachePredicate: {
    statusCheck: (status) => status >= 200 && status < 400,
    containsHeaders: (headers) => !headers['x-sensitive-data'],
  },
});

// Manual request cache for deduplication
const requestCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000;

// Request interceptor: auth + request cache deduplication
cachedApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method !== 'get') return config;

    const requestKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
    const now = Date.now();
    const cachedRequest = requestCache.get(requestKey);

    if (cachedRequest && now - cachedRequest.timestamp < CACHE_EXPIRY) {
      return cachedRequest.promise;
    }

    const requestPromise = config;
    requestCache.set(requestKey, {
      promise: requestPromise,
      timestamp: now,
    });

    // Cleanup old cache entries
    for (const [key, { timestamp }] of requestCache.entries()) {
      if (now - timestamp > CACHE_EXPIRY) {
        requestCache.delete(key);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: error handling + retry logic
cachedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry once on server errors
    if (!originalRequest._retry && error.response?.status >= 500) {
      originalRequest._retry = true;
      await new Promise((res) => setTimeout(res, 1000)); // wait 1s
      return cachedApi(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Utility to clear specific cache entries
export const clearApiCache = (urlPattern) => {
  for (const [key] of requestCache.entries()) {
    if (key.includes(urlPattern)) {
      requestCache.delete(key);
    }
  }
};

export default cachedApi;
