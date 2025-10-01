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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Allow larger text inputs
app.use(express.urlencoded({ extended: true }));

// Input validation middleware
const validateInput = (req, res, next) => {
  const { text, numTweets, allowThreads, guidance } = req.body;

  // Validate required fields
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Missing or invalid text field. Text is required and must be a string.'
    });
  }

  // Validate text length (5000 words max as per PRD)
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 5000) {
    return res.status(400).json({
      error: 'Text exceeds maximum length of 5000 words. Please shorten your input.'
    });
  }

  if (wordCount < 1) {
    return res.status(400).json({
      error: 'Text cannot be empty. Please provide some content to generate tweets from.'
    });
  }

  // Validate numTweets
  if (!numTweets || !Number.isInteger(numTweets) || numTweets < 1 || numTweets > 10) {
    return res.status(400).json({
      error: 'numTweets must be an integer between 1 and 10.'
    });
  }

  // Validate allowThreads
  if (typeof allowThreads !== 'boolean') {
    return res.status(400).json({
      error: 'allowThreads must be a boolean value.'
    });
  }

  // Validate guidance (optional)
  if (guidance && (typeof guidance !== 'string' || guidance.length > 500)) {
    return res.status(400).json({
      error: 'guidance must be a string with maximum 500 characters.'
    });
  }

  next();
};

// Advanced prompt builder based on PRD requirements
function buildPrompt(text, numTweets, allowThreads, guidance) {
  let prompt = `You are a professional social media content creator specializing in Twitter. Your task is to convert the provided text into ${numTweets} high-quality tweet${numTweets > 1 ? 's' : ''} that maintain the original tone and factual accuracy.

ORIGINAL TEXT:
"${text}"

REQUIREMENTS:
- Maintain the original tone and factual content exactly
- Do NOT invent information not present in the original text
- Each tweet must be under 280 characters
- Use hashtags where appropriate and relevant
- Make tweets engaging and shareable
- Keep language natural and conversational`;

  // Add thread-specific instructions
  if (allowThreads && numTweets > 1) {
    prompt += `

THREAD REQUIREMENTS:
- Create a connected thread of ${numTweets} tweets
- Each tweet should build on the previous one
- Use Twitter thread notation (1/${numTweets}, 2/${numTweets}, etc.) at the start of each tweet
- Ensure the thread tells a complete story or covers all key points
- Each tweet should work both standalone and as part of the thread`;
  } else if (numTweets > 1) {
    prompt += `

MULTIPLE TWEETS REQUIREMENTS:
- Create ${numTweets} separate, independent tweets
- Each tweet should cover different aspects or key points from the original text
- Ensure variety in approach while maintaining consistency with the source material`;
  }

  // Add guidance if provided
  if (guidance && guidance.trim()) {
    prompt += `

ADDITIONAL GUIDANCE:
"${guidance.trim()}"
Please incorporate this guidance while maintaining the original tone and factual accuracy.`;
  }

  // Add output format instructions
  prompt += `

OUTPUT FORMAT:
Return each tweet on a separate line, numbered 1, 2, 3, etc.
${allowThreads && numTweets > 1 ? 'Include thread notation (1/3, 2/3, etc.) at the start of each tweet.' : ''}
Do not include any other text, explanations, or formatting.

Example format:
1. First tweet content here
2. Second tweet content here
3. Third tweet content here`;

  return prompt;
}

// Advanced tweet parsing function
function parseTweets(aiResponse, numTweets, allowThreads) {
  if (!aiResponse || typeof aiResponse !== 'string') {
    throw new Error('Invalid AI response format');
  }

  // Clean up the response
  let cleanedResponse = aiResponse.trim();
  
  // Remove common prefixes and suffixes
  cleanedResponse = cleanedResponse.replace(/^(Here are|Generated|Tweets?):?\s*/i, '');
  cleanedResponse = cleanedResponse.replace(/\s*(That's all|End of tweets?|Done)\.?\s*$/i, '');
  
  // Split by various patterns
  const tweetSeparators = [
    /\n(?=\d+\.\s)/g,           // Newline followed by number
    /\n(?=\d+\/\d+\s)/g,        // Newline followed by thread notation
    /\n(?=Tweet \d+)/gi,         // Newline followed by "Tweet X"
    /\n(?=Thread \d+)/gi,        // Newline followed by "Thread X"
    /\n\n/g,                     // Double newlines
    /\n(?=\w)/g,                 // Newline followed by word (fallback)
  ];

  let tweets = [cleanedResponse];
  
  // Try each separator
  for (const separator of tweetSeparators) {
    const splitTweets = tweets.flatMap(tweet => 
      tweet.split(separator)
        .map(t => t.trim())
        .filter(t => t.length > 0)
    );
    
    if (splitTweets.length > 1) {
      tweets = splitTweets;
      break;
    }
  }

  // Clean and process each tweet
  tweets = tweets.map((tweet, index) => {
    // Remove numbering patterns
    let cleanedTweet = tweet.replace(/^\d+\.\s*/, '');
    cleanedTweet = cleanedTweet.replace(/^Tweet \d+:\s*/gi, '');
    cleanedTweet = cleanedTweet.replace(/^Thread \d+:\s*/gi, '');
    
    // Handle thread notation
    if (allowThreads && numTweets > 1) {
      const threadMatch = cleanedTweet.match(/^(\d+\/\d+)\s*(.+)$/);
      if (threadMatch) {
        cleanedTweet = threadMatch[2];
      }
    }
    
    return cleanedTweet.trim();
  }).filter(tweet => tweet.length > 0);

  // Ensure we have the right number of tweets
  if (tweets.length < numTweets) {
    // If we have fewer tweets than requested, try to split the longest one
    while (tweets.length < numTweets && tweets.length > 0) {
      const longestIndex = tweets.reduce((maxIndex, tweet, index) => 
        tweet.length > tweets[maxIndex].length ? index : maxIndex, 0
      );
      
      const longestTweet = tweets[longestIndex];
      const midPoint = Math.floor(longestTweet.length / 2);
      const spaceIndex = longestTweet.lastIndexOf(' ', midPoint);
      
      if (spaceIndex > 0) {
        const firstPart = longestTweet.substring(0, spaceIndex).trim();
        const secondPart = longestTweet.substring(spaceIndex + 1).trim();
        tweets[longestIndex] = firstPart;
        tweets.push(secondPart);
      } else {
        break;
      }
    }
  }

  // Limit to requested number
  tweets = tweets.slice(0, numTweets);

  // Transform to required format
  return tweets.map((tweet, index) => {
    // Add thread notation if needed
    let finalText = tweet;
    if (allowThreads && numTweets > 1) {
      finalText = `${index + 1}/${numTweets} ${tweet}`;
    }
    
    return {
      text: finalText,
      charCount: finalText.length
    };
  });
}

// POST /generate-tweets endpoint
app.post('/generate-tweets', validateInput, async (req, res) => {
  try {
    const { text, numTweets, allowThreads, guidance } = req.body;

    console.log(`Generating ${numTweets} tweet${numTweets > 1 ? 's' : ''} ${allowThreads ? 'as thread' : 'independently'}`);

    // Build the prompt
    const prompt = buildPrompt(text, numTweets, allowThreads, guidance);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional social media content creator who specializes in creating engaging, viral-worthy tweets while maintaining factual accuracy and original tone. You understand Twitter's culture and what makes content shareable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    const aiResponse = completion.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response received from OpenAI');
    }

    // Parse the response into individual tweets
    const tweets = parseTweets(aiResponse, numTweets, allowThreads);

    // Validate parsed tweets
    if (tweets.length === 0) {
      throw new Error('Failed to parse tweets from AI response');
    }

    // Check for tweets that are too long
    const invalidTweets = tweets.filter(tweet => tweet.text.length > 280);
    if (invalidTweets.length > 0) {
      console.warn(`Warning: ${invalidTweets.length} tweet(s) exceed 280 characters`);
    }

    console.log(`Successfully generated ${tweets.length} tweet(s)`);
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

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment before trying again.'
      });
    }

    if (error.message?.includes('context_length_exceeded')) {
      return res.status(400).json({
        error: 'Input text is too long. Please shorten your text and try again.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to generate tweets. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'AI Tweet Generator API',
    version: '1.0.0',
    endpoints: {
      'POST /generate-tweets': 'Generate tweets from text input',
      'GET /health': 'Health check endpoint'
    },
    features: [
      'Text to tweet conversion',
      'Thread generation support',
      'Custom guidance integration',
      'Character count tracking',
      'Input validation and error handling'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /generate-tweets',
      'GET /health',
      'GET /api/info'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Tweet Generator API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🎯 Generate tweets: POST http://localhost:${PORT}/generate-tweets`);
  console.log(`📋 API info: http://localhost:${PORT}/api/info`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export default app;