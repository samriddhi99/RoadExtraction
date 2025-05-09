# Project Setup Guide

## Prerequisites
- Python 3
- Node.js and npm
- MySQL

## Setup Instructions

### 1. Backend Setup
Navigate to the backend directory and start the application:
```bash
cd backend/app
python3 app.py
```

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

### 3. Database Setup
Set up a local MySQL instance with the following credentials:
- Username: `root`
- Password: `root`

**Note:** These credentials are hardcoded in the application. Ideally, we would use environment variables, but this is the current implementation.

### 4. Docker Status
We tried setting up Docker for this project but encountered issues with connecting the MySQL database to the backend.

The Dockerfiles for both the frontend and backend are included and should work independently, but the database connection was a roadblock.

If you're still keen on trying Docker, you can refer to the Dockerfiles in the root directories for both the frontend and backend.

Important: We have the change_detection.sql file in the db folder, which contains the necessary database setup. It might help in case you need to manually set up the database.

### 5. Known Issues
Setting up the entire system locally may be challenging due to the configuration requirements and the database connectivity issues mentioned above.

If you encounter problems, please reach out to the development team.
