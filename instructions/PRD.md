# Project Requirements

Product Requirements Document (PRD)

Product Name: AI Tweet Generator

Objective:
Enable users to paste text (essays, articles, scripts) and generate Tweets or tweet threads that summarize, rewrite, and optionally follow guidance prompts, maintaining the original tone and factual accuracy.

1. Target Users

Social media content creators

Bloggers and writers

Students or professionals who want to summarize text into Tweets

2. Core Features
2.1 Text Input

Users can paste plain text only.

Maximum input length: 5000 words.

Textbox should occupy the top third of the UI and not expand vertically.

2.2 Optional Guidance

Smaller, thinner textbox for optional AI guidance (e.g., “Make this funny” or “Focus on key points”).

Guidance is optional; if empty, AI follows default behavior.

2.3 Tweet Generation Options

Number of Tweets: Slider and optional numeric input.

Threads Checkbox: Allows generated tweets to form threads.

Generate Button: Triggers AI call.

2.4 AI-generated Tweets Display

Each tweet appears in its own container.

Display character count for each tweet.

Include copy button to copy individual tweets.

If tweets are part of a thread:

Contained together

Clearly linked vertically

Use Twitter convention (1/3, 2/3, etc.)

2.5 Optional Regeneration

Regenerate button regenerates all tweets.

Single regeneration for simplicity (no partial regenerate for now).

3. AI Behavior

Stick closely to original tone and factual content.

Avoid inventing information not present in the original text.

Use hashtags where appropriate.

If threads are allowed, split ideas naturally across multiple tweets.

Respect optional guidance prompt if provided.

Output in JSON format for frontend consumption:

{
  "tweets": [
    { "text": "Tweet 1", "charCount": 78 },
    { "text": "Tweet 2", "charCount": 95 }
  ]
}

4. Backend Requirements

Technology: Node.js + Express.

Environment: .env for OpenAI API key.

Endpoint: POST /generate-tweets

Input JSON: { text, numTweets, allowThreads, guidance }

Output JSON: { tweets: [{ text, charCount }, ...] }

Include CORS for frontend requests.

Include error handling for API failures.

Use modern ES modules (import/export).

5. Frontend Requirements

Technology: React.

Layout:

Top: original text input

Below: options (numTweets slider, threads checkbox, generate button)

Optional guidance textbox next to/below options

Below that: generated tweets in 3 columns, threads aligned vertically

Allow copying individual tweets.

Loading indicator while AI is generating.

6. Constraints

Only plain text input is allowed.

Tweets should not exceed Twitter character limit (280 chars each).

AI must not pull external information; output strictly based on submitted text.

Generated output should be saved locally if feasible.

No tracking of tweet engagement.

7. Future Enhancements (Optional)

User accounts and history

Partial regeneration of tweets

Custom themes for frontend

Integration with Twitter API for direct posting

8. Success Metrics

Tweets accurately reflect source text.

Correct handling of threads and optional guidance.

Frontend displays tweets clearly with copy functionality.

AI response is returned within reasonable time (~5–10 seconds).

