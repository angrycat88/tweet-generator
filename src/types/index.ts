export interface Tweet {
  id: string;
  text: string;
  charCount?: number;        // Character count from API
  threadIndex?: number;      // Position in thread (1, 2, 3...)
  totalInThread?: number;    // Total tweets in thread
}

export interface TweetCardProps {
  tweet: Tweet;
  onCopy: (tweet: Tweet) => void;
  isCopied: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

