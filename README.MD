
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
npm install
npm test
```
## PostMan Testing
You can import Postman Collection to see predefined use case 

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
Each click is registered in clickCount for db object
If url is protected you should have Authorization header with structure : Bearer $password

Redirect to the original URL.
### GET `/urls`
**Response**:
  ```json
  [
    {
        "shortId": "uVl9wK",
        "shortUrl": "http://localhost:3000/uVl9wK",
        "originalUrl": "https://example.io/",
        "clickCount": 1,
        "createdAt": "2025-01-09T18:54:35.693Z"
    }
]
  ```
### Error Handling

All errors return a JSON response with an appropriate status code.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
