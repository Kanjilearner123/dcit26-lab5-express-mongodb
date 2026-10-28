
# DCIT 26 Laboratory 5: Express and MongoDB

Student Records REST API built using Node.js, Express, MongoDB, and Mongoose.

## Requirements

- Node.js and npm
- MongoDB Community Server

## Installation

1. Clone or download this repository.
2. Install dependencies:

   npm install

3. Create a local `.env` file using `.env.example` as a template.
4. Ensure MongoDB is running.
5. Start the development server:

   npm run dev

The API runs on http://localhost:5000 by default.

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Check server status |
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get one student |
| POST | /api/students | Create a student |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |

## Sample Request Body

{
  "fullName": "Alex Santos",
  "course": "BSIT",
  "yearLevel": 2,
  "section": "IT-2A"
}

## Database

The default local database is `lab5_students`.

MongoDB connection string:

mongodb://127.0.0.1:27017/lab5_students

## Validation

- Full name and course are required.
- Year level must be a whole number from 1 to 4.
- Section is optional.
- Invalid IDs and inputs return HTTP 400.
- Missing student records return HTTP 404.
- Unexpected server errors return HTTP 500.

## Security

Never commit your local `.env` file. It is excluded through `.gitignore`.
