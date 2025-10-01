import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to parse tweets from AI response
function parseTweets(aiResponse, numTweets) {
  // Split by common tweet separators
  const tweetSeparators = [
    /\n\n/g,           // Double newlines
    /\n(?=\d+\.)/g,    // Newline followed by number
    /\n(?=Tweet \d+)/gi, // Newline followed by "Tweet X"
    /\n(?=Thread \d+)/gi, // Newline followed by "Thread X"
  ];

  let tweets = [aiResponse];
  
  // Try each separator
  for (const separator of tweetSeparators) {
    const splitTweets = tweets.flatMap(tweet => 
      tweet.split(separator).map(t => t.trim()).filter(t => t.length > 0)
    );
    
    if (splitTweets.length > 1) {
      tweets = splitTweets;
      break;
    }
  }

  // Clean up tweets and ensure we have the right number
  tweets = tweets
    .map(tweet => {
      // Remove numbering patterns
      return tweet.replace(/^\d+\.\s*/, '').replace(/^Tweet \d+:\s*/gi, '').replace(/^Thread \d+:\s*/gi, '').trim();
    })
    .filter(tweet => tweet.length > 0)
    .slice(0, numTweets);

  // If we still have fewer tweets than requested, split the last one
  while (tweets.length < numTweets && tweets.length > 0) {
    const lastTweet = tweets[tweets.length - 1];
    const midPoint = Math.floor(lastTweet.length / 2);
    const spaceIndex = lastTweet.lastIndexOf(' ', midPoint);
    
    if (spaceIndex > 0) {
      const firstPart = lastTweet.substring(0, spaceIndex).trim();
      const secondPart = lastTweet.substring(spaceIndex + 1).trim();
      tweets[tweets.length - 1] = firstPart;
      tweets.push(secondPart);
    } else {
      break;
    }
  }

  return tweets.map(tweet => ({
    text: tweet,
    charCount: tweet.length
  }));
}

// POST /generate-tweets endpoint
app.post('/generate-tweets', async (req, res) => {
  try {
    const { text, numTweets, allowThreads, guidance } = req.body;

    // Validate required fields
    if (!text || !numTweets) {
      return res.status(400).json({
        error: 'Missing required fields: text and numTweets are required'
      });
    }

    // Validate numTweets is a positive integer
    if (!Number.isInteger(numTweets) || numTweets < 1 || numTweets > 10) {
      return res.status(400).json({
        error: 'numTweets must be an integer between 1 and 10'
      });
    }

    // Build the prompt for OpenAI
    let prompt = `Generate ${numTweets} tweet${numTweets > 1 ? 's' : ''} based on the following input:\n\n`;
    prompt += `Input: "${text}"\n\n`;
    
    if (guidance) {
      prompt += `Additional guidance: ${guidance}\n\n`;
    }

    if (allowThreads && numTweets > 1) {
      prompt += `Create a thread of ${numTweets} connected tweets. Each tweet should build on the previous one and form a cohesive narrative.\n\n`;
    } else if (numTweets > 1) {
      prompt += `Create ${numTweets} separate, independent tweets on this topic.\n\n`;
    }

    prompt += `Requirements:
- Each tweet must be under 280 characters
- Make tweets engaging and shareable
- Use appropriate hashtags when relevant
- Keep language natural and conversational
- ${allowThreads && numTweets > 1 ? 'Ensure tweets work as a connected thread' : 'Make each tweet standalone'}

Format: Return each tweet on a new line, numbered 1, 2, 3, etc.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional social media content creator who specializes in creating engaging, viral-worthy tweets. You understand Twitter's culture and what makes content shareable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Parse the response into individual tweets
    const tweets = parseTweets(aiResponse, numTweets);

    // Ensure we have the requested number of tweets
    if (tweets.length < numTweets) {
      // If we got fewer tweets than requested, pad with the last tweet
      while (tweets.length < numTweets) {
        tweets.push(tweets[tweets.length - 1]);
      }
    }

    res.json({ tweets });

  } catch (error) {
    console.error('Error generating tweets:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        error: 'OpenAI API quota exceeded. Please check your API key and billing.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid OpenAI API key. Please check your environment variables.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to generate tweets. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Tweet Generator backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Generate tweets: POST http://localhost:${PORT}/generate-tweets`);
});

export default app;
