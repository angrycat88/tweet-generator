// API service for communicating with the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface GenerateTweetsRequest {
  text: string;
  numTweets: number;
  allowThreads: boolean;
  guidance?: string;
}

export interface GeneratedTweet {
  text: string;
  charCount: number;
}

export interface GenerateTweetsResponse {
  tweets: GeneratedTweet[];
}

export interface ApiError {
  error: string;
}

class TweetService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async generateTweets(request: GenerateTweetsRequest): Promise<GenerateTweetsResponse> {
    return this.makeRequest<GenerateTweetsResponse>('/generate-tweets', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health');
  }
}

export const tweetService = new TweetService();
