import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import TweetCard from './TweetCard';
import { Tweet, ApiError } from '../types';
import { tweetService } from '../api/tweetService';

const TweetGenerator: React.FC = () => {
  const [originalText, setOriginalText] = useState("");
  const [aiGuidance, setAiGuidance] = useState("");
  const [tweetCount, setTweetCount] = useState(3);
  const [generateThreads, setGenerateThreads] = useState(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!originalText.trim()) return;

    setIsLoading(true);
    setError(null);
    setTweets([]);

    try {
      const response = await tweetService.generateTweets({
        text: originalText,
        numTweets: tweetCount,
        allowThreads: generateThreads,
        guidance: aiGuidance.trim() || undefined,
      });

      // Transform API response to our Tweet format
      const transformedTweets: Tweet[] = response.tweets.map((tweet, index) => ({
        id: `tweet-${Date.now()}-${index}`,
        text: tweet.text,
        charCount: tweet.charCount,
        ...(generateThreads && {
          threadIndex: index + 1,
          totalInThread: response.tweets.length
        })
      }));

      setTweets(transformedTweets);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate tweets';
      setError(errorMessage);
      console.error('Error generating tweets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (tweet: Tweet) => {
    navigator.clipboard.writeText(tweet.text);
    setCopiedId(tweet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Tweet Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          Convert your long text into Twitter-sized tweets
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-12 border-2 border-primary bg-primary/5 p-6 rounded-lg">
        <div className="space-y-6">
          {/* Original Text */}
          <div className="space-y-2">
            <Label htmlFor="original-text">Original Text</Label>
            <Textarea
              id="original-text"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste your long text here..."
              className="min-h-[200px] max-h-[200px] resize-none bg-background text-base"
            />
          </div>

          {/* AI Guidance */}
          <div className="space-y-2">
            <Label htmlFor="ai-guidance">AI Guidance (Optional)</Label>
            <Input
              id="ai-guidance"
              value={aiGuidance}
              onChange={(e) => setAiGuidance(e.target.value)}
              placeholder="e.g., Make it more casual, add emojis..."
              className="bg-background text-base"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-end gap-6">
            {/* Tweet Count Slider */}
            <div className="flex-1 min-w-[250px] space-y-2">
              <Label htmlFor="tweet-count">Number of Tweets: {tweetCount}</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="tweet-count"
                  min={1}
                  max={10}
                  step={1}
                  value={[tweetCount]}
                  onValueChange={(value) => setTweetCount(value[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={tweetCount}
                  onChange={(e) => setTweetCount(Number(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>

            {/* Generate Threads Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="generate-threads"
                checked={generateThreads}
                onChange={(e) => setGenerateThreads(e.target.checked)}
              />
              <Label htmlFor="generate-threads" className="cursor-pointer">
                Generate as Thread
              </Label>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!originalText.trim() || isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                'Generate Tweets'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error:</span>
          </div>
          <p className="mt-1 text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Output Section */}
      {tweets.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Generated Tweets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tweets.map((tweet) => (
              <TweetCard
                key={tweet.id}
                tweet={tweet}
                onCopy={handleCopy}
                isCopied={copiedId === tweet.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetGenerator;

