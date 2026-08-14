# Co-Driver School Project

This repository contains the complete source code and exported database for the Co-Driver project.

## Project Structure

This project is divided into three main components:
- **`frontend/`**: The mobile application built with React Native and Expo.
- **`backend/`**: A Node.js API server.
- **`supabase/`**: The local configuration for our database backend (powered by Supabase & PostgreSQL).

## Database Export

As required, the exported database structure and data can be found in the root of the repository as **`co-driver_db.sql`**.

## Why is there a `supabase` folder?

The `supabase` folder is included so that anyone reviewing the project can easily spin up a local instance of the database and backend services without needing to create any cloud accounts. It uses Docker to run a complete, self-hosted PostgreSQL and API environment locally on your machine.

---

## How to Run the Project Locally

### Prerequisites
- Node.js (v18+) and npm/bun
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (required to run the local database)
- Supabase CLI (`npm install -g supabase`)

### 1. Start the Database
Open your terminal at the root of the repository and run:
```bash
npx supabase start
```
*Docker must be running in the background for this to work.*

This command downloads and starts the local database. Once finished, it will output your local `API URL`, `anon key`, and a link to the local **Studio UI** (usually `http://127.0.0.1:54323`).

**Importing the Data:**
To load the exported database into your local instance:
1. Open the local Studio UI in your browser (`http://127.0.0.1:54323`).
2. Navigate to the **SQL Editor**.
3. Copy the entire contents of `co-driver_db.sql` and paste it into the editor.
4. Click **Run** to recreate the database tables and insert the sample data.

### 2. Start the Backend
Open a new terminal window, navigate to the `backend` directory, install the dependencies, and start the server:
```bash
cd backend
npm install
npm start
```
*(Make sure you have copied any `.env.example` to `.env` if required by the backend, pointing your environment variables to the local Supabase credentials outputted in step 1).*

### 3. Start the Frontend (Expo App)
Open a third terminal window, navigate to the `frontend` directory, install the dependencies, and start the Expo server:
```bash
cd frontend
npm install
npm start
```
This will launch the Expo Metro bundler. You can press `a` to open it on an Android emulator, `i` for an iOS simulator, or scan the QR code with the Expo Go app on your mobile device to test it live.
