/**
 * Production API Client - YouTube Analytics Frontend
 * Senior developer approach with proper error handling, types, and caching
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_VERSION = '/api/v1';

// Request/Response Types
export interface VideoAnalysisRequest {
  video_url: string;
  analyze_comments?: boolean;
  max_comments?: number;
}

export interface TextAnalysisRequest {
  text: string;
}

export interface BatchAnalysisRequest {
  texts: string[];
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface VideoAnalysisData {
  id: string;
  title: string;
  description: string;
  channel: string;
  channel_id: string;
  upload_date: string;
  view_count: number;
  like_count: number;
  duration: number;
  thumbnail: string;
  description_sentiment: string;
  description_confidence: number;
  comment_analysis?: {
    total_comments: number;
    sentiment_distribution: {
      counts: { positive: number; negative: number; neutral: number };
      percentages: { positive: number; negative: number; neutral: number };
    };
    average_confidence: number;
    comments: Array<{
      id: string;
      text: string;
      author: string;
      like_count: number;
      timestamp: number;
      sentiment: string;
      confidence: number;
    }>;
    model_used: string;
  };
}

export interface TextAnalysisData {
  text: string;
  sentiment: string;
  confidence: number;
  model_used: string;
}

export interface BatchAnalysisData {
  total_analyzed: number;
  sentiment_distribution: {
    counts: { positive: number; negative: number; neutral: number };
    percentages: { positive: number; negative: number; neutral: number };
  };
  average_confidence: number;
  results: Array<{
    id: number;
    text: string;
    sentiment: string;
    confidence: number;
  }>;
}

// API Error Class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// API Client Class
class YouTubeAnalyticsAPI {
  private client: AxiosInstance;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL + API_VERSION,
      timeout: 60000, // 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('❌ API Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
          throw new APIError(
            'Backend server is not running. Please start the backend service.',
            503,
            'CONNECTION_REFUSED'
          );
        }

        if (error.response) {
          const status = error.response.status;
          const message = (error.response.data as { detail?: string })?.detail || error.message;
          throw new APIError(message, status, error.code);
        }

        throw new APIError(error.message, undefined, error.code);
      }
    );
  }

  private getCacheKey(endpoint: string, params?: unknown): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`📦 Cache hit: ${key}`);
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Health check
  async healthCheck(): Promise<unknown> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const response = await this.client.get('/');
      return { success: true, data: response.data };
    } catch (error) {
      if (error instanceof APIError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error occurred' };
    }
  }

  // Analyze video
  async analyzeVideo(request: VideoAnalysisRequest): Promise<APIResponse<VideoAnalysisData>> {
    const cacheKey = this.getCacheKey('analyze_video', request);
    const cached = this.getFromCache<APIResponse<VideoAnalysisData>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await this.client.post('/analyze/video', request);
      const result = response.data;
      
      // Cache successful results
      this.setCache(cacheKey, result);
      
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analyze text
  async analyzeText(request: TextAnalysisRequest): Promise<APIResponse<TextAnalysisData>> {
    try {
      const response = await this.client.post('/analyze/text', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Batch analyze
  async analyzeBatch(request: BatchAnalysisRequest): Promise<APIResponse<BatchAnalysisData>> {
    try {
      const response = await this.client.post('/analyze/batch', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get models status
  async getModelsStatus(): Promise<unknown> {
    try {
      const response = await this.client.get('/models/status');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ API cache cleared');
  }

  private handleError(error: unknown): APIError {
    if (error instanceof APIError) {
      return error;
    }
    
    if (axios.isAxiosError(error)) {
      const message = (error.response?.data as { detail?: string })?.detail || error.message;
      const status = error.response?.status;
      return new APIError(message, status, error.code);
    }

    return new APIError('An unexpected error occurred');
  }
}

// Export singleton instance
export const api = new YouTubeAnalyticsAPI();

// Export convenience methods
export const {
  healthCheck,
  testConnection,
  analyzeVideo,
  analyzeText,
  analyzeBatch,
  getModelsStatus,
  clearCache,
} = api;
