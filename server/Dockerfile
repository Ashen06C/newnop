# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port (defaulting to 5000 as per common Express setup)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
