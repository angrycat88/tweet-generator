import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import TweetCard from './TweetCard';
import { Tweet } from '../types';

const TweetGenerator: React.FC = () => {
  const [originalText, setOriginalText] = useState("");
  const [aiGuidance, setAiGuidance] = useState("");
  const [tweetCount, setTweetCount] = useState(3);
  const [generateThreads, setGenerateThreads] = useState(false);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    // Mock tweet generation for now
    const mockTweets: Tweet[] = [];
    const words = originalText.split(' ');
    const wordsPerTweet = Math.ceil(words.length / tweetCount);
    
    for (let i = 0; i < tweetCount; i++) {
      const startIndex = i * wordsPerTweet;
      const endIndex = Math.min(startIndex + wordsPerTweet, words.length);
      const tweetText = words.slice(startIndex, endIndex).join(' ');
      
      mockTweets.push({
        id: `tweet-${i}`,
        text: tweetText,
        ...(generateThreads && {
          threadIndex: i + 1,
          totalInThread: tweetCount
        })
      });
    }
    
    setTweets(mockTweets);
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
              disabled={!originalText.trim()}
              size="lg"
              className="px-8"
            >
              Generate Tweets
            </Button>
          </div>
        </div>
      </div>

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

