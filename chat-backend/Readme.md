Backend Project
This is the backend part of the project. It is built using Node.js and Express.

Prerequisites
Node.js
npm or yarn
Installation
Clone the repository: git clone <repository-url>
Navigate to the backend directory: cd chat-backend
Install the dependencies: npm install or yarn install
Running the Application
Start the development server: npm start or yarn start
The backend server will be running on http://localhost:5000.

Docker
To build and run the Docker container:

Build the Docker image: docker build -t backend .
Run the Docker container: docker run -p 5000:5000 --env-file .env backend
