# E-TAP MOVIES

This is a test movies application with frontend in Nextjs and backend in NestJs. To run the application pull from this github respository to your local device.

## Backend

To setup the backend from the project root directory

1. Run command `cd backend` to change the terminal directory.
2. Run the command `npm install` to install the project dependencies.
3. Then edit the file `backend/src/app.module.ts` with your own Postgres Database configuration. This was done this way to make it easy to setup the app.
4. Run the command `npm run start:dev` to run the application locally, the service will be available on `http://localhost:3000`
5. You can also run tests with `npm run test:watch` to run the tests and watch

To test through postman you can use the collection. https://documenter.getpostman.com/view/3507920/2s93JqTRMR to test.

This apllicatrion hass the followiung features.

1. Create a new movie
2. View a list of movies
3. Search for movies by title or genre
4. View Single movie
5. Filter movies and other by multiple fields

## Frontend

To setup the frontend from the project root directory

1. Run command `cd frontend` to change the terminal directory.
2. Run the command `npm install` to install the project dependencies.
3. The frontend connects to `http://localhost:3000` so ensure the backend is running on that port or you update `frontend/src/pages/index.tsx` and update the variable `url_root` to the backend's root url
4. Run command `npm run dev` to run the frontend locally

The frontend has the following features

1. Create a new movie
2. List the movies currewntly available in the Database
3. Search for movies by their title or genre in case insensitive way
4. Pagination
5. You can view more information about a movie by clicing on the `>` on the movie in the movie table. this shows more details below the movie
