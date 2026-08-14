# Co-Driver School Project

This repository contains the complete source code and exported database for the Co-Driver project.

## Project Structure

This project is divided into two main components:
- **`frontend/`**: The mobile application built with React Native and Expo.
- **`backend/`**: A Node.js API server connected to a standard PostgreSQL database.

## Database Export

As required, the exported database structure and data can be found in the root of the repository as **`co-driver_db.sql`**. This file is used to seed the initial data into a PostgreSQL database.

---

## How to Run the Project Locally

### Prerequisites
- Node.js (v18+) and npm/bun
- PostgreSQL (v14+) installed and running locally

### 1. Setup the Database
You need a standard PostgreSQL server running on your machine.

**Importing the Data:**
1. Create a new database in your local PostgreSQL instance (e.g., `codriver_db`).
2. Import the `co-driver_db.sql` file into your newly created database. You can do this using a GUI like pgAdmin, or via the command line:
   ```bash
   psql -U your_postgres_user -d codriver_db -f co-driver_db.sql
   ```

### 2. Start the Backend
Open a terminal window, navigate to the `backend` directory, and install the dependencies:
```bash
cd backend
npm install
```

Configure your environment variables by creating a `.env` file in the `backend` directory. Provide your local PostgreSQL credentials:
```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=codriver_db
PGPASSWORD=your_password
PGPORT=5432
PORT=5000
```

Start the server:
```bash
npm start
```

### 3. Start the Frontend (Expo App)
Open another terminal window, navigate to the `frontend` directory, install the dependencies, and start the Expo server:
```bash
cd frontend
npm install
npm start
```
This will launch the Expo Metro bundler. You can press `a` to open it on an Android emulator, `i` for an iOS simulator, or scan the QR code with the Expo Go app on your mobile device to test it live.
