# Tweet Generator Backend

A Node.js + Express backend API for generating tweets using OpenAI's GPT-4-turbo model.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - The `.env` file should contain your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### POST /generate-tweets

Generates tweets based on input text and parameters.

**Request Body:**
```json
{
  "text": "Your input text here",
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
      "text": "Generated tweet content here",
      "charCount": 142
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Features

- ✅ OpenAI GPT-4-turbo integration
- ✅ CORS enabled for frontend requests
- ✅ Input validation and error handling
- ✅ Smart tweet parsing and splitting
- ✅ Thread support for connected tweets
- ✅ Character count tracking
- ✅ Modern ES modules (import/export)

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid input validation
- OpenAI API errors (quota, authentication)
- Network and server errors
