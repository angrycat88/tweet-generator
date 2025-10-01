# API Integration

This directory contains the API service for communicating with the backend.

## Files

- `tweetService.ts` - Main API service with methods for generating tweets and health checks

## Usage

The service is automatically imported and used in the TweetGenerator component. It handles:

- POST requests to `/generate-tweets` endpoint
- Error handling and response transformation
- Type-safe request/response interfaces

## Environment Variables

Set `REACT_APP_API_URL` to your backend URL (defaults to `http://localhost:3001`).
