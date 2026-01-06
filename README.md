# Issue Tracker

A full-stack Issue Tracker CRUD application built with React, Express, MongoDB, and TypeScript. This application allows users to manage issues 

## Features

*   **Issue Management**: Create, Read, Update, and Delete (CRUD) issues.
*   **Status Tracking**: Track issues by status (Open, In Progress, Resolved, Closed).
*   **Dashboard**: Overview of issue statistics and paginated issue list.
*   **Authentication**: Secure user registration and login using JWT.
*   **Responsive UI**: Modern, responsive interface built with Tailwind CSS and Shadcn UI.
*   **Export**: Export issue data to JSON.

## Tech Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Shadcn UI
*   **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose), JSON Web Token (JWT)
*   **Tools**: Docker, Azure, Vercel

## Setup Instructions


### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd issue-tracker
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    # Create .env file
    echo "PORT=5000" > .env
    echo "MONGO_URI=mongodb://localhost:27017/issuetracker" >> .env
    echo "JWT_SECRET=your_jwt_secret" >> .env
    # Run server
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install
    # Run client
    npm run dev
    ```

4.  **Access the App:**
    Open `http://localhost:5173` in your browser.

## Docker Support

To run the backend using Docker:

```bash
cd server
docker build -t issue-tracker-server .
docker run -p 5000:5000 issue-tracker-server
```

## API Documentation

*   `POST /api/users/register`: Register a new user.
*   `POST /api/users/login`: Login user.
*   `GET /api/issues`: Get paginated issues (supports `?pageNumber=1&keyword=search`).
*   `POST /api/issues`: Create a new issue.
*   `GET /api/issues/:id`: Get issue details.
*   `PUT /api/issues/:id`: Update issue.
*   `DELETE /api/issues/:id`: Delete issue.
