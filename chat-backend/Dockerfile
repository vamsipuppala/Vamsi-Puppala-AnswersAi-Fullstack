# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory
WORKDIR /AnsersAI/chat=backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

COPY .env .env

# Expose the port the app runs on
EXPOSE 5000

# Define environment variable
ENV PORT=5000

# Run the application
CMD ["node", "server.js"]

