
# URL Shortener

This is a simple URL Shortener application built with Node.js, Express, Redis, and Jest for testing.

## Features

- Shorten URLs with or without a password.
- Rate-limiting middleware to prevent abuse.
- Redis as the in-memory database for quick URL lookup and storage.
- Jest for unit and integration testing.

## Prerequisites

- have docker compose

## Installation

1. Clone the repository:
2. run 
```
docker-compose up --build
```

The application will run at `http://localhost:3000`.

## Testing

Run all unit and integration tests:

```bash
npm test
```

To detect open handles during tests:

```bash
npm test
```
## PostMan Testing
You can import Postman Collection to see predefined use case 
## Project Structure

```
src/
├── app.js             # Express application setup
├── index.js           # Server startup
├── middlewares/       # Middleware functions
│   ├── auth.js        # Authentication middleware
│   ├── rateLimiter.js # Rate limiting middleware
├── routes/            # API routes
├── services/          # Business logic
├── config/            # Configuration files
│   ├── redis.js       # Redis client setup
├── utils/             # Utility functions
test/
├── integration/       # Integration tests
├── unit/              # Unit tests
.env                   # Environment variables
```

## API Endpoints

### POST `/shorten`

Create a short URL.

- **Request Body**:
  ```json
  {
    "originalUrl": "https://example.com",
    "password": "optional"
  }
  ```

- **Response**:
  ```json
  {
    "shortUrl": "http://localhost:3000/abc123"
  }
  ```

### GET `/:shortId`
example : http://localhost:3000/abc123

Redirect to the original URL.

### Error Handling

All errors return a JSON response with an appropriate status code.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
