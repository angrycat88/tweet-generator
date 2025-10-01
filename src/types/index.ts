export interface Tweet {
  id: string;
  text: string;
  threadIndex?: number;      // Position in thread (1, 2, 3...)
  totalInThread?: number;    // Total tweets in thread
}

export interface TweetCardProps {
  tweet: Tweet;
  onCopy: (tweet: Tweet) => void;
  isCopied: boolean;
}

