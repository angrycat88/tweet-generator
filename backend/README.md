# AI Tweet Generator Backend

A comprehensive Node.js + Express backend API for generating engaging tweets from text using OpenAI's GPT-4-turbo model. Built according to the PRD specifications for converting essays, articles, and scripts into Twitter-ready content.

## 🚀 Features

- **Advanced AI Integration**: Uses GPT-4-turbo for high-quality tweet generation
- **Thread Support**: Creates connected tweet threads with proper notation (1/3, 2/3, etc.)
- **Smart Parsing**: Intelligently splits AI responses into individual tweets
- **Input Validation**: Comprehensive validation for text length, format, and content
- **Error Handling**: Robust error handling for API failures and edge cases
- **CORS Support**: Configured for frontend integration
- **Character Counting**: Accurate character count tracking for each tweet
- **Guidance Integration**: Incorporates optional user guidance while maintaining original tone

## 📋 Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

## 🔗 API Endpoints

### POST /generate-tweets

Converts text into engaging tweets with optional thread support.

**Request Body:**
```json
{
  "text": "Your long text content here...",
  "numTweets": 3,
  "allowThreads": true,
  "guidance": "Make them funny and engaging"
}
```

**Response:**
```json
{
  "tweets": [
    {
      "text": "1/3 First tweet in thread with engaging content #hashtag",
      "charCount": 142
    },
    {
      "text": "2/3 Second tweet continuing the thread naturally",
      "charCount": 156
    },
    {
      "text": "3/3 Final tweet completing the thread",
      "charCount": 134
    }
  ]
}
```

### GET /health

Health check endpoint with system information.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

### GET /api/info

API information and available endpoints.

## 🛡️ Input Validation

The API validates all inputs according to PRD requirements:

- **Text Length**: Maximum 5000 words, minimum 1 word
- **Tweet Count**: Integer between 1-10
- **Thread Support**: Boolean flag
- **Guidance**: Optional string, max 500 characters
- **Content Type**: Plain text only (no HTML/markup)

## 🧠 AI Behavior

The system follows PRD specifications:

- **Tone Preservation**: Maintains original tone and factual accuracy
- **No Fabrication**: Never invents information not in source text
- **Hashtag Integration**: Adds relevant hashtags where appropriate
- **Thread Logic**: Creates connected threads when requested
- **Character Limits**: Ensures all tweets stay under 280 characters
- **Engagement Focus**: Optimizes for shareability and engagement

## 🔧 Advanced Features

### Smart Tweet Parsing
- Handles various AI response formats
- Removes numbering and formatting artifacts
- Splits long responses intelligently
- Maintains thread notation when needed

### Error Handling
- **OpenAI API Errors**: Quota, authentication, rate limits
- **Input Validation**: Comprehensive field validation
- **Network Issues**: Timeout and connection error handling
- **Response Parsing**: Fallback for malformed AI responses

### Thread Management
- **Notation**: Proper Twitter thread notation (1/3, 2/3, etc.)
- **Continuity**: Ensures logical flow between tweets
- **Standalone**: Each tweet works both alone and in thread
- **Length Optimization**: Balances content across tweets

## 🚨 Error Responses

### Validation Errors (400)
```json
{
  "error": "Text exceeds maximum length of 5000 words"
}
```

### API Errors (401/402/429)
```json
{
  "error": "OpenAI API quota exceeded"
}
```

### Server Errors (500)
```json
{
  "error": "Failed to generate tweets. Please try again later."
}
```

## 🔒 Security Features

- **Input Sanitization**: Prevents injection attacks
- **Size Limits**: Prevents memory exhaustion
- **CORS Configuration**: Secure cross-origin requests
- **Error Sanitization**: Hides sensitive details in production

## 📊 Performance

- **Response Time**: Typically 5-10 seconds for tweet generation
- **Memory Usage**: Optimized for large text inputs (up to 5000 words)
- **Concurrent Requests**: Handles multiple simultaneous requests
- **Caching**: Ready for future caching implementation

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# Generate tweets
curl -X POST http://localhost:3001/generate-tweets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here",
    "numTweets": 3,
    "allowThreads": true,
    "guidance": "Make it engaging"
  }'
```

## 🚀 Deployment

The API is production-ready with:
- Environment-based configuration
- Comprehensive logging
- Error monitoring
- Health checks
- Graceful error handling

Perfect for deployment on platforms like Vercel, Railway, or AWS.
