# Movie Discovery App

A full-stack movie discovery web application that allows users to browse, search, filter, sort, view movie details, and maintain a persistent wishlist.

## Features

- Browse movies without searching
- Search for movies
- Filter movies by genre
- Sort movies by popularity, rating, and release date
- Pagination for exploring more movies
- View detailed information about a movie
- Add movies to a persistent wishlist
- Remove movies from the wishlist with confirmation
- Responsive design for different screen sizes
- Loading, empty, and error states
- Backend abstraction for third-party movie API communication
- Handles movies with missing poster images

## Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express.js
- Axios

### Database

- MongoDB
- Mongoose

### External API

- TMDB API

## Project Structure

```text
movie-discovery-app/
│
├── backend/
│   ├── models/
│   │   └── Wishlist.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MovieCard.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   └── Wishlist.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Architecture

The frontend communicates with the Node.js and Express backend.

The backend communicates with the TMDB API to retrieve movie information and transforms the response before sending the required data to the frontend.

The backend also communicates with MongoDB to store and retrieve wishlist information.

```text
                    ┌─────────────────┐
                    │  React Frontend │
                    │     (Vite)      │
                    └────────┬────────┘
                             │
                             │ HTTP Requests
                             ▼
                    ┌─────────────────┐
                    │ Node.js +       │
                    │ Express Backend │
                    └───────┬─────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
                 ▼                     ▼
          ┌─────────────┐       ┌─────────────┐
          │   TMDB API  │       │   MongoDB   │
          │             │       │  Wishlist   │
          └─────────────┘       └─────────────┘
```

## API Endpoints

### Movie Endpoints

**Browse Movies**

```text
GET /api/movies
```

**Search Movies**

```text
GET /api/movies?search=movie_name
```

**Filter by Genre**

```text
GET /api/movies?genre=genre_id
```

**Sort Movies**

```text
GET /api/movies?sort=popularity.desc
```

**Pagination**

```text
GET /api/movies?page=2
```

The `/api/movies` endpoint supports combining query parameters such as search, genre, sort, and page.

**Movie Details**

```text
GET /api/movies/:id
```

### Genre Endpoint

```text
GET /api/genres
```

### Wishlist Endpoints

**Get Wishlist**

```text
GET /api/wishlist
```

**Add to Wishlist**

```text
POST /api/wishlist
```

The request contains:

```text
movieId
title
posterPath
releaseDate
rating
```

**Remove from Wishlist**

```text
DELETE /api/wishlist/:movieId
```

Each wishlist document contains:

```text
movieId
title
posterPath
releaseDate
rating
createdAt
updatedAt
```

The movie ID is unique so that the same movie cannot be added multiple times.

## TMDB Integration

The application uses the TMDB API as the external movie data source. The frontend does not communicate directly with TMDB.

Requests follow this flow:

```text
React Frontend
      ↓
Express Backend
      ↓
TMDB API
      ↓
Express Backend
      ↓
React Frontend
```

This keeps the external API key on the backend and allows the backend to abstract and transform the external API response.

## Error Handling

The application handles several common situations:

- TMDB request timeouts and temporary network failures
- TMDB requests use a timeout to prevent requests from hanging indefinitely
- Automatic retry for retryable temporary network failures
- Movie API request failures
- Database failures
- Empty search results
- Empty wishlist
- Missing movie poster images
- Missing release dates
- Missing movie overview
- Duplicate wishlist entries
- Failed wishlist operations

The application provides feedback while data is being loaded.

Examples include:

```text
Loading movies...
Loading movie details...
Loading wishlist...
```

## Responsive Design

The application uses responsive CSS so that the layout adapts to different screen sizes, including desktop, tablet, and mobile devices.

The movie grid, navigation, search controls, filters, movie details, pagination, wishlist, and confirmation modal are adjusted for smaller screen sizes.

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=your_mongodb_connection_string
```

Do not commit the `.env` file to version control.

## Installation

### 1. Install Backend Dependencies

Open a terminal:

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 3. Configure Environment Variables

Create:

```text
backend/.env
```

Add:

```env
TMDB_API_KEY=your_tmdb_api_key
MONGODB_URI=your_mongodb_connection_string
```

### 4. Start the Backend

```bash
cd backend
npm run dev
```

The backend normally runs on:

```text
http://localhost:5000
```

### 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

If port 5173 is already in use, Vite may automatically start the frontend on another available port such as 5174.

## Production Build

To create a production build of the frontend:

```bash
cd frontend
npm run build
```

The production build is generated in the `frontend/dist` directory.

## Security

Sensitive credentials such as the TMDB API key and MongoDB connection string are stored in environment variables.

The `.env` file is excluded from version control using `.gitignore`.

The frontend communicates with the application's backend instead of directly exposing the TMDB API key.

## AI Usage

AI tools were used during the development process for assistance with:

- Understanding and troubleshooting implementation issues
- Generating and refining code snippets
- Debugging errors during development
- Improving UI styling and responsive design
- Reviewing the project structure and documentation

The final application was tested manually, and the implementation was reviewed and adapted to meet the assignment requirements.

## Future Improvements

Possible future improvements include:

- User authentication
- User-specific wishlists
- Movie recommendations
- More advanced filtering
- Infinite scrolling
- More advanced notification and feedback handling
- Improved caching
- More detailed movie information
