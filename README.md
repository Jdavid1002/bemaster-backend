# Node.js TypeScript Template with Express and MongoDB

This is a TypeScript template for a Node.js project using the Express framework and MongoDB as the database. The template contains the following features:

- Routes management with versioning and route access.
- Passport JWT authentication.
- MVC architecture with separate folders and code for routes, models, services, and middlewares.
- Session management with JWT token.
- API rate limit.
- Generic response management i.e. error and success responses.
- Env management with validation.
- Full TypeScript support.
- Code validation with tests. Tests are written using chai.

The project includes code for user login, signup, logout, creating, updating, and deleting videos with user feed management.

## Project Structure

- src
  - config
    - config.ts
    - Db.ts
    - Logger.ts
    - Morgan.ts
    - Passport.ts
    - Tokens.ts
  - controllers
    - auth.controller.ts
    - video.controller.ts
  - middlewares
    - Auth.ts
    - Error.ts
    - rateLimiter.ts
    - Validate.ts
  - models
    - like.ts
    - video.ts
    - token.ts
    - wallet.ts
    - user.ts
  - routes
    - auth.ts
    - video.ts
  - services
    - like.service.ts
    - video.service.ts
    - token.service.ts
    - wallet.service.ts
    - user.service.ts
  - tests
    - auth.test.ts
    - video.test.ts
  - validations
    - auth.validation.ts
    - video.validation.ts

# Setup
- Clone this repository.
- Run npm install to install all dependencies.
- Create a .env file in the root directory and add your environment variables (refer to config/config.ts for required variables).
- Run npm run start to start the server.
- Access the server at http://localhost:3000.

# Usage

## Routes
All routes are defined in the routes folder. There are currently two routes: auth and video.

Auth Routes
- POST /auth/signup: creates a new user.
- POST /auth/login: logs in an existing user.
- POST /auth/logout: logs out the currently logged in user.

video Routes
- GET /videos: gets all videos.
- GET /videos/:id: gets a single video by ID.
- POST /videos: creates a new video.
- PUT /videos/:id: updates an existing video by ID.
- DELETE /videos/:id: deletes an existing video by ID.

## Authentication
All routes except for POST /auth/signup and POST /auth/login require authentication. Authentication is done using Passport JWT and the Auth middleware in the middlewares folder.

## Validation
All request bodies, query parameters, and URL parameters are validated using the Validate middleware in the middlewares folder.

## Rate Limiting
API rate limiting is implemented using the rateLimiter middleware in the middlewares folder.

## Response Management
All responses are managed using the Error and Success middlewares in the middlewares folder.

## Tests
Tests are written using Chai and can be found in tests folder.

