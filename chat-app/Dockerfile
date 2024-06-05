# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /AnswersAI/chat-app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the build files
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Serve the build files
CMD ["serve", "-s", "build", "-l", "3000"]
