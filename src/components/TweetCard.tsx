import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { TweetCardProps } from '../types';

// Copy Icon SVG
const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

// Check Icon SVG
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const TweetCard: React.FC<TweetCardProps> = ({ tweet, onCopy, isCopied }) => {
  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      {/* Thread Indicator */}
      {tweet.threadIndex && (
        <div className="inline-flex items-center">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            {tweet.threadIndex}/{tweet.totalInThread}
          </span>
        </div>
      )}

      {/* Tweet Text */}
      <p className="text-base leading-relaxed min-h-[100px] text-card-foreground">
        {tweet.text}
      </p>

      {/* Footer */}
      <div className="border-t border-border pt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {tweet.charCount || tweet.text.length}/280
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCopy(tweet)}
          className="gap-2"
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
    </Card>
  );
};

export default TweetCard;

