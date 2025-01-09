# URL Shortener with Optional Password Protection

A simple Node.js + Redis URL shortener. Password protection is optional per URL.

## Features

- **Shorten URL**: `POST /shorten`
- **List URLs**: `GET /urls`
- **Redirect**: `GET /:shortId`
- **Optional Password**: Provide `password` field during shortening. If set, requests must supply a password.

## Requirements

- Docker & Docker Compose
- Redis Docker container runs alongside the Node.js app

## Quick Start

```bash
docker-compose up --build
